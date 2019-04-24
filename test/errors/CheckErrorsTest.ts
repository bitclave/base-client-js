// tslint:disable:no-unused-expression
import Base from '../../src/Base';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';

require('chai').use(require('chai-as-promised')).should();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);

const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';

describe('Check throw errors', async () => {

    it('should throw error on getData without authorization', async () => {
        const base = new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres
        );

        await expect(base.profileManager.getData()).should.throw;

        try {
           await base.profileManager.getData();
        } catch (e) {
            return;
        }

        throw new Error('not throw or catch error!');
    });

    it('should throw error on updateData without authorization', async () => {
        const base = new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres
        );

        await expect(base.profileManager.updateData(new Map())).should.throw;

        try {
            await base.profileManager.updateData(new Map());
        } catch (e) {
            return
        }

        throw new Error('not throw or catch error!');
    });
});
