import React, { Component } from 'react';
import Login from './Login';
import {Modal, Button} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ForgotPassword from './ForgotPassword';

export default class LoginModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            email: this.props.email
        }
    }

    getLoginView() {
        return (<Login
            customerId={this.props.customerId}
            email={this.props.email}
            onLoginSuccess={this.props.onLogin}
            updateViewIndex={this.updateViewIndex.bind(this)}
            goBackToLogin={this.goBackToLogin.bind(this)} />);
    }

    getResetView() {
        return (<ForgotPassword
            email={this.props.email}
            goBackToLogin={this.goBackToLogin.bind(this)}
            resetPassword={this.props.resetPassword}
            modalVisible={this.props.show} />);
    }

    updateViewIndex(view) {
        this.setState({
            currentView: view
        });
    }
    
    goBackToLogin() {
        this.updateViewIndex(this.getLoginView());
    }

    goToResetPassword() {
        this.updateViewIndex(this.getResetView());
    }

    handleOnEnter() {
        if (!this.props.resetPassword) {
            this.goBackToLogin();
        } else {
            this.goToResetPassword();
        }
    }

    render() {
        return (
            <div className="modal-container">
                <Modal
                    show={this.props.show}
                    container={this}
                    aria-labelledby="contained-modal-title"
                    dialogClassName="zLoginModal"
                    keyboard={true}
                    backdrop={true}
                    onEnter={this.handleOnEnter.bind(this)}
                    onHide={this.props.closeModal}
                    onExiting={this.props.onLogin}>
                    <Modal.Body>
                        <ReactCSSTransitionGroup transitionName="view"
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={500}>
                            { this.state.currentView }
                        </ReactCSSTransitionGroup>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}