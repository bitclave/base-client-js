

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Base Schema', async () => {


    it('verify schema library test', function () {

        var schema_eth_addr = {
            "type": "object",
            "properties":  {
                "addr" : {
                    "type" : "string"
                },
                "signature": {
                    "type": "string"
                },
            },
            "required": ["addr"],
            "additionalProperties": false
        }

        var schema = {
            "title": "Profile",
            "definitions": {
                "eth_address": schema_eth_addr
            },

            "type": "object",
            "properties": {
                "baseID" : {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "wealth": {
                    "description": "wealth in USD",
                    "type": "string"
                },
                "eth_wallets": {
                    "description": "list of ETH wallets",
                    "type": "array",
                    "items": { "$ref": "#/definitions/eth_address" },
                    "minItems": 1,
                    "uniqueItems" : true
                }
            },
            "required": ["baseID"],
            "additionalProperties": false
        };

        var Ajv = require('ajv');
        var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
        var validate = ajv.compile(schema);
        var baseID = "123456";
        var data1 = {
            "baseID": baseID,
            "email": "mark@bitclave.com",
            "eth_wallets": [
                {"addr": "0xaaa"},
                {"addr": "0xbbb", "signature": "signature"}
            ]
        }
        var data2 = {
            "baseID": baseID,
            "email": "mark@bitclave.com",
            "eth_wallets": [
                {"addr": "0xaaa"},
                {"addr": "0xbbb", "signature1": "signature"}
            ]
        }
        validate(data1).should.be.equal(true);
        validate(data2).should.be.equal(false);

        // var valid = validate(data);
        // if (valid) console.log('Valid!');
        // else console.log('Invalid: ' + ajv.errorsText(validate.errors));


    });

});
