import React, { Component } from 'react';
import AddressInvalid from './AddressInvalid';
import AddressCorrected from './AddressCorrected';
import {Modal} from 'react-bootstrap';

export default class ConfirmAddressModal extends Component {

    constructor(props) {
        super(props);
    }

    onUseInvalidAddressModal(){
        this.props.onUseInvalidAddressModal(this.props.correctedAddress);
    }

    onUseCorrectedAddressModal(){
        this.props.onUseCorrectedAddressModal(this.props.correctedAddress);
    }

    onDismissAddressModal(){
        this.props.onDismissAddressModal();
    }


    render() {
        return (
            <div className="modal-container">
                <Modal
                    show={this.props.show}
                    container={this}
                    aria-labelledby="contained-modal-title"
                    dialogClassName="zConfirmAddressModal"
                    keyboard={true}>
                    <Modal.Body>
                        <div className="popup-customer-form suggested-address-popup">
                            {this.props.exists ?
                                <AddressCorrected
                                    correctedAddress={this.props.correctedAddress}
                                    onUseCorrectedAddressModal={this.onUseCorrectedAddressModal.bind(this)}
                                    onUseInvalidAddressModal={this.onUseInvalidAddressModal.bind(this)}
                                />
                                :
                                <AddressInvalid
                                    invalidAddress={this.props.correctedAddress}
                                    onConfirmAddress={this.onUseInvalidAddressModal.bind(this)}
                                    onDismiss={this.onDismissAddressModal.bind(this)}
                                />}
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}