import axios from 'axios';
import Auth from '../../utils/Auth';
import { isNull, isDefined } from '../../utils/Common';
import braintree from 'braintree-web';

export default class PaymentMethod {

    /**
     * @Method POST
     * @Route /paymentmethod/client-token/
     * @return {Promise}
     */
    static generateClientToken() {
        let url = `${ZAPI_URL}/paymentmethod/client-token/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, null, {headers: authHeader});
    }

    /**
     * @Method POST
     * @Route /paymentmethod/
     * @return {Promise}
     */
    static addPaymentMethod(paymentMethod) {
        let url = `${ZAPI_URL}/paymentmethod/`;
        let authHeader = Auth.buildAuthHeader(url, 'POST');
        return axios.post(url, paymentMethod, {headers: authHeader});
    }

    /**
     * @Method PUT
     * @Route /paymentmethod/
     * @return {Promise}
     */
    static updatePaymentMethod(id, paymentMethod) {
        let url = `${ZAPI_URL}/paymentmethod/${id}/`;
        let authHeader = Auth.buildAuthHeader(url, 'PUT');
        return axios.put(url, paymentMethod, {headers: authHeader});
    }


    static createPaymentMethod(paymentMethod) {
        let p = new Promise((resolve, reject) => {
            PaymentMethod.generateClientToken().then(
                (response) => {
                    let client = PaymentMethod.getBraintreeInstance(response.data.token);
                    client.tokenizeCard({
                        number: paymentMethod.number,
                        cvv: paymentMethod.cvv,
                        expirationMonth: paymentMethod.expiration_month,
                        expirationYear: paymentMethod.expiration_year,
                        billingAddress: {
                            postalCode: paymentMethod.postal_code
                        }
                    }, (err, nonce) => {
                        if (isDefined(nonce) && !isNull(nonce)) {
                            PaymentMethod.addPaymentMethod({
                                nonce: nonce,
                                customer: paymentMethod.customer,
                                default: true
                            }).then((response) => {
                                resolve(response);
                            }, (response) => {
                                reject(response);
                            })
                        } else {
                            reject(err);
                        }
                    });
                }, (response) => {
                    reject(response);
                }
            );
        });

        return p;
    }

    static getBraintreeInstance(token) {
        let client = new braintree.api.Client({clientToken: token});

        return client;
    }
}