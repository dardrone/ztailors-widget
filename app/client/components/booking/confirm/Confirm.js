require('../../../../assets/sass/bf-confirm.scss');
import React, { Component } from 'react';
import { isEmpty } from '../../../utils/Common';
import Complete from '../../../components/booking/complete/Complete';
import Booking from '../../../services/ZApi/Booking';
import ZError from '../../shared/ZError';
import ZSpinner from '../../shared/ZSpinner';
import moment from 'moment';

export default class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: {message:''}
        };
    }

    onFormSubmit(e) {
        e.preventDefault();
        let startTime = moment(this.props.date + ' ' + this.props.time, 'dddd, MMMM D h:mm a').format();// 2016-2-6T17:00:00
        startTime = startTime.slice(0, -6);
        this.setState({loading: true});

        Booking.createBooking(
            {
                customer: this.props.customer.id,
                address: parseInt(this.props.address.id),
                start_time: startTime,
                expertise_filter: this.props.expertise.toLowerCase(),
                promo_code: this.props.promoCode
            }
        ).then(
            response => {
                this.setState({loading: false});
                this.props.updateViewIndex(
                    <Complete
                        key="3"
                        booking={response.data}
                        date={this.props.date}
                        time={this.props.time}
                        customer={this.props.customer}
                    />, false);
            },
            response => {
                this.setState({loading: false});
                this.setState({
                    error: {
                        status: response.status,
                        message: `Error adding booking. Please contact customer service ${CUSTOMER_SERVICE_PHONE_NUMBER}.`
                    }
                });
            }
        )
    }

    render() {
        return (
            <div>
                <div className="appointment-form details confirm-booking">
                    <ZError error={this.state.error} />
                    <form name="bf_confirm" method="post" id="confirm-form" onSubmit={this.onFormSubmit.bind(this)}>
                        <h2>You&apos;re Almost Finished</h2>
                        <h3>Please Confirm Your Appointment Details:</h3>

                        <fieldset className="timeday">
                            <p>Appointment Date &amp; Time:</p>
                            <h4 id="appointment-date">{this.props.date}</h4>
                            <h4 id="appointment-time">{this.props.time}</h4>
                        </fieldset>

                        <fieldset className="location">
                            <p>Appointment Location:</p>
                            <h4>{this.props.address.address_line_1}</h4>
                            <h4>{this.props.address.address_line_2}</h4>
                            <h4>{this.props.address.city }, {this.props.address.state} {this.props.address.postal_code}</h4>
                        </fieldset>

                        <fieldset className="contact-info">
                            <p>Contact Info:</p>
                            <h4>{this.props.customer.firstName} {this.props.customer.lastName}</h4>
                            <h4>
                                {this.props.customer.phone}
                            </h4>
                            <h4>{this.props.customer.email}</h4>
                        </fieldset>

                        {!isEmpty(this.props.promoCode)?
                            <fieldset>
                                <p>Promo Code:&nbsp;
                                    <b className="promo-code-value">{this.props.promoCode}</b>
                                </p>
                            </fieldset> : ''
                        }

                        <div className="confirm-actions">
                            <button type="submit"
                                    onChange={this.onFormSubmit.bind(this)}
                                    className="btn-next"
                                    disabled={this.state.loading}>BOOK APPOINTMENT
                                <ZSpinner show={this.state.loading} inverse={true}/>
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