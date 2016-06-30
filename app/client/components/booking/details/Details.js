import React, { Component } from 'react';
import Complete from '../complete/Complete';
import AddAddress from './../address/AddAddress';
import Timeslots from '../../../services/ZApi/Timeslots';
import User from '../../../services/ZApi/User';
import Booking from '../../../services/ZApi/Booking';
import CartAbandonment from '../../../services/ZApi/CartAbandonment';
import CustomerService from '../../../services/ZApi/Customer';
import Address from '../../../services/ZApi/Address';
import Customer from './Customer';
import PaymentMethod from './../paymentMethod/PaymentMethod';
import PromoCode from './PromoCode';
import ZError from '../../shared/ZError';
import { isEmpty, isDefined, isNull, reflect, getZElementByAttributeName, getCookieObject} from '../../../utils/Common';
import jcf from 'jcf';
import moment from 'moment';

export default class Details extends Component {

    constructor(props) {
        super(props);
        let promoCode = getZElementByAttributeName('promo-code');
        this.state = {
            dates: [{}],
            selectedAddress: {city: null, state: null, state_abbreviation: null},
            customer: {
                phone: null,
                address: null,
                firstName: null,
                lastName: null,
                addresses: [],
                password: null,
                confirmPassword: null,
                id: null,
                email: this.props.email
            },
            paymentMethod: null,
            alterationNotes: null,
            specialInstructions: null,
            loading: true,
            formLoading: false,
            showAddressModal: false,
            promoCode: isEmpty(promoCode) ? null : promoCode,
            error: {message: ''}
        };
    }

    componentDidMount(props) {
        this.loadFormData();

        jcf.setOptions('Select', {
            wrapNative: false,
            wrapNativeOnMobile: false,
            maxVisibleItems: 10,
            fakeDropInBody: false
        });
        Details.jcfReload();
    }

    loadFormData() {
        let pLoaders = [];
        this.checkUser(this).then(customerId => {
            if (!isNull(customerId) && isDefined(customerId)) {
                pLoaders.push(this.fetchCustomer(customerId));
                pLoaders.push(this.fetchAddress(customerId));
            }

            Promise.all(pLoaders.map(reflect)).then((results) => {
                this.setState({loading: false}, () => {
                    Details.jcfReload();
                });
            });
        }, () => {
            Promise.all(pLoaders.map(reflect)).then(() => {
                this.setState({loading: false}, () => {
                    Details.jcfReload();
                });
            });
        });
    }

    reloadCustomerData() {
        let pLoaders = [
            this.fetchCustomer(this.state.customer.id),
            this.fetchAddress(this.state.customer.id)
        ];

        this.setState({
            loading: true
        });

        Promise.all(pLoaders.map(reflect)).then(() => {
            this.setState({loading: false});
            Details.jcfReload();
        });
    }

    fetchCustomer(customerId) {
        return new Promise((resolve, reject) => {
            CustomerService.getCustomer(customerId)
                .then(success => {
                    this.state.customer.firstName = success.data.first_name;
                    this.state.customer.lastName = success.data.last_name;
                    this.state.customer.phone = success.data.phone_number;
                    this.state.customer.id = success.data.id;
                    this.setState({
                        customer: this.state.customer
                    }, () => {
                        this.refs['payment_method'].loadPaymentMethods().then(() => {
                            resolve();
                        });
                        this.refs['addAddress'].onClickAddNewAddress(false);
                    });
                }, (response) => {
                    reject(response);
                });
        });
    }

    fetchAddress(customerId) {
        return new Promise((resolve, reject) => {
            CustomerService.getAddresses(customerId).then(response => {
                let addresses = [];
                let defaultAddress = null;
                let zipcode = this.props.zipcode;

                response.data.items.forEach(function (value, key) {
                    if (value.postal_code === zipcode) {
                        addresses.push(value);
                        if (value.default) {
                            defaultAddress = value;
                        }
                    }
                });

                this.state.customer.addresses = addresses;
                this.setState({
                    customer: this.state.customer,
                    selectedAddress: isNull(defaultAddress) ? addresses[0] : defaultAddress
                }, () => {
                    Details.jcfReload();
                    resolve();
                });
            }, () => {
                reject();
            });
        });
    }

