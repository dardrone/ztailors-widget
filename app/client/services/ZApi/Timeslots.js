import axios from 'axios';
import Auth from '../../utils/Auth';
import {isDefined} from '../../utils/Common';
import $ from 'jquery';

export default class Timeslots {

    /**
     * @Method GET
     * @Description Get available tailor timeslots by postal code.
     * @param {String} postcode
     * @param {Object} data - URL Query Params object
 * @return {Promise}
     */
    static getAvailableTimeSlots(postcode, data) {
        let url = `${ZAPI_URL}/timeslots/available/?postal_code=${postcode}`;
        url += isDefined(data) ? '&' + decodeURIComponent(($.param(data)+'').replace(/\+/g, '%20')) : '';
        let authHeader = Auth.buildAuthHeader(url, 'GET');
        return axios.get(url, {headers: authHeader});
    }
}
