import React, { Component } from 'react';
import MaskedInput from 'react-maskedinput';
import TimeslotsDropDown from '../../shared/TimeslotsDropDown';
import MissedAppointmentsService from '../../../services/ZApi/MissedAppointments';
import ThankYou from '../../shared/ThankYou';
import { isEmpty, isDefined } from '../../../utils/Common';
import ZError from '../../shared/ZError';
import validator from 'validator';
import jcf from 'jcf';
import moment from 'moment';

export default class MissedAppointment extends Component {

    constructor(props) {
        super(props);
        let timeslots = MissedAppointment.getTimes();
        let dates = MissedAppointment.getDates();
        this.state = {
            error: {message: ''},
            loading: false,
            selectedTimeSlot: timeslots[0],
            selectedDate: dates[0],
            firstName: '',
            lastName: '',
            phone: '',
            firstNameError: {error: {message: ''}},
            lastNameError: {error: {message: ''}},
            phoneError: {error: {message: ''}},
            isCustomer: !isEmpty(this.props.customerId),
            timeslots: timeslots,
            dates: dates
        };
    }

    componentDidMount() {
        if (this.state.isCustomer) {
            this.LogMissedAppointment();
        }
        setTimeout(()=>{MissedAppointment.resetJcfFormElements();},100);
    }

    inputChangeHandler(e) {
        let targetId = e.target.id;
        let targetValue = e.target.value;
        let targetName = e.target.name;
        this.setState({[targetId]: targetValue}, () => {
            this.isInputValid(targetId, targetName.toLowerCase());
        });
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

    static getDates() {
        var now = new Date();
        var start = now.getDate();
        var dates = [];
        for (var i = 1; i < 14; i++) {
            var next = new Date(now.getTime());
            next.setDate(start + i);
            dates.push({
                date: next.toDateString(),
                dateObject: next
            });
        }
        return dates;
    }

    static getTimes() {
        return ['8am', '9am', '10am', '11am', 'noon', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'];
    }

    LogMissedAppointment() {
        let validFirstName = this.isInputValid('firstName', 'first name');
        let validLastName = this.isInputValid('lastName', 'last name');
        let validPhone = this.isInputValid('phone', 'phone number') && validator.isMobilePhone(this.state.phone.replace(/[-() X]/gi, '').trim(), 'en-US');

        if (validFirstName && validLastName && validPhone) {
            this.setState({
                loading: true
            });

            let customerInfo = {
                zipcode: this.props.zipcode
            };

            if(isDefined(this.props.email)){
                customerInfo.email = this.props.email;
            }
            if(isDefined(this.props.expertise)){
                customerInfo.expertise = this.props.expertise.toLowerCase();
            }
            if (!isEmpty(this.props.customerId)) {
                customerInfo.customerId = this.props.customerId;
            } else {
                //let dtMoment = moment(this.state.selectedDate.dateObject).format();
                customerInfo.customerId = null;
                customerInfo.first_name = this.state.firstName;
                customerInfo.last_name = this.state.lastName;
                customerInfo.phone_number = this.state.phone;
                //customerInfo.requested_time = dtMoment;
            }

            MissedAppointmentsService.addMissedAppointment({
                zipcode: customerInfo.zipcode,
                email: customerInfo.email,
                customerId: customerInfo.customerId,
                expertise_filter: customerInfo.expertise_filter,
                first_name: customerInfo.first_name,
                last_name: customerInfo.last_name,
                phone_number: customerInfo.phone_number,
                requested_time: customerInfo.requested_time
            }).then(success => {
                this.setState({
                    error: {message: ''},
                    loading: false
                });
                if (!this.state.isCustomer) {
                    this.goToThankYou();
                }
            }, error => {
                this.setState({
                    error: {message: 'Error adding to missed appointment.'},
                    loading: false
                });
            });
        }
    }

    handleChangeDate(e) {
        let index = e.target.selectedOptions[0].index;
        let selectedDate = this.state.dates[index];
        this.setState({
            selectedDate: selectedDate
        });
    }

    handleChangeTimeSlots(e) {
        let index = e.target.selectedOptions[0].index;
        let selectedTimeSlot = this.state.timeslots[index];
        this.setState({
            selectedTimeSlot: selectedTimeSlot
        });

    }

    goToThankYou() {
        this.props.updateViewIndex(
            <ThankYou
                key="204"
                message="We&apos;ll notify you when there are some available tailors to make your clothes look great."
                updateViewIndex={this.props.updateViewIndex.bind(this)}/>, false);
    }

    static resetJcfFormElements() {
        jcf.setOptions('Select', {
            wrapNative: false,
            wrapNativeOnMobile: false,
            maxVisibleItems: 10,
            fakeDropInBody: false
        });
        jcf.destroyAll('.appointment-form');
        jcf.replaceAll('.appointment-form');
    }

    render() {
        return (
            <div>
                { this.state.isCustomer ?
                    <ThankYou
                        key="204"
                        message="Sorry, we don't currently have tailors available in this zipcode. We&apos;ll notify you when there are some available tailors to make your clothes look great again."
                        updateViewIndex={this.props.updateViewIndex.bind(this)}/>
                    :
                    <div className="appointment-form">
                        <div id="bloque_email">
                            <div className="contact-info-words">
                                <h2>Something's come unstiched! </h2>
                                    <p>
                                        To fulfill your request we need more information.
                                    </p>

                                    <h3>Contact us:</h3>

                                    <p>Call or email our Concierge at</p>
                                    <p>
                                        <strong>(844) 982-4567 or conciergeservices@ztailors.com</strong>
                                    </p>
                                    <p>and we’ll match you up with a great zTailor.</p>
                                    <h3>Or we can contact you:</h3>
                                    <p>
                                        Leave your name, phone number, and desired appointment date & time and we will reach out shortly.
                                    </p>
                            </div>
                            <TimeslotsDropDown
                                dates={this.state.dates}
                                timeslots={this.state.timeslots}
                                handleChangeDate={this.handleChangeDate.bind(this)}
                                handleChangeTimeSlots={this.handleChangeTimeSlots.bind(this)}
                            />
                            <div className="row">
                                <div className="col-left first-name-container">
                                    <input id="firstName"
                                           type="text"
                                           name="first name"
                                           required="required"
                                           placeholder="First Name"
                                           value={this.state.firstName}
                                           className={!isEmpty(this.state.firstNameError.message) ? 'error-input' : ''}
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
                                           onChange={this.inputChangeHandler.bind(this)}
                                           disabled={this.props.disabled}/>
                                    <ZError error={this.state.lastNameError}/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="phone-number-container">
                                    <MaskedInput
                                        id="phone"
                                        name="phone number"
                                        className={!isEmpty(this.state.phoneError.message) ? 'error-input' : ''}
                                        mask="(111) 111-1111"
                                        onChange={this.inputChangeHandler.bind(this)}
                                        placeholderChar="X"
                                        value={this.state.phone}
                                    />
                                    <ZError error={this.state.phoneError}/>
                                </div>
                            </div>
                            <div className="row">
                                <button type="button" onClick={this.LogMissedAppointment.bind(this)}
                                        className="btn-next jcf-ignore">Submit&nbsp;
                                    <i className={!this.state.loading ? 'fa fa-caret-right' : 'fa fa-spinner' +' fa-spin'}/>
                                </button>
                            </div>
                        </div>
                        <ZError error={this.state.error}/>
                    </div>
                }
            </div>
        );
    }
}

MissedAppointment.displayName = 'no-availability';