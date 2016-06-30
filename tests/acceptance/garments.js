var faker = require('faker');

module.exports = {

    'Existing Customer can login with CORRECT credentials': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password)
            .waitForElementVisible('#details-form', 5000);
        client.end();
    },

    'Existing Customer cannot login with WRONG password': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(faker.internet.password())
            .waitForElementVisible('@error', 6000)
            .assert.containsText('@error', 'Bad credentials.');

        client.end();
    },

    'Existing customer does not select expertise and should get an error': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var zipcode = data.valid_zipcode;

        garments.navigate()
            .waitForElementVisible('@zipcode', 10000)
            .setValue('@zipcode', zipcode)
            .click('@zipcodeSubmit')
            .waitForElementNotPresent('@loading', 10000)
            .waitForElementVisible('@expertiseLabel', 10000)
            .assert.visible('@email')
            .assert.visible('@expertiseLabel')
            .setValue('@email', data.ztailors_username)
            .click('@submitForm')
            .waitForElementVisible('@error', 6000)
            .assert.containsText('@error', 'Please, choose a garment type');

        client.end();
    }
};
