import React, { Component } from 'react';
import Address from '../../../services/ZApi/Address';
import AddressInput from './AddressInput';
import ConfirmAddressModal from './ConfirmAddressModal';
import CityStateInputLabel from './CityStateInputLabel';
import SmartyStreets from '../../../services/SmartyStreets/SmartyStreets';
import ZError from '../../shared/ZError';
import ZSpinner from '../../shared/ZSpinner';
import {isEmpty, isNull} from '../../../utils/Common';
import jcf from 'jcf';

export default class AddAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            cityStates: [],
            exists: false,
            correctedAddress: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                state_abbreviation: '',
                zipcode: this.props.zipcode
            },
            error: {message: ''},
            showModal: false,
            addingNewAddress: false
        };
        if(this.state.addingNewAddress){
            this.props.handleClickAddNewAddress(true);
        }
    }

    componentDidMount() {
        this.getSmartyStreetsResponse(this.props.zipcode);
        this.jcfReload();
        if(isNull(this.props.customer.id) || this.props.customer.addresses.length === 0){
            this.setState({
                addingNewAddress: true
            }, ()=>{
                this.props.handleClickAddNewAddress(true);
            });
        }
    }

    getSmartyStreetsResponse(zipcode) {
        SmartyStreets.getCityState(zipcode).then(
            response => {
                let cityStates = SmartyStreets.getCitiesStatesFromResponse(response);
                this.setState({
                    cityStates: cityStates,
                    loading: false,
                    city: cityStates[0].city,
                    state: cityStates[0].state,
                    state_abbreviation: cityStates[0].state_abbreviation
                }, () => {
                    this.jcfReload();
                });
            },
            response => {
                this.setState({
                    loading: false
                });
            }
        );
    }

    jcfReload() {
        jcf.destroyAll('.appointment-form');
        jcf.replaceAll('.appointment-form');
    }

    handleCreateAddressError(response, isModal) {
        this.setState({loading: false});
        this.state.error = {message: ''};

        let errors = response.data.error.context;

        for (let i = 0; i < errors.length; ++i) {
            if (errors[i].constraint.includes('unique')) {
                this.state.error.message += errors[i].message.replace(/\[[0-9]*]/, '');
            } else if (errors[i].message.includes('typo')) {
                let correctedAddress = this.parseCorrectedAddressFromError(errors[i]);
                this.setState({
                    showModal: true,
                    exists: true,
                    correctedAddress: correctedAddress
                });
            } else {
                this.setState({
                    error: {message: errors[i].message},
                    showModal: true,
                    exists: false,
                    correctedAddress: {
                        addressLine1: this.state.addressLine1,
                        addressLine2: this.state.addressLine2,
                        city: this.state.city,
                        state_abbreviation: this.state.state_abbreviation
                    }
                });
            }
        }
        this.setState({
            error: {
                status: response.status,
                message: this.state.error.message
            }
        });
        if (isModal) {
            this.setState({showModal: false});
        }
    }

    parseCorrectedAddressFromError(error) {
        let correctedAddress = {
            addressLine1: this.state.addressLine1,
            addressLine2: this.state.addressLine2,
            zipcode: this.props.zipcode,
            city: this.state.city,
            state_abbreviation: this.state.state_abbreviation
        };
        if (error.field.includes('postalCode')) {
            correctedAddress.zipcode = error.message.replace(/(?![0-9])./g, '').replace('"?', '');
            return correctedAddress;
        }
        else if (error.field.includes('addressLine1')) {
            if (error.message.includes('typo')) {
                correctedAddress.addressLine1 = error.message.replace(/Detected typo: correct to "/, '').replace('"?', '');
                return correctedAddress;
            }
        } else if (error.field.includes('addressLine2')) {
            correctedAddress.addressLine2 = error.message.replace(/Detected typo: correct to "/, '').replace('"?', '');
            return correctedAddress;
        } else {
            throw new Error('Error parsing corrected address.');
        }
    }

    handleUseCorrectedAddress(address) {
        Address.createAddress(
            {
                address_type: 'home',
                address_line_1: address.addressLine1,
                address_line_2: address.addressLine2,
                city: address.city,
                postal_code: address.zipcode,
                state: address.state_abbreviation,
                customer: this.props.customer.id,
                specialInstructions: this.props.specialInstructions,
                default: true
            }
        ).then(success => {
            this.props.goToNextView(success.data);
        }, error => {
            this.handleCreateAddressError(error, true);
        });
    }

    onDismissAddressModal() {
        this.setState({
            showModal: false
        });
    }

    createAddress() {
        if (this.isValid()) {
            this.setState({loading: true});

            let p = Address.createAddress({
                address_type: 'home',
                address_line_1: this.state.addressLine1,
                address_line_2: this.state.addressLine2,
                city: this.state.city,
                postal_code: this.props.zipcode,
                state: this.state.state_abbreviation,
                customer: this.props.customer.id,
                specialInstructions: this.props.specialInstructions,
                default: true
            });
            p.catch(error => {
                this.handleCreateAddressError(error, false);
            });

            return p;
        } else {

            this.setState({
                error: {
                    message: 'Error adding address.'
                }
            });
        }
    }

    onUseInvalidAddressModal() {
        this.setState({
            showModal: false
        });
        Address.createAddress(
            {
                address_type: 'home',
                address_line_1: this.state.addressLine1,
                address_line_2: this.state.addressLine2,
                city: this.state.city,
                postal_code: this.props.zipcode,
                state: this.state.state_abbreviation,
                customer: this.props.customer.id,
                specialInstructions: this.state.specialInstructions,
                force_add: true,
                default: true
            }
        ).then(response => {
            this.props.goToNextView(response.data);
        }, response => {
            this.handleCreateAddressError(response);
        });
    }

    isValid() {
        return this.refs['address'].isValid();
    }

    handleChangeAddress(address) {
        this.setState({
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2
        });
        this.props.handleChangeAddress(address, true);
    }

    handleChangeAddressFromDropDown(e) {
        this.props.handleChangeAddress(e, false);
    }

    onClickAddNewAddress(show) {
        this.setState({
            addingNewAddress: show
        }, () => {
            this.jcfReload();
            this.props.handleClickAddNewAddress(show);
        });
    }

    render() {
        let hasExistingAddress = !isEmpty(this.props.customer.id) && this.props.customer.addresses.length > 0;
        let showAddressDropdown = hasExistingAddress && !this.state.addingNewAddress;

        let addressElementLoggedIn =
            <div>
                <select id="bf_details_address"
                        onChange={this.handleChangeAddressFromDropDown.bind(this)}>
                    {this.props.customer.addresses.map(function (object, key) {
                        return (<option key={key} className="" value={object.id}>
                                {object.address_line_1}, {object.city}, {object.state} {object.postal_code}
                            </option>
                        )
                    })}
                </select>
            </div>;
        return (
            <div className="">
                <ZError error={this.state.error}/>
                <div className="row">
                    {showAddressDropdown ? addressElementLoggedIn : ''}
                </div>
                {!this.state.addingNewAddress && hasExistingAddress ?
                    <div className="row text-left">
                        <button className="btn btn-default" type="button" id="add-address"
                                onClick={this.onClickAddNewAddress.bind(this, true)}
                                disabled={this.props.disabled}>Add New address
                        </button>
                    </div>
                    :
                    <div className="row">
                        <AddressInput
                            ref="address"
                            cityStates={this.state.cityStates}
                            zipcode={this.props.zipcode}
                            updateAddress={this.handleChangeAddress.bind(this)}
                            onClickAddNewAddress={this.onClickAddNewAddress.bind(this)}
                            hasExistingAddress={hasExistingAddress}
                            updateViewIndex={this.props.updateViewIndex}
                        />
                    </div>
                }
                <ConfirmAddressModal closeModal={() => this.setState({ showModal: false})}
                                     show={this.state.showModal}
                                     exists={this.state.exists}
                                     correctedAddress={this.state.correctedAddress}
                                     onDismissAddressModal={this.onDismissAddressModal.bind(this)}
                                     onUseInvalidAddressModal={this.onUseInvalidAddressModal.bind(this)}
                                     onUseCorrectedAddressModal={this.handleUseCorrectedAddress.bind(this)}
                />
            </div>
        )
    }
}