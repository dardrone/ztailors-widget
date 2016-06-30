module.exports = {
    url: function () {
        return this.api.globals.base_url;
    },
    elements: {
        waitlistForm: {
            selector: '#waitlist-form'
        },
        submitWaitlistButton: {
            selector: '//*[@id="waitlist-form"]//button[@type="submit"]',
            locateStrategy: 'xpath'
        },
        backToGarmentsButton: {
            selector: '//*[@id="waitlist-form"]//button[@type="button"]',
            locateStrategy: 'xpath'
        },
        email: {
            selector: 'input[type=text]'
        },
        waitlistThankYou: {
            selector: '#waitlist-thank-you'
        },
        thankYouButton: {
            selector: '#thank-you-btn'
        }
    }
};
