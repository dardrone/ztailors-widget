module.exports = {
    'User can request reset password': function (client) {
        var data = client.globals;
        var garments = client.page.garments();
        var loginForm = client.page.loginForm();
        var details = client.page.details();

        garments.submitGarmentsForm('90210', data.ztailors_username);
        loginForm.waitForElementVisible('@loginFormDiv', 5000)
            .click('@forgotPasswordLink')
            .waitForElementVisible('@forgotPasswordEmail', 1000)
            .click('@forgotPasswordButton')
            .waitForElementVisible('@forgotPasswordSuccess', 10000);

        client.end();
    }
};