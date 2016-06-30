var garmentsCommands = {
	submitGarmentsForm: function(zipcode, email){
		return this.navigate()
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
			.click('@submitForm');
	}
};

module.exports = {
	commands: [garmentsCommands],
	url: function() {
		return this.api.globals.base_url;
	},
	elements: {
		zipcode: {
			selector: '#zipcode'
		},
		loading:{
			selector: '.loader'
		},
		email: {
			selector: '#z_email_address'
		},
		expertiseLabel: {
			selector: '[data-expertise="men"]'
		},
		zipcodeSubmit:{
			selector: '#btn_booktailor'
		},
		submitForm: {
			selector: '//*[@id="appointment-form"]//button[@type="submit"]',
			locateStrategy: 'xpath'
		},
		loginFormDiv: {
			selector: '//div[contains(@class, "login-form")]',
			locateStrategy: 'xpath'
		},
		error:{
			selector: '//div[contains(@class, "list-error")]',
			locateStrategy: 'xpath'
		}
	}
};
