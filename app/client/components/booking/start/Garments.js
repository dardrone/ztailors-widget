import React, { Component } from 'react';
import Expertise from './Expertise';
import Details from '../details/Details';
import Waitlist from '../waitlist/Waitlist';
import MissedAppointment from '../missedAppointments/MissedAppointment';
import User from '../../../services/ZApi/User';
import CartAbandonment from '../../../services/ZApi/CartAbandonment';
import Timeslots from '../../../services/ZApi/Timeslots';
import LoginModal from '../../shared/LoginModal';
import TimeslotsDropDown from '../../shared/TimeslotsDropDown';
import ZError from '../../shared/ZError';
import { isEmpty, isDefined, isNull, getZElementByAttributeName } from '../../../utils/Common';
import validator from 'validator';
import jcf from 'jcf';
import $ from 'jquery';

export default class Garments extends Component {

    constructor(props) {
        super(props);
        let emailAddress = this.getEmailAddress(props);
        this.state = {
            submitted: false,
            email: emailAddress,
            loading: false,
            error: {message: ''},
            emailError: {message: ''},
            expertiseError: {message: ''},
            timeslotsError: {message: ''},
            hasError: false,
            expertise: null,
            showLoginModal: false,
            resetPassword: false,
            password: '',
            dates: [{}],
            selectedDate: {timeslots: []},
            selectedTimeSlot: null,
            timeSlotsLoading: false,
            appointmentCount: 0,
            checkUserAttempts: 0,
            timeslotsAttempts: 0
        };
    }

    componentDidMount() {
        jcf.setOptions('Select', {
            wrapNative: false,
            wrapNativeOnMobile: false,
            maxVisibleItems: 10,
            fakeDropInBody: false
        });
        Details.jcfReload();
        $('.details-side-box>article:gt(1)').show();
        this.fetchTimeslots();
    }

    getEmailAddress() {
        let emailFromDOM = getZElementByAttributeName('user-email-address');
        return isEmpty(emailFromDOM) ? this.props.email : emailFromDOM;
    }

    fetchTimeslots(expertise) {
        let data = isDefined(expertise) ? {expertise: expertise} : undefined;
        let attempts = 2;
        if(data){
            this.setState({timeSlotsLoading: true});
        }
        return new Promise((resolve, reject) => {
            Timeslots.getAvailableTimeSlots(this.props.zipcode, data).then(response => {
                    /* If the response has valid data and the user has selected an expertise.*/
                    if (!isEmpty(response.data) && response.data.length != 0 && !isDefined(response.data.error) && isDefined(expertise)) {
                        Details.formatDates(response);
                        let appointmentCount = Garments.calculateNumberOfAppointmentsFromTimeslots(response.data);
                        this.setState({
                            dates: response.data,
                            selectedDate: response.data[0],
                            selectedTimeSlot: response.data[0].timeslots[0],
                            timeSlotsLoading: false,
                            appointmentCount: appointmentCount,
                            timeslotsError: {message:''}
                        }, () => {
                            Details.jcfReload();
                            resolve();
                        });
                    } else {

                        if (isDefined(expertise)) {
                            if (isDefined(response.data) && isDefined(response.data.error)) {
                                this.handleTimeslotErrorResponseWithMessage(`Sorry! We currently don't have any tailors in ${this.props.zipcode}. Select another garment type above.`);
                            } else {
                                this.setState({
                                    timeslotsError: {message: `Sorry! All our tailors are currently booked in ${this.props.zipcode} with the expertise '${expertise}'.`},
                                    timeSlotsLoading: false,
                                    selectedDate: {timeslots: []}
                                });
                            }
                        }
                        /* The user hasn't selected an expertise yet. */
                        else {
                            if (isDefined(response.data) && isDefined(response.data.error) && response.data.error.type == 'area_not_served') {
                                this.goToWaitlist();
                            }
                        }
                    }
                },
                response => {
                    this.setState({
                        timeSlotsLoading: false
                    });
                    if (response.status == 401) {
                        if (this.state.timeslotsAttempts < attempts) {
                            User.clearLocalUserToken();
                            this.setState({timeslotsAttempts: this.state.timeslotsAttempts + 1}, ()=> {
                                this.fetchTimeslots(expertise);
                            });
                        } else {
                            this.handleTimeslotErrorResponseWithMessage('Oops! Error getting timeslots.');
                        }
                    } else {
                        this.handleTimeslotErrorResponseWithMessage('Oops! Error getting timeslots.');
                    }
                });
        });
    }

