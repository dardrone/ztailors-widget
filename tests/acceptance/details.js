var faker = require('faker');

module.exports = {
    'New Customer can enter password': function (client) {
        var garments = client.page.garments();
        var details = client.page.details();
        var newEmail = faker.internet.email();

        garments.submitGarmentsForm('90210', newEmail);

        details.waitForElementVisible('@password', 5000)
            .waitForElementVisible('@confirmPassword', 5000)
            .waitForElementNotVisible('@loadingTitle', 10000)
            .setValue('@password', 'asdfasdf')
            .setValue('@confirmPassword', 'asdfasdf');

        client.end();
    },
    'New Customer cannot enter too short password': function (client) {
        var garments = client.page.garments();
        var details = client.page.details();
        var newEmail = faker.internet.email();
        var newAddress = faker.address.streetName();
        var phone = '5025444320';

        garments.submitGarmentsForm('90210', newEmail);

        details.waitForElementPresent('@detailsForm', 10000)
            .waitForElementVisible('@password', 5000)
            .waitForElementVisible('@confirmPassword', 5000)
            .waitForElementNotVisible('@loadingTitle', 20000)
            .setValue('@addressLine1', newAddress)
            .setValue('@firstName', 'First Name')
            .setValue('@lastName', 'Last Name')
            .setValue('@phone', phone)
            .setValue('@password', 'a')
            .setValue('@confirmPassword', 'a')
            .click('@password')
            .click('@submitDetailsFormButton');
            details.waitForElementVisible('@passwordError', 20000);

        client.end();
    },

    'Existing Customer cannot enter password': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password);

        details.waitForElementNotPresent('@password', 10000)
            .waitForElementNotPresent('@confirmPassword', 10000)
            .waitForElementNotVisible('@loadingTitle', 10000)
            .click('@submitDetailsFormButton');
        client.end();
    },

    'New Customer cannot leave customer fields empty': function (client) {
        var garments = client.page.garments();
        var details = client.page.details();
        var newEmail = faker.internet.email();

        garments.submitGarmentsForm('90210', newEmail);

        details.waitForElementVisible('@firstName', 5000)
            .waitForElementNotVisible('@loadingTitle', 10000)
            .click('@submitDetailsFormButton')
            .waitForElementVisible('@firstNameError', 10000)
            .waitForElementVisible('@lastNameError', 10000)
            .waitForElementVisible('@phoneError', 10000)
            .waitForElementVisible('@passwordError', 10000);

        client.end();
    },

    'New Customer cannot enter different passwords': function (client) {
        var garments = client.page.garments();
        var details = client.page.details();
        var newEmail = faker.internet.email();

        garments.submitGarmentsForm('90210', newEmail);

        details.waitForElementVisible('@password', 5000)
            .waitForElementVisible('@confirmPassword', 5000)
            .waitForElementNotVisible('@loadingTitle', 10000)
            .setValue('@password', 'asdfasdf')
            .setValue('@confirmPassword', 'lalala');

        details.click('@submitDetailsFormButton');
        details.waitForElementVisible('@passwordError', 10000);

        client.end();
    }

};