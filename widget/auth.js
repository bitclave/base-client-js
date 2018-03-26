
window.addEventListener('load', async function() {

    const Base = require('Base').default()

    const base = new Base('https://base2-bitclva-com.herokuapp.com');
    base.changeStrategy(RepositoryStrategyType.Postgres);

    $('#signin').click(function(){
    	const pass = $('#bitclavePassword').val();
    	console.log(pass);
    });

});
