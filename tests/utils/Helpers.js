module.exports = {
    clearStorage: function(client) {
        client.execute(function () {
            localStorage.clear();
        });
    },

    validCreditCardExpirationDate: function() {
        var today = new Date();
        return {
            month: today.getMonth() + 1,
            year: today.getFullYear() + 1
        }
    }
};
