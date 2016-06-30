var faker = require('faker');
var helpers = require('../utils/Helpers');

module.exports = {

    'Existing user gets address error on new zipcode with no addresses': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var details = client.page.details();
        var loginForm = client.page.loginForm();
        var address = client.page.newAddress();
        var complete = client.page.complete();

        var newEmail = faker.internet.email();
        var phone = '5025444320';
        var defaultAddress = '924 Beverly Dr';
        var badAddress = '1181 Laurel Wa';
        var goodAddress = '1181 Laurel Way';
        var zipcode = data.valid_zipcode;
        var city = 'Beverly Hills';
        var state = 'CA';
        var expirationDate = helpers.validCreditCardExpirationDate();

        var creditCard = {
            number: data.valid_credit_card_number,
            cvv: data.valid_credit_card_cvv,
            postalCode: data.valid_credit_card_postal_code,
            expirationMonth: expirationDate.month,
            expirationYear: expirationDate.year
        };

        garments.submitGarmentsForm(zipcode, newEmail);
        details.submitDetailsFormNewUser('asdfasdf', phone, defaultAddress, creditCard);

        helpers.clearStorage(client);

        client.refresh();

        garments.submitGarmentsForm('94617', newEmail);
        loginForm.waitForElementVisible('@loginFormDiv', 30000)
            .assert.containsText('@loginFormDiv', 'LOG IN')
            .setValue('@password', 'asdfasdf')
            .click('@submitForm')
            .waitForElementVisible('#details-form', 30000);

        details
            .waitForElementNotVisible('@loadingTitle', 30000)
            .waitForElementNotPresent('@password', 5000)
            .waitForElementNotPresent('@confirmPassword', 5000);

        details.click('@submitDetailsFormButton');

        address.waitForElementPresent('@addAddressError', 10000)
            .assert.containsText('@addAddressError', 'Please, enter a valid address.');

        client.end();
    },

    'Existing user can add corrected address': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var details = client.page.details();
        var loginForm = client.page.loginForm();
        var address = client.page.newAddress();
        var complete = client.page.complete();

        var newEmail = faker.internet.email();
        var phone = '5025444320';
        var defaultAddress = '924 Beverly Dr';
        var badAddress = '1181 Laurel Wa';
        var goodAddress = '1181 Laurel Way';
        var zipcode = '90210';
        var city = 'Beverly Hills';
        var state = 'CA';
        var expirationDate = helpers.validCreditCardExpirationDate();

        var creditCard = {
            number: data.valid_credit_card_number,
            cvv: data.valid_credit_card_cvv,
            postalCode: data.valid_credit_card_postal_code,
            expirationMonth: expirationDate.month,
            expirationYear: expirationDate.year
        };

        garments.submitGarmentsForm('90210', newEmail);
        details.submitDetailsFormNewUser('asdfasdf', phone, defaultAddress, creditCard);

        helpers.clearStorage(client);

        client.refresh();

        garments.submitGarmentsForm('90210', newEmail);
        loginForm.waitForElementVisible('@loginFormDiv', 30000)
            .assert.containsText('@loginFormDiv', 'LOG IN')
            .setValue('@password', 'asdfasdf')
            .click('@submitForm')
            .waitForElementVisible('#details-form', 30000);

        details
            .waitForElementNotVisible('@loadingTitle', 30000)
            .waitForElementNotPresent('@password', 5000)
            .waitForElementNotPresent('@confirmPassword', 5000)
            .click('@addAddress');

        address
            .waitForElementVisible('@addressLine1', 30000)
            .assert.visible('@addressLine2')
            .waitForElementNotPresent('@cityStateLoading', 30000)
            .setValue('@addressLine1', badAddress);
        details.click('@submitDetailsFormButton');
        address.waitForElementVisible('@correctedAddressModal', 30000);

        address.click('@correctedAddressModalConfirm');

        details.waitForElementPresent('@detailsForm', 30000)
            .waitForElementNotVisible('@loadingTitle', 30000);

        complete.waitForElementPresent('@submitCompleteForm', 30000);
        client.pause(3000);
        complete.assert.containsText('@addressLine1', goodAddress);
        complete.assert.containsText('@cityStateZip', city + ', ' + state + ' ' + zipcode);

        client.end();
    },

    'Existing user can add a valid address': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var details = client.page.details();
        var loginForm = client.page.loginForm();
        var address = client.page.newAddress();
        var complete = client.page.complete();

        var newEmail = faker.internet.email();
        var phone = '5025444320';
        var defaultAddress = '924 Beverly Dr';
        var newAddress = '1181 Laurel Way';
        var expirationDate = helpers.validCreditCardExpirationDate();
        var creditCard = {
            number: data.valid_credit_card_number,
            cvv: data.valid_credit_card_cvv,
            postalCode: data.valid_credit_card_postal_code,
            expirationMonth: expirationDate.month,
            expirationYear: expirationDate.year
        };

        garments.submitGarmentsForm('90210', newEmail);
        details.submitDetailsFormNewUser('asdfasdf', phone, defaultAddress, creditCard);

        helpers.clearStorage(client);

        client.refresh();

        garments.submitGarmentsForm('90210', newEmail);
        loginForm.waitForElementVisible('@loginFormDiv', 5000)
            .assert.containsText('@loginFormDiv', 'LOG IN')
            .setValue('@password', 'asdfasdf')
            .click('@submitForm')
            .waitForElementVisible('#details-form', 30000);

        details
            .waitForElementNotVisible('@loadingTitle', 30000)
            .waitForElementNotPresent('@password', 5000)
            .waitForElementNotPresent('@confirmPassword', 5000)
            .click('@addAddress');

        address
            .waitForElementVisible('@addressLine1', 30000)
            .assert.visible('@addressLine2')
            //.assert.visible('@specialInstructions')
            .waitForElementNotPresent('@cityStateLoading', 30000)
            .setValue('@addressLine1', newAddress);
        details.click('@submitDetailsFormButton');
        complete.waitForElementPresent('@submitCompleteForm', 30000);
        client.pause(5000);
        complete.assert.containsText('@addressLine1', newAddress);

        client.end();
    },

    'Existing Customer cannot add existing address': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var address = client.page.newAddress();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password)
            .waitForElementVisible('#details-form', 30000);

        details
            .waitForElementNotVisible('@loadingTitle', 30000)
            .waitForElementNotPresent('@password', 10000)
            .waitForElementNotPresent('@confirmPassword', 5000)
            .click('@addAddress');

        address
            .waitForElementVisible('@addressLine1', 30000)
            .assert.visible('@addressLine2')
            //.assert.visible('@specialInstructions')
            .waitForElementNotPresent('@cityStateLoading', 30000)
            .setValue('@addressLine1', '1181 Laurel Way');
        details.click('@submitDetailsFormButton');
        address.waitForElementVisible('@addressError', 15000)
            .assert.containsText('@addressError', 'Address already exists. Please add a unique address.');

        client.end();
    },

    'Existing Customer can add forced address': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var address = client.page.newAddress();
        var complete = client.page.complete();

        var badAddress = faker.address.streetAddress();
        var zipcode = '90210';

        garments.submitGarmentsForm(zipcode, data.ztailors_username);
        loginForm.login(data.ztailors_password)
            .waitForElementVisible('#details-form', 15000);

        details.waitForElementNotVisible('@loadingTitle', 15000)
            .waitForElementNotPresent('@password', 15000)
            .waitForElementNotPresent('@confirmPassword', 15000)
            .click('@addAddress');

        address
            .waitForElementVisible('@addressLine1', 15000)
            .assert.visible('@addressLine2')
            //.assert.visible('@specialInstructions')
            .waitForElementNotPresent('@cityStateLoading', 15000)
            .setValue('@addressLine1', badAddress);
        details.click('@submitDetailsFormButton');
        address.waitForElementVisible('@invalidAddressModal', 15000)
            .click('@invalidAddressModalForce');

        complete.waitForElementPresent('@submitCompleteForm', 30000);
        client.pause(10000); //TODO Add loading to complete appointment promise
        complete.assert.containsText('@addressLine1', badAddress);

        client.end();
    }
};
