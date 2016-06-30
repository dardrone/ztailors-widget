import React, { Component } from 'react';
import User from '../../services/ZApi/User';
import ZSpinner from '../shared/ZSpinner';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            error: {
                message: null
            },
            success: false,
            loading: false
        };
    }

    componentDidMount() {
        if (this.props.resetPassword) {
            this.setState({loading: true});
            this.sendForgotPasswordRequest();
        }
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    onBackToSignInClick(e) {
        e.preventDefault();
        this.props.goBackToLogin();
    }

    onSendResetInstructionsClick(e) {
        this.setState({
            loading: true
        });

        this.sendForgotPasswordRequest();
    }

    sendForgotPasswordRequest() {
        User.forgotPassword(this.state.email).then(response => {
            this.setState({
                success: true,
                loading: false
            });
        }, response => {
            this.setState({
                error: {
                    message: 'Please check your email'
                },
                loading: false
            });
        });
    }

    getSuccessMessage() {
        let message = '';

        if (this.props.resetPassword) {
            message = 'We noticed that you have an account, but haven\'t given us a password. ';
            message += 'Reset instructions have been sent to the email provided. Please allow a few minutes for delivery.';
        } else {
            message = 'Password reset instructions have been sent to the email provided. Please allow a few minutes for delivery. '
        }
        
        return message;

    }

    render () {
        return (
            <div>
                <div className="popup-customer-form forgot-password-form">
                    <h2>Reset Password</h2>
                    { !this.state.success ?
                        <div>
                            <p>Enter your email address below and we&apos;ll send you password reset instructions</p>
                            <input type="email"
                                id="forgot-password-email"
                                value={this.state.email}
                                placeholder="Email Address"
                                onChange={this.handleEmailChange.bind(this)}/>

                            <button id="forgot-password-submit"
                                    type="button"
                                    onClick={this.onSendResetInstructionsClick.bind(this)}>
                                    SEND PASSWORD RESET INSTRUCTIONS <ZSpinner show={this.state.loading} inverse={true}/></button>

                            <p className="error-message">
                                <span id="forgot-password-error">{this.state.error.message}</span>
                            </p>
                        </div>
                        :

                        <p className="success-message show">
                            {this.getSuccessMessage()}
                        </p>
                    }
                    <p><a href="#" onClick={this.onBackToSignInClick.bind(this)}>Go back to sign in</a></p>
                </div>
            </div>
        )
    }
}
