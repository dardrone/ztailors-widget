import axios from 'axios';
import Auth from '../../utils/Auth';

export default class User {

    /**
     * @Method POST
     * @Route /tokens/
     * @param {String} email
     * @param {String} password
     * @return {Promise}
     */
    static validateUserWithToken(email, password) {
        let url = `${ZAPI_URL}/tokens/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST', {});
        return axios.post(url, {email: email, password: password}, {headers: authHeader});
    }

    /**
     * @Method GET
     * @Route /user/check-user/
     * @param {String} email
     * @return {Promise}
     */
    static checkUserExists(email) {
        let url = `${ZAPI_URL}/user/check-user/?email=${email}`;
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }

    /**
     * @Method GET
     * @Route /user/check_keys/
     * @return {Promise}
     */
    static checkKeys() {
        let url = `${ZAPI_URL}/user/check_keys/`;
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }

    /**
     * @Method POST
     * @Route /user/forgot_password/
     * @param email
     * @return {Promise}
     */
    static forgotPassword(email) {
        let url = `${ZAPI_URL}/user/forgot_password/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST', {});

        return axios.post(url, {email: email}, {headers: authHeader});
    }

    static clearLocalUserToken(){
        Auth.clearLocalStorageToken();
    }
}
