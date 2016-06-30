import OAuth from 'oauth-1.0a';
import { isEmpty } from './Common';

export default class Auth {

    static initOAuth(key, secret) {
        return OAuth({
            consumer: {
                public: key,
                secret: secret
            },
            signature_method: 'HMAC-SHA1'
        });
    }

    /**
     * Builds the zAPI OAuth 1.0 Authorization header for api requests.
     *
     * @param  {String} token
     * @return {Object}
     */
    static buildAuthHeader(url, httpVerb, token) {
        let oauth = this.initOAuth(ZAPI_CLIENT_KEY, ZAPI_CLIENT_SECRET);
        if (window.localStorage && !isEmpty(window.localStorage.getItem('ztoken')) && window.localStorage.getItem('ztoken') !== 'undefined') {
            token = {
                public: window.localStorage.getItem('ztoken'),
                secret: window.localStorage.getItem('ztoken_secret')
            };
        }
        let request_data = {
            url: url,
            method: httpVerb,
            data: {}
        };
        return oauth.toHeader(oauth.authorize(request_data, token));
    }

    static clearLocalStorageToken() {
        window.localStorage.removeItem('ztoken');
        window.localStorage.removeItem('ztoken_secret');
        window.localStorage.removeItem('customerId');
    }
}