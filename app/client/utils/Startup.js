import axios from 'axios';
import jcf from 'jcf';

export default class Startup {

    constructor(){
        this.initAxios();
    }

    initAxios(){
        // Add request interceptor
        axios.interceptors.request.use(function (config) {
            return config;
        }, function (error) {

            return Promise.reject(error);
        });
    }
}