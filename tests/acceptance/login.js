module.exports = {

    'Existing customer is remembered': function (client) {
        var data = client.globals;

        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var zipcode = data.valid_zipcode;
        var email = data.ztailors_username;

        garments.submitGarmentsForm(zipcode, email);
        loginForm.login(data.ztailors_password)
            .waitForElementVisible('#details-form', 5000);

        client.refresh();

        garments.navigate()
            .waitForElementVisible('@zipcode', 10000)
            .setValue('@zipcode', zipcode)
            .click('@zipcodeSubmit')
            .waitForElementNotPresent('@loading', 10000)
            .waitForElementVisible('@expertiseLabel', 10000)
            .assert.visible('@email')
            .assert.visible('@expertiseLabel')
            .setValue('@email', email)
            .click('@expertiseLabel')
            .waitForElementNotPresent('@loading', 10000)
            .click('@submitForm')
            .waitForElementVisible('#details-form', 10000);

        client.end();
    }
};