    checkUser(details) {
        return new Promise(function (resolve, reject) {
            if (isNull(details.props.customerId)) {
                resolve(null);
            }
            if (details.props.customerId !== null) {
                resolve(details.props.customerId);
            } else {
                User.checkUserExists(details.props.email)
                    .then(response => {
                            details.setState({
                                loading: false
                            });
                            resolve(response.data.customerId);
                        },
                        response => {
                            details.setState({
                                error: {
                                    status: response.status,
                                    message: 'Error getting user.'
                                },
                                loading: false
                            });
                            reject(response.data.customerId);
                        });
            }
        });
    }

    static formatDates(response) {
        for (let j = 0; j < response.data.length; ++j) {
            let dtMoment = moment(response.data[j].date, 'MM/DD/YYYY');
            response.data[j].date = dtMoment.format('dddd, MMMM D');
            response.data[j].datetime = dtMoment;

            for (let i = 0; i < response.data[j].timeslots.length; ++i) {
                let tMoment = moment(response.data[j].timeslots[i], 'H:mm');
                response.data[j].timeslots[i] = tMoment.format('h:mm a');
            }
        }
    }

    handleChangeAddress(e, isNewAddress) {
        if (isNewAddress) {
            this.setState({
                selectedAddress: e
            });
        } else {
            for (let i = 0; i < this.state.customer.addresses.length; ++i) {
                if (this.state.customer.addresses[i].id === e.target.value) {
                    this.setState({
                        selectedAddress: this.state.customer.addresses[i]
                    });
                }
            }
        }
    }

