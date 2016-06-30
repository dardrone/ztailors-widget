module.exports = {

    'User cannot go back from complete page': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();
        var complete = client.page.complete();
        var backButton = client.page.backButton();

        garments.submitGarmentsForm('90210', data.ztailors_username);

        loginForm.login(data.ztailors_password);
        details.waitForElementPresent('@detailsForm', 5000)
            .waitForElementNotVisible('@loadingTitle', 15000)
            .click('@submitDetailsFormButton');

        complete.waitForElementVisible('@submitCompleteForm', 20000);
        backButton.waitForElementNotPresent('@backButton', 1000);

        client.end();
    }
};
