import React, { Component } from 'react';
import PaymentMethodService from '../../../services/ZApi/PaymentMethod';
import CreditCardTypeIndicator from './CreditCardTypeIndicator';
import guessCardTypes from 'credit-card-type';
import ZError from '../../shared/ZError';
import { isDefined } from '../../../utils/Common';
import jcf from 'jcf';

export default class PaymentMethodEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            number: null,
            type: null,
            postal_code: null,
            cvv: null,
            months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            years: [],
            expiration_month: null,
            expiration_year: null,
            error: {message: ''}
        };
    }

    initExpirationDate () {
        let today = new Date(),
            year = today.getFullYear(),
            years = [];

        for (let i = year; i < year + 6; i++) {
            years.push(i);
        }

        this.setState({
            years: years,
            expiration_year: year,
            expiration_month: this.state.months[today.getMonth()]
        }, () => {
            jcf.destroyAll('.payment-info-cc-row');
            jcf.replaceAll('.payment-info-cc-row');
        });
    }

    componentDidMount() {
        this.initExpirationDate();
    }

    handleMonthChange(e) {
        let index = e.target.selectedOptions[0].index;
        this.setState({
            expiration_month: this.state.months[index]
        });
    }

    handleYearChange(e) {
        let index = e.target.selectedOptions[0].index;
        this.setState({
            expiration_year: this.state.years[index]
        });
    }

    handleNumberChange(e) {
        let types = guessCardTypes(e.target.value),
            type = null;

        if (types.length === 1) {
            type = types[0].type;
        }

        this.setState({
            type: type,
            number: e.target.value
        });
    }

    inputChangeHandler(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    handleSubmitError (response) {
        let message;

        if (isDefined(response.data) &&
            isDefined(response.data.error) &&
            response.data.error.type === 'payment_error') {

            message = 'There was a problem processing your card. Please check your payment information and try again.';
        } else {
            message = `There was a problem processing your credit card; please double check your payment information and try again. If you keep experiencing issues, give us a call at: ${CUSTOMER_SERVICE_PHONE_NUMBER}`;
        }

        this.setState({
            error: {
                message: message
            }
        });
    }

    handleUseExistingClick(e) {
        this.props.hideEditMode();
    }

    submit() {
        return new Promise((resolve, reject) => {
            PaymentMethodService.createPaymentMethod({
                cvv: this.state.cvv,
                expiration_month: this.state.expiration_month,
                expiration_year: this.state.expiration_year,
                number: this.state.number,
                postal_code: this.state.postal_code,
                customer: this.props.customer.id
            }).then((response) => {
                this.props.setSelectedPaymentMethod(response.data);
                resolve();
            }, (response) => {
                this.handleSubmitError(response);
                reject();
            });
        });
    }

    render() {
        return (
            <div className="payment-info-edit">
                <div className="row payment-info-cc-row cf">
                    <div className="payment-info-cc-number">
                        <label htmlFor="credit_card_number" className="required">Credit card number:</label>
                        <input type="text"
                               id="number"
                               required="required"
                               className="form-control"
                               maxLength="19"
                               disabled={this.props.disabled}
                               onChange={this.handleNumberChange.bind(this)}/>
                    </div>
                    <div className="payment-info-cc-expires clearfix">
                        <label>Expiration:</label>
                        <div>
                            <select id="expiration_month"
                                    onChange={this.handleMonthChange.bind(this)}
                                    value={this.state.expiration_month}
                                    disabled={this.props.disabled}>
                                {this.state.months.map((month, i) => {
                                    return (
                                        <option key={i} value={month}>
                                            {month}
                                        </option>
                                    );
                                })}
                            </select>
                            <select id="expiration_year"
                                    onChange={this.handleYearChange.bind(this)}
                                    disabled={this.props.disabled}>
                                {this.state.years.map((year, i) => {
                                    return (
                                        <option key={i} value={year}>
                                            {year}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="payment-info-cc-cvc">
                        <label htmlFor="cvv">CVV:</label>
                        <input id="cvv"
                               type="password"
                               className="form-control"
                               maxLength="4"
                               disabled={this.props.disabled}
                               onChange={this.inputChangeHandler.bind(this)}/>
                    </div>
                    <div className="payment-info-cc-zipcode">
                        <label htmlFor="postal_code" className="required">Zip Code:</label>
                        <input id="postal_code"
                               type="text"
                               className="form-control"
                               maxLength="5"
                               disabled={this.props.disabled}
                               onChange={this.inputChangeHandler.bind(this)}/>
                    </div>
                </div>
                <div className="row clearfix">
                    <CreditCardTypeIndicator cardType={this.state.type} />
                    <div className="security-legend">
                        <span>For your protection we have secured this form with 256-bit SSL encryption.</span>
                    </div>
                    {this.props.paymentMethods.length ?
                        <div className="text-right">
                            <button type="button"
                                    className="btn btn-link"
                                    disabled={this.props.disabled}
                                    onClick={this.handleUseExistingClick.bind(this)}>Use existing</button>
                        </div> : ''
                    }

                </div>
                <ZError error={this.state.error}/>
            </div>
        )
    }
}