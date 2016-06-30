import axios from 'axios';
import Auth from '../../utils/Auth';

export default class Expertise {

    /**
     * @Method GET
     * @Route /expertise/{zipcode}/
     * @return {Promise}
     */
    static getExpertise(zipcode) {
        let url = `${ZAPI_URL}/expertise/${zipcode}/`;
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }
}
