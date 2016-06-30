import React, { Component } from 'react';
import Zipcode from '../zipcode/Zipcode';
import ThankYou from './../../shared/ThankYou';
import WaitlistService from '../../../services/ZApi/Waitlist';
import { isEmpty, isDefined } from '../../../utils/Common';
import ZError from '../../shared/ZError';
import validator from 'validator';

export default class Waitlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: {message: ''},
            email: this.props.email,
            loading: false
        }
    }

    inputChangeHandler(e) {
        let targetId = e.target.id;
        let targetValue = e.target.value;
        this.setState({[targetId]: targetValue});
    }

    goToZipcode() {
        this.props.updateViewIndex(
            <Zipcode key="1"
                     email={this.props.email}
                     updateViewIndex={this.props.updateViewIndex.bind(this)}/>,
            false);
    }

    goToWaitlistThankYou() {
        this.props.updateViewIndex(
            <ThankYou
                key="204"
                message="We'll notify you when we arrive in your area."
                updateViewIndex={this.props.updateViewIndex.bind(this)}/>, false);
    }

    onSubmitWaitlist(e) {
        e.preventDefault();
        if (this.isValid()) {
            this.setState({
                loading: true
            });
            WaitlistService.addWaitlist({
                zipcode: this.props.zipcode,
                email: this.state.email
            }).then(success => {
                this.setState({
                    loading: false
                });
                this.goToWaitlistThankYou();
            }, error => {
                this.setState({
                    error: {message: 'Error adding to waitlist.'},
                    loading: false
                });
            });
        }
    }

    isValid() {
        let validEmail = isDefined(this.state.email) ? validator.isEmail(this.state.email) : false;
        if (!validEmail) {
            this.setState({error: {message: 'Please, enter a valid address.'}});
        } else {
            this.setState({error: {message: ''}});
        }
        return validEmail;
    }


    render() {
        let isLoggedIn = !isEmpty(this.props.customerId);
        return (
            <fieldset className="appointment-form" id="waitlist-form">
                <div id="bloque_email" className="go-display waitlist">
                    <div className="contact-info-words">
                        <form onSubmit={this.onSubmitWaitlist.bind(this)} className="waitlist-form">
                            <h3 className="h3-title">Sorry, we&apos;re not yet serving this zip code.</h3>
                            {isLoggedIn ?
                                <div>We&apos;ll notify you when we arrive in your area.
                                    <br/>
                                    <br/>
                                    We'd love to help you though, so feel free to reach out to us at <br/><strong>{CUSTOMER_SERVICE_PHONE_NUMBER}</strong><br/><br/>
                                    <div className="row">
                                        <button type="button" onClick={this.goToZipcode.bind(this)}
                                                className="btn-next">Try Another Zipcode?
                                        </button>
                                    </div>
                                </div>
                                :
                                <div>
                                    <p>
                                        Sign up to be notified when we arrive in&nbsp;<strong
                                        id="spn_zipcode">{this.props.zipcode}</strong>.
                                    </p>
                                    <div className="row">
                                        <input
                                            onChange={this.inputChangeHandler.bind(this)}
                                            type="text"
                                            id="email"
                                            name="txt_email"
                                            value={this.state.email}
                                            placeholder="Email address"/>
                                    </div>
                                    <ZError error={this.state.error}/>
                                    <div className="row">
                                        <button type="submit" className="btn-next">Submit&nbsp;
                                            <i className={!this.state.loading ? 'fa fa-caret-right' : 'fa fa-spinner' +' fa-spin'}/>
                                        </button>
                                    </div>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </fieldset>
        );
    }
}

Waitlist.displayName = 'waitlist';