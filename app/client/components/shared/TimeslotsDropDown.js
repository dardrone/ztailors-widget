import React, { Component } from 'react';
import ZSpinner from '../shared/ZSpinner';
import Loader from 'react-loader';
import classNames from 'classnames';

export default class TimeslotsDropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            options: {
                lines: 17,
                length: 0,
                width: 3,
                radius: 12,
                scale: 1.5,
                corners: 1.0,
                opacity: 0.15,
                rotate: 0,
                direction: 1,
                speed: 1.0,
                trail: 83,
                top: '53%',
                left: '50%'
            }
        }
    }

    render() {
        let appointmentCountMessage = '';
        if (this.props.appointmentCount > 30) {
            appointmentCountMessage = <div className="appointment-count-message">
                <p>
                    <strong>{this.props.appointmentCount}&nbsp;
                        appointments with expert tailors are available for booking this week.
                    </strong>
                </p>
            </div>;
        }
        let timeDayClasses = classNames( 'timeday',
            this.props.appointmentCount > 0 || this.props.loading ? 'timeslots-active' : '');

        return (
            <fieldset className={timeDayClasses}>
                <Loader loaded={!this.props.loading} options={this.state.options}>
                    <div className="row" style={{display: this.props.show ? 'inherit' : 'none'}}>
                        <div className="col-left">
                            <select id="bf_details_appointment_days"
                                    onChange={this.props.handleChangeDate}
                                    disabled={this.props.loading}>
                                {this.props.dates.map(function (object, key) {
                                    return (<option key={key}>
                                            {object.date}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-right">
                            <select onChange={this.props.handleChangeTimeSlots}
                                    disabled={this.props.loading}>
                                {this.props.timeslots.map(function (object, key) {
                                    return (<option key={key}>
                                            {object}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    {appointmentCountMessage}
                </Loader>
            </fieldset>
        );
    }
}