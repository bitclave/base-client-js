import Base from '../../src/Base';
import Account from '../../src/repository/models/Account';
import DataRequest from '../../src/repository/models/DataRequest';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { ServiceInfo, Service } from '../../src/repository/service/Service';
import GeneralService from '../../src/repository/service/GeneralService';
import { SubscriptionManagerImpl } from '../../src/manager/SubscriptionManagerImpl';
import ServiceType from '../../src/repository/service/ServiceType';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();
const host = 'http://localhost:8080/';
const site = 'localhost';
const sig = 'unique message for sig';

describe('Base SubscriptionManager Test', async () => {
    const passPhraseUser: string = 'user1';
    const passPhraseGPAService: string = 'service1';
    const passPhraseNameService: string = 'name1';
    const baseUser: Base = new Base(host, site);
    const baseGPAService: Base = new Base(host, site);
    const baseNameService: Base = new Base(host, site);
    var accUser: Account;
    var accGPAService: Account;
    var accNameService: Account;

    var nameServiceInfo: ServiceInfo;
    var nameService: Service;

    var gpaServiceInfo: ServiceInfo;
    var gpaService: Service;

    beforeEach(async () => {
        accUser = await baseUser.accountManager.authenticationByPassPhrase(passPhraseUser, sig);
        accGPAService = await baseGPAService.accountManager.authenticationByPassPhrase(passPhraseGPAService, sig);
        accNameService = await baseNameService.accountManager.authenticationByPassPhrase(passPhraseNameService, sig);
        nameServiceInfo = new ServiceInfo(
            'name_service',
            accNameService.publicKey,
            'provide service provider id lookup service',
            [SubscriptionManagerImpl.KEY_SERVICE_INFO]
        );
        nameService = new GeneralService(
            nameServiceInfo,
            baseNameService.profileManager,
            baseNameService.dataRequestManager
        );

        gpaServiceInfo = new ServiceInfo(
            'gpa',
            accGPAService.publicKey,
            'provide gpa certification service',
            ['courses']
        );
        gpaService = new GeneralService(
            gpaServiceInfo,
            baseGPAService.profileManager,
            baseGPAService.dataRequestManager
        );
    });

    it('launch name service', async () => {
        await baseNameService.subscriptionManager.announceService(nameService);
        const data: Map<string, string> = await baseNameService.profileManager.getData();
        data.get(SubscriptionManagerImpl.KEY_SERVICE_INFO).should.be.equal(nameService.toJsonString());
    });

    it('gpa service announce', async () => {
        baseGPAService.subscriptionManager.setNameServiceId(accNameService.publicKey);
        const promise = baseGPAService.subscriptionManager.announceService(gpaService).then(async (res) => {
            res.should.be.equal(true);
            // gpa service verify if its subscription to the name service succeed
            const record: string = await baseGPAService.subscriptionManager.getProcessedData(accNameService.publicKey);
            record.should.be.equal(ServiceInfo.SUBSCRIPTION_PROCESSING);
            // Check whether a pointer entry is added into gpa service's own storage
            const data: Map<string, string> = await baseGPAService.profileManager.getData();
            data.has(nameServiceInfo.type).should.be.equal(true);
        });
        const waitTimer1 = setTimeout(
            async () => {
                // Name service grant 'service' entry to service provider
                const dataRequests: Array<DataRequest> = await baseNameService.dataRequestManager.getRequests(
                    accGPAService.publicKey,
                    accNameService.publicKey);
                dataRequests.length.should.be.equal(1);
                var grantFields: Map<string, AccessRight> = new Map();
                grantFields.set(SubscriptionManagerImpl.KEY_SERVICE_INFO, AccessRight.R);
                await baseNameService.dataRequestManager.grantAccessForClient(accGPAService.publicKey, grantFields);
            },
            10000);

        const waitTimer2 = setTimeout(
            async () => {
                // Name service scan subscription request from service provider
                const dataRequests = await baseNameService.dataRequestManager.getRequests(
                    accNameService.publicKey,
                    '');
                dataRequests.length.should.be.equal(1);
                const request: DataRequest = dataRequests[0];
                const map: Map<string, string> =
                    await baseNameService.profileManager.getAuthorizedData(request.toPk, request.responseData);
                const serviceInfo: ServiceInfo = JSON.parse(map.get(SubscriptionManagerImpl.KEY_SERVICE_INFO));
                // Register this subscriber into own storage & share back pointer
                await nameService.addSubscriber(serviceInfo.id);
                // Add this subscriber's service id into type
                const types: ServiceType = new ServiceType(serviceInfo.type);
                types.spids.push(serviceInfo.id);
                const updates: Map<string, string> = new Map();
                updates.set(types.type, JSON.stringify(types));
                await baseNameService.profileManager.updateData(updates);
            },
            20000);
        await promise;
    });

    it('client get service provider ids from name service', async () => {
        // Client query name service for the gpa service
        baseUser.subscriptionManager.setNameServiceId(accNameService.publicKey);
        const promise = baseUser.subscriptionManager.getServiceProviders('gpa').then((spids) => {
            spids.length.should.be.equal(1);
            spids[0].should.be.equal(accGPAService.publicKey);
        });
        // Name service grant permission
        const waitTimer = setInterval(
            async () => {
                const dataRequests: Array<DataRequest> = await baseNameService.dataRequestManager
                    .getRequests(accUser.publicKey, accNameService.publicKey);

                dataRequests.length.should.be.equal(1);
                const requestKey: Array<string> = await baseNameService.dataRequestManager.decryptMessage(
                    dataRequests[0].fromPk,
                    dataRequests[0].requestData
                );
                requestKey[0].should.be.equal('gpa');
                const grantFields: Map<string, AccessRight> = new Map();
                grantFields.set(requestKey[0], AccessRight.R);
                await baseNameService.dataRequestManager.grantAccessForClient(
                    dataRequests[0].fromPk,
                    grantFields
                );
                clearTimeout(waitTimer);
            },
            10000);
        await promise;
    });

    it('client get service info from gpa service', async () => {
        // Client query gpa service about its service info
        const promise = baseUser.subscriptionManager.getServiceInfo(accGPAService.publicKey).then((serviceInfo) => {
            JSON.stringify(serviceInfo).should.be.equal(gpaService.toJsonString());
        });
        // Gpa service grant permission
        const waitTimer = setInterval(
            async () => {
                const dataRequests: Array<DataRequest> = await baseGPAService.dataRequestManager
                    .getRequests(accUser.publicKey, accGPAService.publicKey);
                dataRequests.length.should.be.equal(1);
                const requestKey: Array<string> = await baseGPAService.dataRequestManager.decryptMessage(
                    dataRequests[0].fromPk,
                    dataRequests[0].requestData
                );
                requestKey[0].should.be.equal(SubscriptionManagerImpl.KEY_SERVICE_INFO);
                const grantFields: Map<string, AccessRight> = new Map();
                grantFields.set(requestKey[0], AccessRight.R);
                await baseGPAService.dataRequestManager.grantAccessForClient(
                    dataRequests[0].fromPk,
                    grantFields
                );
                clearTimeout(waitTimer);
            },
            10000);
        await promise;
    });
});