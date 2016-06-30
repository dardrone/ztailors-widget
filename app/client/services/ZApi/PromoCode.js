import axios from 'axios';
import Auth from '../../utils/Auth';

export default class PromoCode {

    /**
     * @Method GET
     * @Route /promocode/validate/{promocode}/
     * @return {Promise}
     */
    static validate(promoCode, customerId) {
        let url = `${ZAPI_URL}/promocode/validate/${promoCode}/`;
        let authHeader;

        if (customerId) {
            url += `?customer=${customerId}`;
        }

        authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }
}
