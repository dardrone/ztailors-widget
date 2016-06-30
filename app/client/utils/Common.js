import Cookies from 'js-cookie';

export function isDefined(e) {
    return typeof e != 'undefined';
}

export function isNull(e) {
    return e === null;
}

export function isEmpty(e) {
    return isNull(e) || !isDefined(e) || e === '';
}
/**
 * @see http://stackoverflow.com/questions/31424561/wait-until-all-es6-promises-complete-even-rejected-promises
 * @param promise
 * @returns {Promise}
 */
export function reflect(promise) {
    return promise.then((v) => {
            return {v: v, status: 'resolved'};
        },
        (e) => {
            return {e: e, status: 'rejected'};
        });
}

export function getZElementByAttributeName(attributeName) {
    let htmlElement = document.querySelector('[z-data="' + attributeName + '"]');
    if (htmlElement != null) {
        if (htmlElement.value != null) {
            return htmlElement.value;
        } else if (htmlElement.innerHTML != null) {
            return htmlElement.innerHTML;
        } else {
            return '';
        }
    }
}

/**
 * Check if a number is numeric.
 * @param n
 * @returns {boolean}
 */
export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


/**
 * Gets cookie string from the client
 * and parses it into an object.
 *
 * @param name
 * @returns {null}
 */
export function getCookieObject(name){
    if(isEmpty(Cookies.get(name))){
        return null;
    }
    return JSON.parse(unescape(Cookies.get(name)));
}
