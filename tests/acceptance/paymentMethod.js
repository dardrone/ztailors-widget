var faker = require('faker');
var helpers = require('../utils/Helpers');

module.exports = {
    'Existing user cannot book with invalid credit card': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var details= client.page.details();
        var loginForm = client.page.loginForm();
        var expirationDate = helpers.validCreditCardExpirationDate();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password)
            .waitForElementVisible('#details-form', 20000);

        details
            .waitForElementNotVisible('@loadingTitle', 15000)
            .click('@addPaymentMethod')
            .waitForElementVisible('@creditCardNumber', 1000)
            .setValue('@creditCardNumber', data.invalid_credit_card_number)
            .setValue('@cvv', data.valid_credit_card_cvv)
            .setValue('@expirationMonth', expirationDate.month)
            .setValue('@expirationYear', expirationDate.year)
            .setValue('@postalCode', data.valid_credit_card_postal_code)
            .click('@submitDetailsFormButton')
            .waitForElementVisible('@creditCardError', 20000);

        client.end();
    },

    'Existing user cannot book with invalid credit card, but use existing': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var details= client.page.details();
        var loginForm = client.page.loginForm();
        var expirationDate = helpers.validCreditCardExpirationDate();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password)
            .waitForElementVisible('#details-form', 20000);

        details
            .waitForElementNotVisible('@loadingTitle', 20000)
            .click('@addPaymentMethod')
            .waitForElementVisible('@creditCardNumber', 1000)
            .setValue('@creditCardNumber', data.invalid_credit_card_number)
            .setValue('@cvv', data.valid_credit_card_cvv)
            .setValue('@expirationMonth', expirationDate.month)
            .setValue('@expirationYear', expirationDate.year)
            .setValue('@postalCode', data.valid_credit_card_postal_code)
            .click('@submitDetailsFormButton')
            .waitForElementNotVisible('@loadingTitle', 20000)
            .waitForElementVisible('@creditCardError', 20000)
            .click('@useExisting')
            .waitForElementVisible('@creditCardNumberSelect', 20000);

        client.end();
    }
};
