module.exports = {
    url: function () {
        return this.api.globals.base_url;
    },
    elements: {
        addressLine1: {
            selector: '#address-line-1'
        },
        addressLine2: {
            selector: '#address-line-2'
        },
        specialInstructions: {
            selector: '#special-instructions'
        },
        submitAddressFormButton: {
            selector: '//*[@id="address-form"]//button[@type="submit"]',
            locateStrategy: 'xpath'
        },
        addressError: {
            selector: '#details-form > fieldset.location > div > div.list-error.z-danger > ul > li'
        },
        addAddressError: {
            selector: '#details-form > fieldset.location > div > div:nth-child(3) > fieldset > div.list-error.z-danger > ul > li'
        },
        stateInfo: {
            selector: '#city-state-zip'
        },
        cityStateLoading: {
            selector: '.row.state-info.loading'
        },
        invalidAddressModal: {
            selector: '#invalid-address-modal'
        },
        invalidAddressModalForce: {
            selector: '#invalid-address-modal-force'
        },
        correctedAddressModal: {
            selector: '#corrected-address-modal'
        },
        correctedAddressModalConfirm: {
            selector: '#corrected-address-modal-confirm'
        }
    }
};
