var loginCommands = {
    login: function(password){
        return this.waitForElementVisible('@loginFormDiv', 5000)
            .assert.containsText('@loginFormDiv', 'LOG IN')
            .setValue('@password', password)
            .click('@submitForm');
    }
};

module.exports = {
    commands: [loginCommands],
    url: function() {
        return this.api.globals.base_url;
    },
    elements: {
        email: {
            selector: '#username'
        },
        password: {
            selector: '#password'
        },
        submitForm: {
            selector: '//*[@id="login-form"]//button[@type="submit"]',
            locateStrategy: 'xpath'
        },
        loginFormDiv: {
            selector: '//div[contains(@class, "login-form")]',
            locateStrategy: 'xpath'
        },
        error: {
            selector: '//*[@id="login-error"]',
            locateStrategy: 'xpath'
        },
        forgotPasswordLink: {
            selector: '#forgot-password'
        },
        forgotPasswordEmail: {
            selector: '#forgot-password-email'
        },
        forgotPasswordButton: {
            selector: '#forgot-password-submit'
        },
        forgotPasswordSuccess: {
            selector: '.success-message'
        }
    }
};
