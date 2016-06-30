module.exports = {

    'Existing user can book tailor': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var complete = client.page.complete();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.login(data.ztailors_password);
        details.waitForElementPresent('@detailsForm', 10000)
            .waitForElementNotVisible('@loadingTitle', 10000)
            .click('@submitDetailsFormButton');

        complete.waitForElementVisible('@submitCompleteForm', 30000);

        client.end();
    }
};