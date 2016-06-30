import MaskedInput from 'react-maskedinput';
import React, { Component } from 'react';
import { isEmpty, isDefined, isNull } from '../../../utils/Common';
import CustomerService from '../../../services/ZApi/Customer';
import User from '../../../services/ZApi/User';
import ZError from '../../shared/ZError';
import validator from 'validator';

export default class Customer extends Component {
    constructor(props) {
        super(props);
        this.state = props.customer;
        this.state.firstNameError = '';
        this.state.lastNameError = '';
        this.state.phoneError = '';
        this.state.password = '';
        this.state.confirmPassword = null;
        this.state.passwordError = '';
        this.state.isSubmitted = false;
    }

    inputChangeHandler(e) {
        let targetId = e.target.id;
        let targetValue = e.target.value;
        this.setState({[targetId]: targetValue}, () => {
            this.updateDetailsCustomer();
        });
    }

    handleOnBlur(e){
        let targetId = e.target.id;
        let targetName = e.target.name;
        if (!isNull(this.state.confirmPassword) && (targetId === 'password' || targetId === 'confirmPassword')) {
            this.isPasswordValid();
        } else {
            this.isInputValid(targetId, targetName.toLowerCase());
        }
    }

    updateDetailsCustomer() {
        this.props.updateCustomer(this.state);
    }

    parseAPIErrors(response) {
        if (isDefined(response.data) &&
            isDefined(response.data.error) &&
            isDefined(response.data.error.context)) {
            let error = null;
            for (error of response.data.error.context) {
                if (error.field === '[password]') {
                    this.setState({passwordError: {message: error.message}});
                }

                if (error.field === '[phone_number]' || error.field === 'data.phoneNumber') {
                    this.setState({phoneError: {message: error.message}});
                }
            }
        }
    }

    isPasswordValid() {
        let validPassword = !isEmpty(this.state.id) || (this.isInputValid('password')
            && this.isInputValid('confirmPassword')
            && !isEmpty(this.state.confirmPassword)
            && this.state.password === this.state.confirmPassword);
        if (!validPassword) {
            this.setState({passwordError: {message: `Please, enter a valid password`}});
            return false;
        } else {
            this.setState({passwordError: {message: ''}});
            return true;
        }

    }

    isValid() {
        let validFirstName = this.isInputValid('firstName', 'first name');
        let validLastName = this.isInputValid('lastName', 'last name');
        let validPhone = this.isInputValid('phone', 'phone number') && validator.isMobilePhone(this.state.phone.replace(/[-() X]/gi, '').trim(), 'en-US');
        let validPassword = this.isPasswordValid();

        return validFirstName && validLastName && validPassword && validPhone;
    }

    isInputValid(stateVariableName, displayName) {
        if (isEmpty(arguments[1])) {
            displayName = stateVariableName;
        }
        let validInput = !isEmpty(this.state[stateVariableName]);
        stateVariableName = `${stateVariableName}Error`;
        if (!validInput) {
            this.setState({[stateVariableName]: {message: `Please, enter a valid ${displayName}`}});
            return false;
        } else {
            this.setState({[stateVariableName]: {message: ''}});
            return true;
        }
    }

    submit() {
        let params = {
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            phone_number: this.state.phone,
            heard_about_us: '',
            email: this.props.email
        };

        return new Promise((resolve, reject) => {
            let pCustomerService;

            if (this.state.id) {
                pCustomerService = CustomerService.updateCustomer(this.state.id, params);
            } else {
                params.password = this.state.password;
                pCustomerService = CustomerService.createCustomer(params);
            }

            pCustomerService.then((response) => {
                this.setState({
                    id: response.data.id
                }, () => {
                    if (!isEmpty(this.state.password)) {
                        User.validateUserWithToken(this.props.email, this.state.password).then(response => {
                                if (!isEmpty(response.data['oauth_token'])) {
                                    window.localStorage.setItem('ztoken', response.data['oauth_token']);
                                    window.localStorage.setItem('ztoken_secret', response.data['oauth_token_secret']);
                                    window.localStorage.setItem('customerId', this.state.id);
                                }
                                this.updateDetailsCustomer();
                                resolve(this.state);
                            },
                            response => {
                                reject(response);
                            });
                    } else {
                        resolve(this.state);
                    }
                });
            }, (response) => {
                this.parseAPIErrors(response);
                reject(response);
            });
        });
    }

    render() {
        return (
            <fieldset className="contact-info">
                <div className="row">
                    <div className="col-left first-name-container">
                        <input id="firstName"
                               type="text"
                               name="first name"
                               required="required"
                               placeholder="First Name"
                               value={this.state.firstName}
                               className={!isEmpty(this.state.firstNameError.message) ? 'error-input' : ''}
                               onBlur={this.handleOnBlur.bind(this)}
                               onChange={this.inputChangeHandler.bind(this)}
                               disabled={this.props.disabled}/>
                        <ZError error={this.state.firstNameError}/>
                    </div>
                    <div className="col-right last-name-container">
                        <input id="lastName"
                               type="text"
                               required="required"
                               placeholder="Last Name"
                               name="last name"
                               className={!isEmpty(this.state.lastNameError.message) ? 'error-input' : ''}
                               value={this.state.lastName}
                               onBlur={this.handleOnBlur.bind(this)}
                               onChange={this.inputChangeHandler.bind(this)}
                               disabled={this.props.disabled}/>
                        <ZError error={this.state.lastNameError}/>
                    </div>
                </div>
                <div className="row phone-number-container">
                    <MaskedInput
                        id="phone"
                        name="phone number"
                        className={!isEmpty(this.state.phoneError.message) ? 'error-input' : ''}
                        mask="(111) 111-1111"
                        onBlur={this.handleOnBlur.bind(this)}
                        onChange={this.inputChangeHandler.bind(this)}
                        placeholderChar="X"
                        value={this.state.phone}
                        disabled={this.props.disabled}/>
                    <ZError error={this.state.phoneError}/>
                </div>
                {isDefined(this.state.id) && isNull(this.state.id) ?
                    <div className="row password-container">
                        <div className="col-left">
                            <input id="password"
                                   name="password"
                                   className={!isEmpty(this.state.passwordError.message) ? 'error-input' : ''}
                                   type="password"
                                   required="required"
                                   placeholder="Password"
                                   onBlur={this.handleOnBlur.bind(this)}
                                   value={this.state.password}
                                   onChange={this.inputChangeHandler.bind(this)}
                                   disabled={this.props.disabled}/>
                        </div>
                        <div className="col-right">
                            <input id="confirmPassword"
                                   name="confirmPassword"
                                   className={!isEmpty(this.state.passwordError.message) ? 'error-input' : ''}
                                   type="password"
                                   required="required"
                                   placeholder="Confirm Password"
                                   value={this.state.confirmPassword}
                                   onBlur={this.handleOnBlur.bind(this)}
                                   onChange={this.inputChangeHandler.bind(this)}
                                   disabled={this.props.disabled}/>
                        </div>
                        <ZError error={this.state.passwordError}/>
                    </div> : ''}
            </fieldset>
        )
    }
}
