import axios from 'axios';
import Auth from '../../utils/Auth';

export default class CartAbandonment {

    /**
     * @Method POST
     * @Route /cart_abandonment/ 
     * @return {Promise}
     */
    static addCartAbandonment(cartAbandonment) {
        let url = `${ZAPI_URL}/cart_abandonment/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, cartAbandonment, {headers: authHeader});
    }
}