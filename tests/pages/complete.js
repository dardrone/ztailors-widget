module.exports = {
    url: function() {
        return this.api.globals.base_url;
    },
    elements: {
        submitCompleteForm: {
            selector: '#bf-complete-booking'
        },
        promoCode: {
            selector: '#promoCode'
        },
        addressLine1: {
            selector: '#bf-complete-booking > div.confirmation-ticket.row.cf > div.col-left > div > div > div:nth-child(3) > div:nth-child(2)'
        },
        cityStateZip: {
            selector: '#bf-complete-booking > div.confirmation-ticket.row.cf > div.col-left > div > div > div:nth-child(3) > div:nth-child(3)'
        }
    }
};
