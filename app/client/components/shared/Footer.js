import React, { Component } from 'react';

export default class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let url = {
            'termsOfService': `${ZTAILORS_URL}terms-of-service`,
            'privacyPolicy': `${ZTAILORS_URL}privacy-policy`
        };

        return (
            <footer>
                <a href={url['termsOfService']} target="_blank">Terms of Service</a>
                <a href={url['privacyPolicy']} target="_blank">Privacy Policy</a>
            </footer>
        );
    }
}