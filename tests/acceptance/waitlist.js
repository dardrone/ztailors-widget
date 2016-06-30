var faker = require('faker');

module.exports = {

    'Existing user gets waitlist page': function (client) {
        var garments = client.page.garments();
        var waitlist = client.page.waitlist();
        var zipcode = '00000';

        garments.navigate()
            .waitForElementVisible('@zipcode', 10000)
            .setValue('@zipcode', zipcode)
            .click('@zipcodeSubmit')
            .waitForElementNotPresent('@loading', 10000);
        waitlist.waitForElementPresent('@waitlistForm', 10000);

        client.end();
    },

    'New user gets waitlist page, but can still get to details page': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var complete = client.page.complete();
        var waitlist = client.page.waitlist();
        var not_served_zipcode = '00000';
        var new_username = faker.internet.email();

        garments.navigate()
            .waitForElementVisible('@zipcode', 10000)
            .setValue('@zipcode', not_served_zipcode)
            .click('@zipcodeSubmit')
            .waitForElementNotPresent('@loading', 15000);
        waitlist.waitForElementPresent('@waitlistForm', 15000)
            .setValue('@email', new_username)
            .click('@submitWaitlistButton')
            .waitForElementPresent('@thankYouButton', 3000)
            .click('@thankYouButton');

        garments.waitForElementVisible('@zipcode', 10000)
            .setValue('@zipcode', data.valid_zipcode)
            .click('@zipcodeSubmit')
            .waitForElementNotPresent('@loading', 10000)
            .waitForElementVisible('@expertiseLabel', 10000)
            .assert.visible('@email')
            .assert.visible('@expertiseLabel')
            .setValue('@email', new_username)
            .click('@expertiseLabel')
            .waitForElementNotPresent('@loading', 10000)
            .click('@submitForm');

        details.waitForElementPresent('@detailsForm', 15000);
        client.end();
    }

};