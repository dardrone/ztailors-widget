require('../../../../assets/sass/bf-confirm.scss');
import React, { Component } from 'react';
import Booking from '../../../services/ZApi/Booking';
import { isEmpty } from '../../../utils/Common';
import ZError from '../../shared/ZError';
import bgTicketUp from '../../../../assets/img/bg-ticket-up.png';
import bgTicketDown from '../../../../assets/img/bg-ticket-down.png';
import Pixels from '../../../utils/Pixels';

export default class Complete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: {message: ''},
            appointment: {date: null, address: {address_line_1: null}}
        };
        this.getFirstBookingAppointment(props.booking.id).then(success => {
            this.setState({
                appointment: success.data.items[0]
            });
        });
    }

    getFirstBookingAppointment(id) {
        let promise = Booking.getBookingAppointments(id);
        promise.catch(() => {
            this.setState({error: {message: 'Error getting appointment.'}});
        });
        return promise;
    }

    render() {
        return (
            <div className="appointment-form complete" id="bf-complete-booking">
                <h2>Your Booking Is Confirmed!</h2>
                <div className="confirmation-ticket row cf">
                    <div className="col-left">
                        <span className="bg-up" style={{backgroundImage: 'url('+bgTicketUp+')' }}></span>
                        <div className="content-left">
                            <h3>
                                <em>Your zConfirmation</em>
                            </h3>
                            <hr/>
                            <br/>
                            <div className="row code-and-icons cf" style={{backgroundColor: '#f8e59a'}}>
                                <div className="row">
                                    <h3>Booking ID</h3>
                                    <div>{this.props.booking.job_code}</div>
                                </div>
                                <div className="row">
                                    <h3>Your tailor is confirmed to arrive</h3>
                                    <div>{this.props.date}</div>
                                    <div>{this.props.time}</div>
                                </div>
                                <div className="row">
                                    <h3>Appointment Location</h3>
                                    <div>
                                        {this.state.appointment.address.address_line_1}
                                    </div>
                                    <div>{this.state.appointment.address.city}, {this.state.appointment.address.state} {this.state.appointment.address.postal_code}</div>
                                </div>
                                <div className="row">
                                    <h3>Contact Info</h3>
                                    <div>{this.props.customer.firstName} {this.props.customer.lastName}</div>
                                    <div>{this.props.customer.phone}</div>
                                    <div>{this.props.customer.email}</div>
                                </div>
                                {!isEmpty(this.props.promoCode) ?
                                    <div className="">
                                        <br/>
                                        <p>Promo Code:&nbsp;
                                            <b id="promoCode">{this.props.promoCode}</b>
                                        </p>
                                    </div> : ''
                                }
                                <hr/>
                                <br/>
                            </div>
                        </div>
                        <span className="bg-down" style={{backgroundImage: 'url('+bgTicketDown+')' }}></span>
                    </div>
                    <div className="col-right">
                        <h3>What to Expect</h3>
                        <p>
                            Your zTailor will arrive at the scheduled time. We may call the number you provided if location clarification is needed.
                        </p>
                        <p>
                            During your fitting, your zTailor will perform any necessary markings on the garments you need altered.
                        </p>
                        <p>
                            At the end of your fitting, your zTailor will process credit card payment and arrange a return appointment. Please note, we only accept credit cards.
                        </p><br/>
                        <h3>Reschedule / Cancellation</h3>
                        <p>If for any reason you need to reschedule or cancel your appointment, give us a call at:
                            <em>1-844-982-4567</em>
                        </p><br/>
                        <h3>Our Guarantee</h3>
                        <p>
                            We promise that you'll love your zTailors experience. If we don't meet your expectations, please let us know and we'll make it right.
                        </p>
                    </div>
                </div>
                <div className="row">
                    <a target="_blank" href={ZTAILORS_SERVICES_URL} className="btn-next">SAMPLE MENU OF SERVICES ></a>
                </div>
                {NODE_ENV === 'prod' ? <Pixels id={this.props.booking.id}/> : ''}
            </div>
        );
    }
}

Complete.displayName = 'complete';