import React, { Component } from 'react';
import ZSpinner from '../../shared/ZSpinner';
import { isEmpty } from '../../../utils/Common';

export default class AddressCorrected extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let addressTwoExists = !isEmpty(this.props.correctedAddress.addressLine2);
        return (
            <div id="corrected-address-modal">
                <p>We could not find that address exactly as provided, but we found this one:</p>
                <div className="suggested-address">
                    <strong>
                        {this.props.correctedAddress.addressLine1}
                        <br/>
                        {addressTwoExists ?
                            <span> {this.props.correctedAddress.addressLine2} <br/></span>
                        : ''}
                        {this.props.correctedAddress.city}, {this.props.correctedAddress.state_abbreviation} {this.props.correctedAddress.zipcode}
                    </strong>
                </div>
                <br/>
                <p>Is this what you meant?</p>
                <button type="button" id="corrected-address-modal-confirm"
                        onClick={this.props.onUseCorrectedAddressModal}>
                    Yes, use this address
                </button>
                <button id="address-modal-form-force"
                        type="button"
                        onClick={this.props.onUseInvalidAddressModal}>
                    Use other address
                </button>
            </div>
        );
    }
}