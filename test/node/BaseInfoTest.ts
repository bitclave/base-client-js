// tslint:disable:no-unused-expression
import { version } from '../../package.json';
import Base, { HttpTransport, RepositoryStrategyType } from '../../src/Base';
import { AccountRepository } from '../../src/repository/account/AccountRepository';
import AccountRepositoryImpl from '../../src/repository/account/AccountRepositoryImpl';
import { AssistantNodeRepository } from '../../src/repository/assistant/AssistantNodeRepository';
import { NodeInfoRepository } from '../../src/repository/node/NodeInfoRepository';
import { NodeInfoRepositoryImpl } from '../../src/repository/node/NodeInfoRepositoryImpl';
import { DataRequestRepository } from '../../src/repository/requests/DataRequestRepository';
import DataRequestRepositoryImpl from '../../src/repository/requests/DataRequestRepositoryImpl';
import { SiteRepository } from '../../src/repository/site/SiteRepository';
import { SiteRepositoryImpl } from '../../src/repository/site/SiteRepositoryImpl';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { BasicLogger } from '../../src/utils/BasicLogger';

require('chai').use(require('chai-as-promised')).should();

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

function createNodeAssistant(httpTransport: HttpTransport): AssistantNodeRepository {
    const accountRepository: AccountRepository = new AccountRepositoryImpl(httpTransport);
    const dataRequestRepository: DataRequestRepository = new DataRequestRepositoryImpl(httpTransport);
    const siteRepository: SiteRepository = new SiteRepositoryImpl(httpTransport);
    const nodeInfo: NodeInfoRepository = new NodeInfoRepositoryImpl(httpTransport);

    return new AssistantNodeRepository(accountRepository, dataRequestRepository, siteRepository, nodeInfo);
}

describe('Node Assistant and root Base methods', async () => {
    const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
    const httpTransport = TransportFactory.createHttpTransport(baseNodeUrl, new BasicLogger());
    const assistant = createNodeAssistant(httpTransport);

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
