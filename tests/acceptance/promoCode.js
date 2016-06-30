var faker = require('faker');
var helpers = require('../utils/Helpers');

module.exports = {

    'Existing user can try invalid promo code, but can still book without a promo code': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var complete = client.page.complete();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password);
        details.waitForElementPresent('@detailsForm', 3000)
            .waitForElementNotVisible('@loadingTitle', 20000)
            .click('@promoCodeLink')
            .waitForElementVisible('@promoCode', 2000)
            .setValue('@promoCode', 'A')
            .click('@submitDetailsFormButton')
            .waitForElementVisible('@promoCodeError', 20000)
            .waitForElementNotVisible('@loadingTitle', 20000)
            .setValue('@promoCode', client.Keys.BACK_SPACE)
            .click('@submitDetailsFormButton');

        complete.waitForElementVisible('@submitCompleteForm', 15000);

        client.end();
    },

    'Existing user cannot use invalid promo code': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password);
        details.waitForElementPresent('@detailsForm', 3000)
            .waitForElementNotVisible('@loadingTitle', 20000)
            .click('@promoCodeLink')
            .waitForElementVisible('@promoCode', 2000)
            .setValue('@promoCode', 'ALALA')
            .click('@submitDetailsFormButton')
            .waitForElementVisible('@promoCodeError', 20000);

        client.end();
    },

    'Existing user can book using valid promo code': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var complete = client.page.complete();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password);
        details.waitForElementPresent('@detailsForm', 3000)
            .waitForElementNotVisible('@loadingTitle', 20000)
            .click('@promoCodeLink')
            .waitForElementVisible('@promoCode', 2000)
            .setValue('@promoCode', data.valid_promo_code)
            .click('@submitDetailsFormButton');

        complete.waitForElementVisible('@submitCompleteForm', 15000)
            .waitForElementVisible('@promoCode',10000)
            .assert.containsText('@promoCode', data.valid_promo_code);

        client.end();
    },

    'Existing user cannot book twice using valid use once promo code': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var complete = client.page.complete();

        var newEmail = faker.internet.email();
        var phone = '5025444320';
        var defaultAddress = '924 Beverly Dr';
        var expirationDate = helpers.validCreditCardExpirationDate();

        var creditCard = {
            number: data.valid_credit_card_number,
            cvv: data.valid_credit_card_cvv,
            postalCode: data.valid_credit_card_postal_code,
            expirationMonth: expirationDate.month,
            expirationYear: expirationDate.year
        };

        garments.submitGarmentsForm('90210', newEmail);
        details.submitDetailsFormNewUser('asdfasdf', phone,  defaultAddress, creditCard, data.valid_once_promo_code);
        complete.waitForElementVisible('@submitCompleteForm', 30000);

        helpers.clearStorage(client);

        client.refresh();

        garments.submitGarmentsForm('90210', newEmail);
        loginForm.waitForElementVisible('@loginFormDiv', 20000)
            .assert.containsText('@loginFormDiv', 'LOG IN')
            .setValue('@password', 'asdfasdf')
            .click('@submitForm')
            .waitForElementVisible('#details-form', 20000);

        details.waitForElementNotVisible('@loadingTitle', 20000)
            .click('@promoCodeLink')
            .waitForElementVisible('@promoCode', 2000)
            .setValue('@promoCode', data.valid_once_promo_code)
            .click('@submitDetailsFormButton')
            .waitForElementVisible('@promoCodeError', 20000);

        client.end();
    }
};