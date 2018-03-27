window.addEventListener('load', async function() {
    const api = new Base.NodeAPI('https://base2-bitclva-com.herokuapp.com');
    api.changeStrategy(Base.RepositoryStrategyType.Postgres);

    var alertResponseError = function (response) {
        alert([
            'Status: ' + response.status,
            'Message: ' + response.json.message,
        ].join('\n'));
    };

    var alertAccount = function (account) {
        alert('Public key: ' + account.publicKey);
    };

    var parseMnemonic = function () {
    	return $('#bitclavePassword').val();
    };

    var onClickSignin = function () {
        api.accountManager.checkAccount(parseMnemonic()).then(alertAccount, alertResponseError);
    };

    var onClickSignup = function () {
        api.accountManager.registration(parseMnemonic()).then(alertAccount, alertResponseError);
    };

    $('#signin').on('click', onClickSignin);
    $('#signup').on('click', onClickSignup);
});
