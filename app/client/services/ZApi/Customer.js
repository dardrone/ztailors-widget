import axios from 'axios';
import Auth from '../../utils/Auth';

export default class Customer {

    /**
     * @Method GET
     * @Route /customer/{id}/
     * @return {Promise}
     */
    static getCustomer(id) {
        let url = `${ZAPI_URL}/customer/${id}/`;
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }

    /**
     * @Method POST
     * @Route /customer/
     * @return {Promise}
     */
    static createCustomer(customer) {
        let url = `${ZAPI_URL}/customer/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, customer, {headers: authHeader});
    }

    /**
     * @Method POST
     * @Route /customer/{id}/
     * @return {Promise}
     */
    static updateCustomer(id, customer) {
        let url = `${ZAPI_URL}/customer/${id}/`;
        let authHeader = Auth.buildAuthHeader(url, 'PUT');
        return axios.put(url, customer, {headers: authHeader});
    }

    /**
     * @Method GET
     * @Route /customer/{id}/addresses/
     * @return {Promise}
     */
    static getAddresses(id) {
        let url = `${ZAPI_URL}/customer/${id}/addresses/`;
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }

    /**
     * @Method GET
     * @Route /customer/:id/paymentmethods/
     * @return {Promise}
     */
    static getPaymentMethods(id) {
        let url = `${ZAPI_URL}/customer/${id}/paymentmethods/`;
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }
}
