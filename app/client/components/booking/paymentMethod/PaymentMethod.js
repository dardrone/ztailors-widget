import React, { Component } from 'react';
import PaymentMethodEdit from './PaymentMethodEdit';
import PaymentMethodService from '../../../services/ZApi/PaymentMethod';
import CustomerService from '../../../services/ZApi/Customer';
import { isNull } from '../../../utils/Common';
import jcf from 'jcf';

export default class PaymentMethod extends Component {

    constructor(props) {
        super(props);
        this.state = {
            number: null,
            postal_code: null,
            error: null,
            selected: null,
            items: [],
            showEdit: false
        };
    }


    loadPaymentMethods() {
        return new Promise((resolve, reject) => {
            CustomerService.getPaymentMethods(this.props.customer.id).then(response => {
                let selected = null;

                if (isNull(this.state.selected)) {
                    for (let item of response.data.items) {
                        if (item.default) {
                            selected = item;
                        }
                    }

                    if (isNull(selected) && response.data.items.length) {
                        selected = response.data.items[0];
                    }

                    this.setState({
                        selected: selected,
                        items: response.data.items
                    }, () => {
                        this.updateDetailsPaymentMethod();
                        resolve();
                    });
                } else {
                    resolve();
                }
            }, () => {
                reject();
            });
        });
    }

    handlePaymentMethodChange(e) {
        let index = e.target.selectedOptions[0].index;
        let paymentMethod = this.state.items[index];

        this.setSelectedPaymentMethod(paymentMethod);
    }

    hideEditMode() {
        this.setState({
            showEdit: false
        }, () => {
            jcf.destroyAll('.payment-info-section');
            jcf.replaceAll('.payment-info-section');
        });
    }

    showEditMode() {
        this.setState({
            showEdit: true
        }, () => {
            jcf.destroyAll('.payment-info-section');
            jcf.replaceAll('.payment-info-section');
        });
    }

    handleAddNewClick() {
        this.showEditMode();
    }

    updateDetailsPaymentMethod() {
        this.props.updatePaymentMethod(this.state.selected);
    }

    setSelectedPaymentMethod(paymentMethod) {
        this.setState({
            selected: paymentMethod
        }, () => {
            this.updateDetailsPaymentMethod();
        });
    }

    submit() {
        return new Promise((resolve, reject) => {
            if (this.state.items.length && !isNull(this.state.selected) && !this.state.showEdit) {
                if (!this.state.selected.default) {
                    // Set selected payment method as default, but fail silently
                    PaymentMethodService.updatePaymentMethod(this.state.selected.id, {
                        default: true
                    }).then(() => {
                        resolve();
                    }, () => {
                        resolve();
                    })
                } else {
                    resolve();
                }
            } else {
                this.refs['payment_method_edit'].submit().then(() => {
                    resolve();
                }, () => {
                    reject();
                });
            }
        });
    }

    render() {
        return (
            <fieldset className="contact-info payment-info-section">
                <h3>
                    Payment Information
                    <small>You will not be charged until your tailor is finished with your alterations</small>
                </h3>

                { this.state.items.length && !this.state.showEdit ?
                    <div className="row">
                        <div className="credit-card-info text-left" id="number-select">
                            <select onChange={this.handlePaymentMethodChange.bind(this)} disabled={this.props.disabled}>
                                {this.state.items.map((item, i) => {
                                    return (
                                        <option key={i} value={item.id}>
                                            {item.pm_info.card_type} ****{item.pm_info.last_4} {item.pm_info.expiration_month}/{item.pm_info.expiration_year}
                                        </option>
                                    );
                                })}
                            </select>

                            <button type="button"
                                    onClick={this.handleAddNewClick.bind(this)}
                                    className="btn btn-link jcf-ignore"
                                    disabled={this.props.disabled}>
                                Add new payment method
                            </button>
                        </div>
                    </div> :
                    <div>
                        <PaymentMethodEdit
                            ref="payment_method_edit"
                            customer={this.props.customer}
                            setSelectedPaymentMethod={this.setSelectedPaymentMethod.bind(this)}
                            paymentMethods={this.state.items}
                            hideEditMode={this.hideEditMode.bind(this)}
                            disabled={this.props.disabled} />
                    </div>
                }
            </fieldset>
        )
    }
}