    handleTimeslotErrorResponseWithMessage(errorMessage){
        this.setState({
            selectedDate: {timeslots: []},
            timeslotsError: {message: errorMessage},
            appointmentCount: 0,
            timeSlotsLoading: false
        });
    }

    handleChangeEmailAddress(e) {
        this.setState({
            email: e.target.value
        });
    }

    updateExpertise(expertise) {
        this.setState({
            expertise: expertise
        }, ()=> {
            this.setState({expertiseError: {message: ''}});
            this.fetchTimeslots(expertise.toLowerCase());
        });
    }

    onFormSubmit(e) {
        e.preventDefault();
        let validEmail = isDefined(this.state.email) ? validator.isEmail(this.state.email) : false;
        let validExpertise = !isNull(this.state.expertise);

        if (!validEmail) {
            this.setState({emailError: {message: 'Please, enter a valid email address'}});
        } else {
            this.setState({emailError: {message: ''}});
        }

        if (!validExpertise) {
            this.setState({expertiseError: {message: 'Please, choose a garment type'}});
        } else {
            this.setState({expertiseError: {message: ''}});
        }

        if (validEmail && validExpertise) {
            this.setState({emailError: {message: ''}});

            this.setState({
                loading: true
            });

            CartAbandonment.addCartAbandonment(
                {
                    zipcode: this.props.zipcode,
                    email: this.state.email
                }
            );

            let numberOfAttempts = 2;
            this.checkUser(numberOfAttempts);
        }
    }

    checkUser(numberOfAttempts) {
        User.checkUserExists(this.state.email, numberOfAttempts)
            .then(response => {
                    this.handleCheckUserSuccess(response, this.state.email);
                },
                response => {
                    this.handleCheckUserError(response, this.state.email, this.state.customerId, numberOfAttempts);
                });
    }

    handleLoginSuccessful() {
        /**
         | Ensure localStorage gets populated before
         | transitioning to the next view.
         */
        setTimeout(()=> {
            if (!isEmpty(window.localStorage.getItem('customerId'))) {
                this.goToNextViewTransition(false);
            }
        }, 1000);
    }

    handleCheckUserSuccess(response, email) {
        this.setState({loading: false, checkUserAttempts: 0});
        if (isDefined(response.data) && !isEmpty(response.data.customerId)) {
            if (!response.data.needs_password_reset) {
                this.setState({
                    email: email,
                    customerId: response.data.customerId
                });
                // ** "Remember me" check **
                if (!isEmpty(window.localStorage.getItem('customerId'))) {
                    if (window.localStorage.getItem('customerId').toString() === response.data.customerId.toString()) {
                        this.goToNextViewTransition(false);
                    } else {
                        this.resetAndLogin(response, email);
                    }
                }
                else {
                    this.resetAndLogin(response, email);
                }
            } else {
                this.resetPassword(email);
            }
        }
        else {
            this.goToNextViewTransition(true);
        }
    }

    goToNextViewTransition(clearToken) {
        /*
         | If the the zipcode can't be served
         | then route to waitlist.
         */
        if (this.state.timeslotsError.message.includes('Sorry! We currently don\'t have any tailors in', 0)) {
            this.goToWaitlist();
        } else if (this.state.timeslotsError.message.includes('Sorry! All our tailors are', 0)) {
            this.goToMissedAppointment();
        } else {
            if (clearToken) {
                User.clearLocalUserToken();
            }
            this.goToDetails();
        }
    }

    resetAndLogin(response, email) {
        User.clearLocalUserToken();
        this.setState({
            showLoginModal: true,
            email: email
        });
    }

    resetPassword(email) {
        User.clearLocalUserToken();
        this.setState({
            resetPassword: true,
            showLoginModal: true,
            email: email
        });
    }

    goToDetails() {
        this.props.updateViewIndex(
            <Details
                key="2"
                zipcode={this.props.zipcode}
                updateViewIndex={this.props.updateViewIndex.bind(this)}
                selectedTimeSlot={this.state.selectedTimeSlot}
                selectedDate={this.state.selectedDate}
                email={this.state.email}
                expertise={this.state.expertise}
                customerId={this.state.customerId}/>
        );
    }

