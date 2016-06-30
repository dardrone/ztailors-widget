import React, { Component } from 'react';
import Zipcode from '../booking/zipcode/Zipcode';

export default class ThankYou extends Component {

    constructor(props) {
        super(props);
    }

    goToNextView() {
        this.props.updateViewIndex(
            <Zipcode key="1"
                      updateViewIndex={this.props.updateViewIndex.bind(this)}/>,
            false);
    }

    render() {
        return (
            <fieldset className="appointment-form" id="waitlist-thank-you">
                <div id="bloque_email" className="go-display">
                    <h2>Thanks for your interest!</h2>
                    <p>{this.props.message}</p>
                    <br/>
                        <button id="thank-you-btn" className="btn-next" onClick={this.goToNextView.bind(this)}>Back to Homepage</button>
                </div>
            </fieldset>
        );
    }
}