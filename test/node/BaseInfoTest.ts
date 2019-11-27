// tslint:disable:no-unused-expression
import { version } from '../../package.json';
import Base, { AssistantNodeFactory, RepositoryStrategyType } from '../../src/Base';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { BasicLogger } from '../../src/utils/BasicLogger';

require('chai').use(require('chai-as-promised')).should();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Node Assistant and root Base methods', async () => {
    const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
    const httpTransport = TransportFactory.createHttpTransport(baseNodeUrl, new BasicLogger());
    const assistant = AssistantNodeFactory.defaultNodeAssistant(httpTransport);

    it('should return base node version', async () => {
        const user = new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres
        );
        const fromAssistant = await assistant.getNodeVersion();
        const fromBase = await user.getNodeVersion();
        fromAssistant.should.be.exist;
        fromAssistant.length.should.be.greaterThan(1);
        fromAssistant.should.be.eq(fromBase);
    });

    it('should return base lib version', async () => {
        const user = new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres
        );
        const fromBase = await user.version;
        version.should.be.exist;
        version.length.should.be.greaterThan(1);
        version.should.be.eq(fromBase);
    });
});
