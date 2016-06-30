import React, { Component } from 'react';
import CityStateInputLabel from './CityStateInputLabel';
import ZError from '../../shared/ZError';
import { isEmpty } from '../../../utils/Common';

export default class AddressInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: {message: ''},
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            state_abbreviation: ''
        };
    }

    isValid() {
        let validAddress1 = !isEmpty(this.state.addressLine1);
        if (!validAddress1) {
            this.setState({error: {message: 'Please, enter a valid address.'}});
        } else {
            this.setState({error: {message: ''}});
        }
        return validAddress1;
    }

    handleAddress1Change(e) {
        this.setState({
            addressLine1: e.target.value
        },() => {
            this.updateDetailsAddress(this.state);
        });
    }

    handleAddress2Change(e) {
        this.setState({
            addressLine2: e.target.value
        },() => {
            this.updateDetailsAddress(this.state);
        });
    }

    handleCityChange(city, state, state_abbreviation) {
        this.setState({
            city: city,
            state: state,
            state_abbreviation: state_abbreviation
        },() => {
            this.updateDetailsAddress(this.state);
        });
    }

    updateDetailsAddress() {
        this.props.updateAddress(this.state);
    }

    render() {
        return (
            <fieldset className="location">
                <div className="">
                    <input type="text" id="address-line-1"
                           required="required"
                           placeholder="Address 1"
                           value={this.state.addressLine1}
                           onChange={this.handleAddress1Change.bind(this)}
                           onBlur={this.isValid.bind(this)}
                           className={!isEmpty(this.state.error.message)
                           ? 'address-field address-line1 error-input' : 'address-field address-line1'}/>
                    <div className="list-error"></div>
                </div>
                <div className="">
                    <input type="text"
                           id="address-line-2"
                           placeholder="Address 2"
                           value={this.state.addressLine2}
                           onChange={this.handleAddress2Change.bind(this)}
                           onBlur={this.isValid.bind(this)}
                           className={!isEmpty(this.state.error.message)
                           ? 'address-field address-line2 error-input' : 'address-field address-line2'}/>
                </div>
                <ZError error={this.state.error}/>
                <CityStateInputLabel
                    handleCityChange={this.handleCityChange.bind(this)}
                    cityStates={this.props.cityStates}
                    zipcode={this.props.zipcode}
                    onClickAddNewAddress={this.props.onClickAddNewAddress}
                    hasExistingAddress={this.props.hasExistingAddress}
                    updateViewIndex={this.props.updateViewIndex} />
            </fieldset>
        );
    }
}