    goToMissedAppointment() {
        this.props.updateViewIndex(
            <MissedAppointment
                key="203"
                zipcode={this.props.zipcode}
                customerId={this.state.customerId}
                email={this.props.email}
                expertise={this.props.expertise}
                updateViewIndex={this.props.updateViewIndex.bind(this)}
            />
            , false);
    }

    goToWaitlist() {
        this.props.updateViewIndex(
            <Waitlist
                key="202"
                zipcode={this.props.zipcode}
                customerId={this.state.customerId}
                email={this.state.email}
                updateViewIndex={this.props.updateViewIndex.bind(this)}
            />
            , false);
    }

    handleCheckUserError(response, email, customerId, numberOfAttempts) {
        User.clearLocalUserToken();
        if (this.state.checkUserAttempts < numberOfAttempts) {
            this.setState({checkUserAttempts: this.state.checkUserAttempts + 1}, ()=> {
                this.checkUser(numberOfAttempts);
            });
        } else {
            this.setState({
                loading: false,
                timeslotsLoading: false,
                error: {
                    status: response.status,
                    message: 'Error getting user.'
                }
            });
        }
    }

    handleChangeDate(e) {
        let index = e.target.selectedOptions[0].index;
        let selectedDate = this.state.dates[index];

        this.setState({
            selectedDate: selectedDate
        }, () => {
            Details.jcfReload();
        });
    }

    handleChangeTimeSlots(e) {
        let index = e.target.selectedOptions[0].index;
        let selectedTimeSlot = this.state.selectedDate.timeslots[index];

        this.setState({
            selectedTimeSlot: selectedTimeSlot
        });
    }

    static jcfReload() {
        jcf.destroyAll('.appointment-form');
        jcf.replaceAll('.appointment-form');
        jcf.destroyAll('.location');
        jcf.replaceAll('.location');
    }

    render() {
        return (
            <div>
                <form className="appointment-form" ref="form" onSubmit={this.onFormSubmit.bind(this)}
                      noValidate="novalidate">
                    <div id="appointment-form">
                        <Expertise handleUpdateExpertise={this.updateExpertise.bind(this)}
                                   zipcode={this.props.zipcode}/>
                        {this.state.selectedDate.timeslots.length > 0 && !this.state.timeSlotsLoading ?
                            <h3>Please choose a convenient date & time from available times below:</h3> : '' }
                        <ZError error={this.state.expertiseError}/>
                        <ZError error={this.state.error}/>
                        <TimeslotsDropDown
                            show={this.state.selectedDate.timeslots.length > 0}
                            dates={this.state.dates}
                            timeslots={this.state.selectedDate.timeslots}
                            loading={this.state.timeSlotsLoading}
                            handleChangeDate={this.handleChangeDate.bind(this)}
                            handleChangeTimeSlots={this.handleChangeTimeSlots.bind(this)}
                            appointmentCount={this.state.appointmentCount}
                        />
                        <ZError error={this.state.timeslotsError}/>
                        <div className="row">
                            <div className={this.state.emailError.message === '' ? '' : 'has-error'}>
                                <input
                                    id="z_email_address"
                                    className="garments-email-input"
                                    type="text"
                                    value={this.state.email}
                                    placeholder="Enter email address"
                                    onChange={this.handleChangeEmailAddress.bind(this)}/>
                                <ZError error={this.state.emailError}/>
                            </div>
                        </div>
                        <div className="row">
                            <button type="submit" className="btn-next jcf-ignore"
                                    disabled={this.state.loading || this.state.timeSlotsLoading}>
                                <span style={ {margin: '0 8px 0 0'}}>next</span>
                                <i className={!this.state.loading ? 'fa fa-caret-right' : 'fa fa-spinner' +' fa-spin'}/>
                            </button>
                        </div>
                    </div>
                </form>
                <LoginModal closeModal={() => this.setState({ customerId: null, showLoginModal: false})}
                            customerId={this.state.customerId}
                            email={this.state.email}
                            show={this.state.showLoginModal}
                            resetPassword={this.state.resetPassword}
                            onLogin={this.handleLoginSuccessful.bind(this)}
                />
            </div>
        );
    }

    static calculateNumberOfAppointmentsFromTimeslots(data) {
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].timeslots.length; ++j) {
                count++;
            }
        }
        return count;
    }
}

Garments.displayName = 'garments';