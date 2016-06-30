import axios from 'axios';
import Auth from '../../utils/Auth';

export default class Waitlist {

    /**
     * @Method POST
     * @Route /missed-appointments/
     * @return {Promise}
     */
    static addMissedAppointment(missedAppointment) {
        let url = `${ZAPI_URL}/missed-appointments/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, missedAppointment, {headers: authHeader});
    }
}