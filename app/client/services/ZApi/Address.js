import axios from 'axios';
import Auth from '../../utils/Auth';

export default class Address {

    /**
     * @Method POST
     * @Route /address/
     * @return {Promise}
     */
    static createAddress(booking) {
        let url = `${ZAPI_URL}/address/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, booking, {headers: authHeader});
    }

    /**
     * @Method PUT
     * @Route /address/
     * @return {Promise}
     */
    static updateAddress(id, address) {
        let url = `${ZAPI_URL}/address/${id}/`;
        let authHeader = Auth.buildAuthHeader(url, 'PUT');
        return axios.put(url, address, {headers: authHeader});
    }
}
