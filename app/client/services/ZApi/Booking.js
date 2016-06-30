import axios from 'axios';
import Auth from '../../utils/Auth';

export default class Booking {

    /**
     * @Method POST
     * @Route /booking/
     * @return {Promise}
     */
    static createBooking(booking) {
        let url = `${ZAPI_URL}/booking/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, booking, {headers: authHeader});
    }

    /**
     * @Method GET
     * @Route /booking/{id}/appointments/
     * @return {Promise}
     */
    static getBookingAppointments(id) {
        let url = `${ZAPI_URL}/booking/${id}/appointments/`;
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }
}
