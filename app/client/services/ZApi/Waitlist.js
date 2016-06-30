import axios from 'axios';
import Auth from '../../utils/Auth';

export default class Waitlist {

    /**
     * @Method POST
     * @Route /waitlist/
     * @return {Promise}
     */
    static addWaitlist(waitlist) {
        let url = `${ZAPI_URL}/waitlist/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, waitlist, {headers: authHeader});
    }
}