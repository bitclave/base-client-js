const should = require('chai')
    .use(require('chai-as-promised'))
    .should();
const Ajv = require('ajv');

describe('Base Schema', async () => {

    it('verify schema library test', function () {

        const schemaEthAddr = {
            'type': 'object',
            'properties': {
                'addr': {
                    'type': 'string'
                },
                'signature': {
                    'type': 'string'
                },
            },
            'required': ['addr'],
            'additionalProperties': false
        };

        const schema = {
            'title': 'Profile',
            'definitions': {
                'address': schemaEthAddr
            },

            'type': 'object',
            'properties': {
                'baseID': {
                    'type': 'string'
                },
                'email': {
                    'type': 'string'
                },
                'wealth': {
                    'description': 'wealth in USD',
                    'type': 'string'
                },
                'wallets': {
                    'description': 'list of ETH wallets',
                    'type': 'array',
                    'items': {'$ref': '#/definitions/address'},
                    'minItems': 1,
                    'uniqueItems': true
                }
            },
            'required': ['baseID'],
            'additionalProperties': false
        };

        const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        const validate = ajv.compile(schema);
        const baseID = '123456';
        const data1 = {
            'baseID': baseID,
            'email': 'mark@bitclave.com',
            'wallets': [
                {'addr': '0xaaa'},
                {'addr': '0xbbb', 'signature': 'signature'}
            ]
        };
        const data2 = {
            'baseID': baseID,
            'email': 'mark@bitclave.com',
            'wallets': [
                {'addr': '0xaaa'},
                {'addr': '0xbbb', 'signature1': 'signature'}
            ]
        };
        validate(data1).should.be.equal(true);
        validate(data2).should.be.equal(false);

        // var valid = validate(data);
        // if (valid) console.log('Valid!');
        // else console.log('Invalid: ' + ajv.errorsText(validate.errors));
    });

});
