import React, { Component } from 'react';
import ZSpinner from '../../shared/ZSpinner';
import { isEmpty } from '../../../utils/Common';

export default class AddressInvalid extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let addressTwoExists = !isEmpty(this.props.invalidAddress.addressLine2);
        return (
            <div id="invalid-address-modal">
                <p>We could not verify this address</p>
                <div className="suggested-address">
                    <strong>
                        {this.props.invalidAddress.addressLine1}
                        <br/>
                        { addressTwoExists ?
                            <span> {this.props.invalidAddress.addressLine2}
                                <br/>
                            </span>
                            : ''}
                        {this.props.invalidAddress.city }, {this.props.invalidAddress.state_abbreviation} {this.props.invalidAddress.zipcode}
                        <br/>
                    </strong>
                </div>
                <br/>
                <p>Do you still want to use this address?</p>
                <button id="invalid-address-modal-force"
                        type="button"
                        onClick={this.props.onConfirmAddress}>
                        Yes
                </button>
                <button id="invalid-address-modal-close"
                        type="button"
                        onClick={this.props.onDismiss}>
                    No
                </button>
            </div>

        );
    }
}