import axios from 'axios';
import { isDefined } from '../../utils/Common';

export default class SmartyStreets {

    /**
     * @Method GET
     * @Route /address/
     * @return {Promise}
     */
    static getCityState(zipcode) {
        let url = this.buildUrl(`${SMARTYSTREETS_URL}zipcode`);
        url += `&zipcode=${zipcode}`;
        return axios.get(url);
    }

    static buildUrl(url) {
        return url + `?auth-id=${SMARTYSTREETS_AUTH_ID}&auth-token=${SMARTYSTREETS_AUTH_TOKEN}`;
    }

    static getCitiesStatesFromResponse(response) {
        let data = response.data;
        let obj = [];

        if (data && data.length >= 1) {
            if (isDefined(data[0]['city_states']) && data[0]['city_states'].length >= 1) {
                data[0]['city_states'].forEach(function (cityState, key) {
                    obj[key] = {
                        city: cityState['city'],
                        state: cityState['state']
                    };
                    if (isDefined(cityState['state_abbreviation'])) {
                        obj[key]['state_abbreviation'] = cityState['state_abbreviation'];
                    }
                });
            }
        }
        return obj;
    }
}
