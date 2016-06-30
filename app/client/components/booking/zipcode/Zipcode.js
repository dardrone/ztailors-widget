import React, { Component } from 'react';
import ZError from '../../shared/ZError';
import Garments from '../start/Garments';
import {isEmpty, getZElementByAttributeName, isNumeric} from '../../../utils/Common';
import $ from 'jquery';

export default class Zipcode extends Component {

    constructor(props) {
        super(props);
        let zipcode = getZElementByAttributeName('user-zipcode');
        this.state = {
            zipcode: isEmpty(zipcode) ? null : zipcode,
            zipcodeError: {message: ''}
        }
    }

    componentDidMount(){
        $('.details-side-box>article:gt(1)').hide();
    }

    validateZipcode() {
        let validZipCode = !isEmpty(this.state.zipcode) && this.state.zipcode.length == 5 && isNumeric(this.state.zipcode);
        if (!validZipCode) {
            this.setState({zipcodeError: {message: 'Zipcode is not valid.'}});
            return false;
        } else {
            this.setState({zipcodeError: {message: ''}});
            return true;
        }
    }

    handleInputChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    onFormSubmit(e) {
        e.preventDefault();
        let zipcodeIsValid = this.validateZipcode();

        if (zipcodeIsValid) {
            this.props.updateViewIndex(<Garments
                key="1"
                zipcode={this.state.zipcode}
                updateViewIndex={this.props.updateViewIndex.bind(this)}/>);
        }
    }

    render() {
        return (
            <form className="appointment-form"
                  ref="form"
                  onSubmit={this.onFormSubmit.bind(this)}
                  noValidate="novalidate">
                <h2>Book a Tailor</h2>
                <div className="zipcode-input-wrapper cf">
                    <input type="tel"
                           id="zipcode"
                           className="zipcode-input"
                           value={this.state.zipcode}
                           onChange={this.handleInputChange.bind(this)}
                           placeholder="Enter Zip Code"
                           maxLength="5"/>
                    <button type="submit"
                            id="btn_booktailor"
                            className="btn-next">next >
                    </button>
                    <ZError error={this.state.zipcodeError} />
                </div>
                {window.location.href.match(/ztailors.com/g) ? <a href="/let-us-contact-you" className="let-us-contact-you">Prefer us to book for you? Let us call you</a> : ''}
            </form>
        );
    }
}

Zipcode.displayName = 'zipcode';