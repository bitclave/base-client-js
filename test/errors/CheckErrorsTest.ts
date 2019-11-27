// tslint:disable:no-unused-expression no-any
import Base, { JsonRpc } from '../../src/Base';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';

require('chai').use(require('chai-as-promised')).should();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';

describe('Check throw errors', async () => {

    it('should throw error on getData without authorization', async () => {
        const base = new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );

        await expect(base.profileManager.getData()).should.throw;

        try {
            await base.profileManager.getData();
        } catch (e) {
            console.log(e);
            e.should.be.exist;

            if (e instanceof JsonRpc) {
                // tslint:disable-next-line:no-any
                (e as JsonRpc).getResult<any>().statusCode.should.be.eq(401);

            } else {
                e.message.should.be.eq('publicKey can not find');
            }

            return;
        }

        throw new Error('not throw or catch error!');
    });

    it('should throw error on updateData without authorization', async () => {
        const base = new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );

        await expect(base.profileManager.updateData(new Map())).should.throw;

        try {
            await base.profileManager.updateData(new Map());
        } catch (e) {
            console.log(e);
            e.should.be.exist;

            if (e instanceof JsonRpc) {
                // tslint:disable-next-line:no-any
                if ((e as JsonRpc).getResult<any>().hasOwnProperty('statusCode')) {
                    (e as JsonRpc).getResult<any>().statusCode.should.be.eq(401);

                } else if ((e as JsonRpc).getResult<JsonRpc>().hasOwnProperty('result')) {
                    (e as JsonRpc).getResult<any>().result.should.be.eq('access denied');
                }

            } else {
                e.message.should.be.eq('Invalid Argument: First argument should be an instance of PrivateKey');
            }

            return;
        }

        throw new Error('not throw or catch error!');
    });
});
