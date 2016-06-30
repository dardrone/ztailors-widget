var detailsCommands = {
    submitDetailsFormNewUser: function(password, phone, newAddress, creditCard, promoCode){
        this.waitForElementVisible('@password', 10000)
            .waitForElementVisible('@confirmPassword', 5000)
            .waitForElementNotVisible('@loadingTitle', 10000)
            .setValue('@addressLine1', newAddress)
            .setValue('@firstName', 'Test')
            .setValue('@lastName', 'McTesterson')
            .setValue('@phone', phone)
            .setValue('@password', password)
            .setValue('@confirmPassword', password)
            .setValue('@creditCardNumber', creditCard.number)
            .setValue('@cvv', creditCard.cvv)
            .setValue('@postalCode', creditCard.postalCode)
            .setValue('@expirationMonth', creditCard.expirationMonth)
            .setValue('@expirationYear', creditCard.expirationYear);

        if (promoCode !== undefined) {
            this.click('@promoCodeLink')
                .setValue('@promoCode', promoCode);
        }

        return this.click('@submitDetailsFormButton')
            .waitForElementVisible('#bf-complete-booking', 30000);
    }
};

module.exports = {
    commands: [detailsCommands],
    url: function() {
        return this.api.globals.base_url;
    },
    elements: {
        detailsForm:{
          selector:'#details-form'
        },
        firstName: {
            selector: '#firstName'
        },
        firstNameError: {
            selector: '.first-name-container .list-error'
        },
        lastName: {
            selector: '#lastName'
        },
        lastNameError: {
            selector: '.last-name-container .list-error'
        },
        phone: {
            selector: '.phone-number-container input'
        },
        phoneError: {
            selector: '.phone-number-container .list-error'
        },
        password: {
            selector: '#password'
        },
        passwordError: {
            selector: '.password-container .list-error'
        },
        confirmPassword: {
            selector: '#confirmPassword'
        },
        loadingTitle: {
            selector: '.z-loading-title'
        },
        submitDetailsFormButton: {
            selector: '#submit-details-form-button'
        },
        addAddress: {
            selector: '#add-address'
        },
        detailsAddress: {
            selector: '#bf_details_address'
        },
        addressLine1:{
          selector: '#address-line-1'
        },
        firstAddress:{
            selector: '#bf_details_address:first-child'
        },
        promoCode: {
            selector: '.promo-code-container input'
        },
        promoCodeLink: {
            selector: '.btn-promo-code'
        },
        promoCodeError: {
            selector: '.promo-code-container .list-error li'
        },
        creditCardNumber: {
            selector: '#number'
        },
        creditCardNumberSelect: {
            selector: '#number-select'
        },
        cvv: {
            selector: '#cvv'
        },
        postalCode: {
            selector: '#postal_code'
        },
        expirationMonth: {
            selector: '#expiration_month'
        },
        expirationYear: {
            selector: '#expiration_year'
        },
        addPaymentMethod: {
            selector: '.credit-card-info button'
        },
        useExisting: {
            selector: '.payment-info-edit button'
        },
        creditCardError: {
            selector: '.payment-info-edit .list-error'
        }
    }
};