    inputChangeHandler(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    updateCustomer(c) {
        this.setState({
            customer: c
        });
    }

    updatePromoCode(promoCode) {
        this.setState({
            promoCode: promoCode
        });
    }

    updatePaymentMethod(paymentMethod) {
        this.setState({
            paymentMethod: paymentMethod
        });
    }

    checkRequiredFields() {
        let ok = true;
        ok = !isEmpty(this.state.customer.id) && ok;
        return ok;
    }

    onFormSubmit(e) {
        e.preventDefault();
        this.setState({loading: true, error: {message: ''}});

        let pPromoCode = this.processPromoCode();
        let pCustomer = null;
        let pPaymentMethod = null;

        let addressIsValid = (!isEmpty(this.props.customerId) && this.state.customer.addresses.length > 0) ?
            true : this.refs['addAddress'].isValid();
        let customerIsValid = this.refs['customer'].isValid();

        if (customerIsValid && addressIsValid) {
            pCustomer = this.refs['customer'].submit();
            pCustomer.then(customer => {
                pPaymentMethod = this.processPaymentMethod();
                let pProcesses = [pPromoCode, pPaymentMethod];
                Promise.all(pProcesses.map(reflect)).then((results) => {
                    let rejects = results.filter(p => p.status === 'rejected');
                    if (rejects.length === 0) {
                        CartAbandonment.addCartAbandonment(
                            {
                                zipcode: this.props.zipcode,
                                email: this.state.customer.email,
                                made_to_final_step: true
                            }
                        );
                        let pAddress = this.processAddressCreate();
                        pAddress.then(()=> {
                            this.bookAppointment();
                        }, () => {
                            this.setState({loading: false});
                        });
                    } else {
                        this.reloadCustomerData();
                    }
                });
            }, response => {
                this.setState({
                    loading: false,
                    error: {
                        message: 'Error creating user.'
                    }
                })
            });
        } else {
            this.setState({
                loading: false
            });
        }
    }

    processPromoCode() {
        let p = null;
        if (!isEmpty(this.state.promoCode)) {
            p = this.refs['promo_code'].isValid();
        } else {
            // Is empty so we return dummy promise
            p = new Promise((resolve, reject) => {
                resolve({});
            });
        }

        return p;
    }

    processAddressCreate() {
        return new Promise((resolve, reject) => {
            /*
             |----------------------------------------------------
             | If the selected address has an id, then it
             | exists and doesn't need to be created.
             |----------------------------------------------------
             |
             */
            if (this.state.customer.addresses.length > 0 && !isEmpty(this.state.selectedAddress.id)) {
                this.processAddressUpdate(this.state.selectedAddress, this.state.specialInstructions).then(response => {
                    resolve();
                });
            } else {
                this.refs['addAddress'].createAddress().then(response => {
                    this.setState({
                        selectedAddress: response.data
                    }, () => {
                        resolve();
                    });
                }, (response) => {
                    reject(response);
                });
            }
        });
    }

    processAddressUpdate(address, specialInstructions) {
        return Address.updateAddress(address.id, {
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            address_type: address.address_type,
            special_instructions: specialInstructions,
            default: address.default,
            force_add: true
        });
    }

    processPaymentMethod() {
        return this.refs['payment_method'].submit();
    }

    handleAddressCreate(address) {
        if (!isEmpty(address)) {
            this.setState({
                selectedAddress: address
            }, () => {
                this.bookAppointment();
            });
        } else {
            this.bookAppointment();
        }
    }

    bookAppointment() {
        let date = this.props.selectedDate.date,
            time = this.props.selectedTimeSlot,
            customer = this.state.customer,
            promoCode = this.state.promoCode;
        this.processBooking(date, time, customer,
            this.state.selectedAddress, this.props.expertise, promoCode, this.state.alterationNotes);
    }

    processBooking(date, time, customer, address, expertise, promoCode, alterationNotes) {
        let startTime = moment(date + ' ' + time, 'dddd, MMMM D h:mm a').format();// 2016-2-6T17:00:00
        startTime = startTime.slice(0, -6);
        this.setState({loading: true});

        let partner = getZElementByAttributeName('partner-id');

        /** Grab the referral parameters from the cookies. */
        let referralParams = getCookieObject('parameters_track');
        let referralObject = {
            ref_source: isNull(referralParams) ? null : referralParams['ref_source'],
            ref_det1: isNull(referralParams) ? null : referralParams['ref_det1'],
            ref_det2: isNull(referralParams) ? null : referralParams['ref_det2'],
            ref_det3: isNull(referralParams) ? null : referralParams['ref_det3'],
            ref_det4: isNull(referralParams) ? null : referralParams['ref_det4']
        };

        Booking.createBooking(
            {
                customer: customer.id,
                address: parseInt(address.id),
                start_time: startTime,
                expertise_filter: expertise.toLowerCase(),
                promo_code: promoCode,
                notes_for_tailor: alterationNotes,
                partner: isEmpty(partner) ? null : partner,
                ref_source: referralObject['ref_source'],
                ref_det1: referralObject['ref_det1'],
                ref_det2: referralObject['ref_det2'],
                ref_det3: referralObject['ref_det3'],
                ref_det4: referralObject['ref_det4']
            }
        ).then(
            response => {
                this.goToComplete(response, date, time, customer, promoCode);
            },
            response => {
                this.setState({
                    loading: false,
                    error: {
                        status: response.status,
                        message: `Error adding booking. Please contact customer service ${CUSTOMER_SERVICE_PHONE_NUMBER}.`
                    }
                });
            });
    }

    goToComplete(booking, date, time, customer, promoCode) {
        this.setState({loading: false});
        if (this.checkRequiredFields()) {
            this.props.updateViewIndex(
                <Complete
                    key="3"
                    booking={booking.data}
                    date={date}
                    time={time}
                    customer={customer}
                    promoCode={promoCode}
                />, false);
        }
    }

    handleClickAddNewAddress(show) {
        if (show) {
            this.setState({
                selectedAddress: {city: null, state: null, state_abbreviation: null}
            });
        }
    }

    static jcfReload() {
        jcf.destroyAll('.appointment-form');
        jcf.replaceAll('.appointment-form');
        jcf.destroyAll('.location');
        jcf.replaceAll('.location');
    }

    render() {
        let everythingIsLoading = this.state.loading || this.state.loading;
        return (
            <div>
                <span className="z-loading-title"
                      style={{display: this.state.loading && !this.showAddressModal ? 'inherit' : 'none'}}>
                    <h3><i className="fa fa-spinner fa-spin" style={{margin: '0 8px 0 0'}}/>
                    Loading</h3>
                </span>
                <div
                    className={this.state.loading ? 'z-form-loading appointment-form details' : 'appointment-form details'}>
                    <ZError error={this.state.error} inverse={false}/>
                    <form name="bf_details" method="post" id="details-form" noValidate="novalidate"
                          onSubmit={this.onFormSubmit.bind(this)}>
                        <fieldset className="location">
                            <h3>
                                Appointment Location &amp; Contact Information
                                <small>This information will only be used for your appointment purposes</small>
                            </h3>
                            <AddAddress
                                ref="addAddress"
                                zipcode={this.props.zipcode}
                                customer={this.state.customer}
                                specialInstruction={this.state.specialInstructions}
                                handleChangeAddress={this.handleChangeAddress.bind(this)}
                                handleClickAddNewAddress={this.handleClickAddNewAddress.bind(this)}
                                goToNextView={this.handleAddressCreate.bind(this)}
                                updateViewIndex={this.props.updateViewIndex}
                                disabled={everythingIsLoading}
                            />
                        </fieldset>
                        <Customer
                            ref="customer"
                            customer={this.state.customer}
                            customerId={this.state.customerId}
                            email={this.props.email}
                            updateCustomer={this.updateCustomer.bind(this)}
                            disabled={everythingIsLoading}/>

                        <PaymentMethod
                            ref="payment_method"
                            customer={this.state.customer}
                            updatePaymentMethod={this.updatePaymentMethod.bind(this)}
                            disabled={everythingIsLoading}/>

                        <PromoCode ref="promo_code"
                                   updatePromoCode={this.updatePromoCode.bind(this)}
                                   disabled={everythingIsLoading}
                                   customer={this.state.customer}
                                   promoCode={this.state.promoCode} />

                        <fieldset className="contact-info special-instruction-section">
                            <h3>Special Instructions for Your Tailor</h3>
                            <div className="row">
                                <input type="text"
                                       id="alterationNotes"
                                       name="bf_details[alterations_notes]"
                                       className="form-control"
                                       placeholder="Alterations Notes (Optional)"
                                       onChange={this.inputChangeHandler.bind(this)}
                                       value={this.state.alterationNotes}
                                       disabled={everythingIsLoading}/>
                            </div>
                            <div className="row">
                                <input type="text" id="specialInstructions"
                                       name="bf_details[address_special_instructions]"
                                       className="form-control"
                                       placeholder="Entry Instructions Upon Arrival (Optional)"
                                       onChange={this.inputChangeHandler.bind(this)}
                                       value={this.state.specialInstructions}
                                       disabled={everythingIsLoading}/>
                            </div>
                        </fieldset>
                        <div className="row">
                            <button type="submit" className="btn-next btn-book jcf-ignore"
                                    id="submit-details-form-button"
                                    disabled={everythingIsLoading}>
                                <span style={ {margin: '0 8px 0 0'}}>Book Appointment</span>
                                <i className={!this.state.loading ? 'fa fa-caret-right' : 'fa fa-spinner' +' fa-spin'}/>
                            </button>
                            <p className="legend">
                                By clicking "Book Appointment" you are agreeing to accept our Terms of Service and Privacy Policy. You must be 18 years of age or older to use this service.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

Details.displayName = 'details';