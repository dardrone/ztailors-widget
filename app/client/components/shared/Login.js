import React, { Component } from 'react';
import ZSpinner from '../shared/ZSpinner';
import User from '../../services/ZApi/User';
import ForgotPassword from './ForgotPassword';
import { isEmpty, isDefined, isNull } from '../../utils/Common';

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: this.props.email,
            password: '',
            error: {
                status: '',
                message: ''
            },
            loading: false
        };
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    onForgotPasswordClick(e) {
        e.preventDefault();
        this.props.updateViewIndex(<ForgotPassword
            email={this.state.email}
            goBackToLogin={this.props.goBackToLogin} />);
    }

    onFormSubmit(e) {
        e.preventDefault();
        this.setState({loading: true});
        User.validateUserWithToken(this.state.email, this.state.password)
            .then(response => {
                    if (!isEmpty(response.data['oauth_token'])) {
                        window.localStorage.setItem('ztoken', response.data['oauth_token']);
                        window.localStorage.setItem('ztoken_secret', response.data['oauth_token_secret']);
                        window.localStorage.setItem('customerId', this.props.customerId);
                        this.props.onLoginSuccess();
                    } else {
                        this.setState({loading: false});
                        this.setState({error: {status: response.status, message: 'Error authenticating.'}});
                    }
                },
                response => {
                    if (response.status == 401) {
                        this.setState({error: {status: response.status, message: 'Bad credentials.'}, loading: false});
                    } else {
                        this.setState({
                            error: {status: response.status, message: 'Something went wrong.'},
                            loading: false
                        });
                    }
                });
    }

    render() {
        let registerURL = `${ZTAILORS_URL}customer/register/`;
        return (
            <div>
                <div className="popup-customer-form login-form">
                    <h2>Sign in</h2>
                    <p>Not a member?&nbsp;
                        <a href={registerURL} target="_blank" id="btn-jump-to-register">Register here</a>
                    </p>
                    <form name="form" method="POST" id="login-form" onSubmit={this.onFormSubmit.bind(this)}>
                        <input type="email"
                               id="username"
                               name="_username"
                               value={this.state.email}
                               placeholder="Email Address"
                               onChange={this.handleEmailChange.bind(this)}/>
                        <input type="password"
                               id="password"
                               name="_password"
                               placeholder="Password"
                               value={this.state.password}
                               onChange={this.handlePasswordChange.bind(this)}/>
                        <button type="submit" disabled={this.state.loading}>LOG IN
                            <ZSpinner show={this.state.loading} inverse={true}/>
                        </button>
                        <p className="error-message">
                            <span id="login-error">{this.state.error.message}</span>
                        </p>
                        <div>
                            <a id="forgot-password" href="#" onClick={this.onForgotPasswordClick.bind(this)}>
                                Forgot your password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}