import * as assert from 'assert';
import 'reflect-metadata';
import Base, {
    CompareAction,
    GraphLink,
    LinkType,
    Offer,
    OfferPrice,
    OfferSearch,
    SearchRequest
} from '../../src/Base';
import { FieldData } from '../../src/repository/models/FieldData';
import { InputGraphData } from '../../src/repository/models/InputGraphData';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import { BaseClientHelper } from '../BaseClientHelper';

require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('Data Request Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';
    const passPhraseBob: string = 'I\'m Bob. This is my secret password';
    const passPhraseCabe: string = 'I\'m Cabe. This is my secret password';
    const passPhraseDaniel: string = 'I\'m Daniel. This is my secret password';

    const bobsFields = ['name', 'email'];

    let baseAlisa: Base;
    let baseBob: Base;
    let baseCabe: Base;
    let baseDaniel: Base;

    beforeEach(async () => {
        baseAlisa = await BaseClientHelper.createRegistered(passPhraseAlisa);
        baseBob = await BaseClientHelper.createRegistered(passPhraseBob);
        baseCabe = await BaseClientHelper.createRegistered(passPhraseCabe);
        baseDaniel = await BaseClientHelper.createRegistered(passPhraseDaniel);
    });

    it('request for permissions data', async () => {
        await baseAlisa.dataRequestManager.requestPermissions(
            baseBob.accountManager.getAccount().publicKey,
            bobsFields
        );

        const requestsByFrom = await baseAlisa.dataRequestManager.getRequests(
            baseAlisa.accountManager.getAccount().publicKey,
            null
        );

        const requestsByTo = await baseAlisa.dataRequestManager.getRequests(
            null,
            baseBob.accountManager.getAccount().publicKey
        );

        requestsByFrom.should.be.deep.equal(requestsByTo);

        const requestedBobFromAlisa: Array<FieldData> = await baseBob.dataRequestManager.getRequestedPermissions(
            baseAlisa.accountManager.getAccount().publicKey
        );

        requestedBobFromAlisa.length.should.be.equal(0);

        const requestedAlisaFromBob: Array<FieldData> = await baseBob.dataRequestManager
            .getRequestedPermissionsToMe(baseAlisa.accountManager.getAccount().publicKey);

        requestedAlisaFromBob.length.should.be.equal(bobsFields.length);

        const requestedFromBob: Array<string> = (await baseAlisa.dataRequestManager
            .getRequestedPermissions(baseBob.accountManager.getAccount().publicKey))
            .map(item => item.key);

        requestedFromBob.should.be.deep.equal(bobsFields);
    });

    it('create response data', async () => {
        await baseAlisa.dataRequestManager.requestPermissions(
            baseBob.accountManager.getAccount().publicKey,
            bobsFields
        );

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await baseBob.dataRequestManager.grantAccessForClient(
            baseAlisa.accountManager.getAccount().publicKey,
            grantFields
        );

        const requestedFromAlisa = (await baseAlisa.dataRequestManager
            .getRequestedPermissions(baseBob.accountManager.getAccount().publicKey))
            .map(item => item.key);

        requestedFromAlisa.should.be.deep.eq(bobsFields);

        const requestedToBob = (await baseBob.dataRequestManager
            .getRequestedPermissionsToMe(baseAlisa.accountManager.getAccount().publicKey))
            .map(item => item.key);

        requestedToBob.should.be.deep.eq(bobsFields);

        const requestedFromAll = (await baseAlisa.dataRequestManager
            .getRequestedPermissions())
            .map(item => item.key);

        requestedFromAll.should.be.deep.eq(bobsFields);

        const requestedToBobFromAll = (await baseBob.dataRequestManager
            .getRequestedPermissionsToMe())
            .map(item => item.key);

        requestedToBobFromAll.should.be.deep.eq(bobsFields);

        const grantFromAlisaToBob: Array<string> = await baseBob.dataRequestManager
            .getGrantedPermissions(baseAlisa.accountManager.getAccount().publicKey);

        grantFromAlisaToBob.length.should.be.equal(0);

        const requests = await baseAlisa.dataRequestManager
            .getRequests(
                baseAlisa.accountManager.getAccount().publicKey,
                baseBob.accountManager.getAccount().publicKey
            );

        const grantFromBobToAlisa: Map<string, string | undefined> = (await baseAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(baseBob.accountManager.getAccount().publicKey);

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);
    });

    it('grand access to field without requested permissions', async () => {
        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await baseBob.dataRequestManager.grantAccessForClient(
            baseAlisa.accountManager.getAccount().publicKey,
            grantFields
        );

        const grantFromAlisaToBob: Array<string> = await baseBob.dataRequestManager
            .getGrantedPermissions(baseAlisa.accountManager.getAccount().publicKey);

        grantFromAlisaToBob.length.should.be.equal(0);

        const requests = await baseAlisa.dataRequestManager
            .getRequests(
                baseAlisa.accountManager.getAccount().publicKey,
                baseBob.accountManager.getAccount().publicKey
            );

        const grantFromBobToAlisa: Map<string, string | undefined> = (await baseAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(baseBob.accountManager.getAccount().publicKey);

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);
    });

    it('grand access for client and re-share data', async () => {
        // A - save own data
        await baseBob.profileManager.updateData(
            new Map([[bobsFields[0], 'zero index field'], [bobsFields[1], 'one index field']])
        );

        // B make request for A of data
        await baseAlisa.dataRequestManager.requestPermissions(
            baseBob.accountManager.getAccount().publicKey,
            bobsFields
        );

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        // A grant access for B
        await baseBob.dataRequestManager
            .grantAccessForClient(baseAlisa.accountManager.getAccount().publicKey, grantFields);

        const requests = await baseAlisa.dataRequestManager
            .getRequests(
                baseAlisa.accountManager.getAccount().publicKey,
                baseBob.accountManager.getAccount().publicKey
            );

        const grantFromBobToAlisa: Map<string, string | undefined> = (await baseAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(baseBob.accountManager.getAccount().publicKey);

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);

        const reshareFiled = new Map<string, AccessRight>([[bobsFields[0], AccessRight.R]]);

        // B re-share data from A to C
        // Bob [name, email] -> Alisa-Bob[name]
        await baseAlisa.dataRequestManager.grantAccessForClient(
            baseCabe.accountManager.getAccount().publicKey,
            reshareFiled,
            baseBob.accountManager.getAccount().publicKey
        );

        const grantFromAlisaToCabe: Array<string> = await baseCabe.dataRequestManager
            .getGrantedPermissions(baseAlisa.accountManager.getAccount().publicKey);

        grantFromAlisaToCabe.should.be.deep.equal([bobsFields[0]]);

        // C re-share data to D from B (where root A)
        // Bob [name, email] -> Alisa-Bob[name] -> Cabe-Alisa-Bob[name] -> Daniel
        await baseCabe.dataRequestManager.grantAccessForClient(
            baseDaniel.accountManager.getAccount().publicKey,
            reshareFiled,
            baseBob.accountManager.getAccount().publicKey
        );

        const grantFromCabeToDaniel: Array<string> = await baseDaniel.dataRequestManager
            .getGrantedPermissions(baseCabe.accountManager.getAccount().publicKey);

        grantFromCabeToDaniel.should.be.deep.equal([bobsFields[0]]);

        let reShareRequests = await baseCabe.dataRequestManager.getRequests(
            baseCabe.accountManager.getAccount().publicKey,
            baseAlisa.accountManager.getAccount().publicKey
        );

        let reSharedFields =
            (await baseCabe.profileManager.getAuthorizedData(reShareRequests))
                .getKeyValue(
                    baseAlisa.accountManager.getAccount().publicKey,
                    baseBob.accountManager.getAccount().publicKey
                );

        (reSharedFields.get(bobsFields[0]) as string).should.be.eq('zero index field');

        reShareRequests = await baseDaniel.dataRequestManager.getRequests(
            baseDaniel.accountManager.getAccount().publicKey,
            baseCabe.accountManager.getAccount().publicKey
        );

        reSharedFields = (await baseDaniel.profileManager.getAuthorizedData(reShareRequests))
            .getKeyValue(baseCabe.accountManager.getAccount().publicKey, baseBob.accountManager.getAccount().publicKey);

        (reSharedFields.get(bobsFields[0]) as string).should.be.eq('zero index field');
    });

    it('grand access for client and re-share data and revoke', async () => {
        // A - save own data
        await baseBob.profileManager.updateData(
            new Map([[bobsFields[0], 'zero index field'], [bobsFields[1], 'one index field']])
        );

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        // A grant all fileds access for B
        await baseBob.dataRequestManager
            .grantAccessForClient(baseAlisa.accountManager.getAccount().publicKey, grantFields);

        // A grant field by index 1 access for D
        await baseBob.dataRequestManager
            .grantAccessForClient(
                baseDaniel.accountManager.getAccount().publicKey,
                new Map([[bobsFields[1], AccessRight.R]])
            );

        const reshareFiled = new Map<string, AccessRight>([[bobsFields[0], AccessRight.R]]);

        // B re-share data from A to C
        // Bob [name, email] -> Alisa-Bob[name]
        await baseAlisa.dataRequestManager.grantAccessForClient(
            baseCabe.accountManager.getAccount().publicKey,
            reshareFiled,
            baseBob.accountManager.getAccount().publicKey
        );

        // C re-share data to D from B (where root A)
        // Bob [name, email] -> Alisa-Bob[name] -> Cabe-Alisa-Bob[name] -> Daniel
        await baseCabe.dataRequestManager.grantAccessForClient(
            baseDaniel.accountManager.getAccount().publicKey,
            reshareFiled,
            baseBob.accountManager.getAccount().publicKey
        );

        (await baseAlisa.dataRequestManager
            .getGrantedPermissions(baseBob.accountManager.getAccount().publicKey)).should.be.deep.equal(bobsFields);

        (await baseCabe.dataRequestManager
            .getGrantedPermissions(baseAlisa.accountManager.getAccount().publicKey))
            .should.be.deep.equal([bobsFields[0]]);

        (await baseDaniel.dataRequestManager
            .getGrantedPermissions(baseCabe.accountManager.getAccount().publicKey))
            .should.be.deep.equal([bobsFields[0]]);

        (await baseDaniel.dataRequestManager
            .getGrantedPermissions(baseBob.accountManager.getAccount().publicKey))
            .should.be.deep.equal([bobsFields[1]]);

        // revoke
        await baseBob.dataRequestManager.revokeAccessForClient(
            baseAlisa.accountManager.getAccount().publicKey,
            bobsFields
        );

        (await baseAlisa.dataRequestManager
            .getGrantedPermissions(baseBob.accountManager.getAccount().publicKey)).should.be.deep.equal([]);

        (await baseCabe.dataRequestManager
            .getGrantedPermissions(baseAlisa.accountManager.getAccount().publicKey)).should.be.deep.equal([]);

        (await baseDaniel.dataRequestManager
            .getGrantedPermissions(baseCabe.accountManager.getAccount().publicKey)).should.be.deep.equal([]);

        (await baseDaniel.dataRequestManager
            .getGrantedPermissions(baseBob.accountManager.getAccount().publicKey))
            .should.be.deep.equal([bobsFields[1]]);
    });

    it('grand access to field without requested permissions and revoke access', async () => {
        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }

        await baseBob.dataRequestManager.grantAccessForClient(
            baseAlisa.accountManager.getAccount().publicKey,
            grantFields
        );

        const grantFromAlisaToBob: Array<string> = await baseBob.dataRequestManager
            .getGrantedPermissions(baseAlisa.accountManager.getAccount().publicKey);

        grantFromAlisaToBob.length.should.be.equal(0);

        let requests = await baseAlisa.dataRequestManager
            .getRequests(
                baseAlisa.accountManager.getAccount().publicKey,
                baseBob.accountManager.getAccount().publicKey
            );

        let grantFromBobToAlisa: Map<string, string | undefined> = (await baseAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(baseBob.accountManager.getAccount().publicKey);

        const granted: Array<string> = [];

        grantFromBobToAlisa.forEach((value, key) => {
            if (value) {
                granted.push(key);
            }
        });

        granted.should.be.deep.equal(bobsFields);

        await baseBob.dataRequestManager.revokeAccessForClient(
            baseAlisa.accountManager.getAccount().publicKey,
            bobsFields
        );

        requests = await baseAlisa.dataRequestManager
            .getRequests(
                baseAlisa.accountManager.getAccount().publicKey,
                baseBob.accountManager.getAccount().publicKey
            );

        grantFromBobToAlisa = (await baseAlisa.profileManager
            .getAuthorizedData(requests))
            .getKeyValue(baseBob.accountManager.getAccount().publicKey);

        grantFromBobToAlisa.size.should.be.equal(0);
    });

    it('should be Alisa not nothing found from some pk', async () => {
        const somePK = '020b6936ce0264852b713cff3d03faef1994477924ea0ad4c28a0d2543a16d70ec';

        const grantFields: Map<string, AccessRight> = new Map();
        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }
        await baseBob.dataRequestManager.grantAccessForClient(somePK, grantFields);

        let grant: Array<string> = await baseAlisa.dataRequestManager
            .getGrantedPermissionsToMe(baseBob.accountManager.getAccount().publicKey);

        grant.length.should.be.eq(0);

        grant = await baseAlisa.dataRequestManager
            .getGrantedPermissions(baseBob.accountManager.getAccount().publicKey);

        grant.length.should.be.eq(0);

        let requests: Array<FieldData> = await baseAlisa.dataRequestManager
            .getRequestedPermissions(baseBob.accountManager.getAccount().publicKey);

        requests.length.should.be.eq(0);

        requests = await baseAlisa.dataRequestManager
            .getRequestedPermissionsToMe(baseBob.accountManager.getAccount().publicKey);

        requests.length.should.be.eq(0);
    });

    function offerFactory(): Offer {
        const offerTags = new Map<string, string>(
            [
                ['product', 'car'],
                ['color', 'red'],
                ['producer', 'mazda'],
                ['models', 'RX8']
            ]
        );
        const compareUserTag = new Map<string, string>(
            [
                ['age', '10']
            ]
        );

        const rules = new Map<string, CompareAction>(
            [
                ['age', CompareAction.MORE]
            ]
        );

        return new Offer(
            'it is offer description',
            'it is title of offer',
            '', '1', offerTags, compareUserTag, rules
        );
    }

    function requestFactory(): SearchRequest {
        return new SearchRequest(new Map(
            [
                ['product', 'car'],
                ['color', 'red'],
                ['producer', 'mazda'],
                ['models', 'RX8']
            ]
        ));

    }

    it('share data for offer', async () => {
        const grantFields: Map<string, AccessRight> = new Map();

        for (const item of bobsFields) {
            grantFields.set(item, AccessRight.R);
        }
        const offer = offerFactory();

        offer.title = '1';
        offer.offerPrices = [new OfferPrice(0, 'description 100', '100')];
        const createdOffer = await baseAlisa.offerManager.saveOffer(offer);

        const searchRequest = requestFactory();
        const createdSearchRequest = await baseAlisa.searchManager.createRequest(searchRequest);

        const offerSearch1 = new OfferSearch(createdSearchRequest.id, createdOffer.id);
        await baseAlisa.searchManager.addResultItem(offerSearch1);

        const result = await baseAlisa.searchManager.getUserOfferSearches(0, 100);

        await baseAlisa.dataRequestManager.grantAccessForOffer(
            result.content[0].offerSearch.id,
            baseAlisa.accountManager.getAccount().publicKey,
            grantFields,
            createdOffer.offerPrices[0].id
        );
    });

    it('decrypt invalid message', async () => {
        const message: string = 'invalid string';
        const result = await baseAlisa.dataRequestManager
            .decryptMessage(baseAlisa.accountManager.getAccount().publicKey, message);

        assert.ok(result === message, 'WTF?');
    });

    it('check reshare-graph (user, kyc, shepherd)', async () => {
        const alisa = await BaseClientHelper.createRegistered('alisa pass alisa pass alisa pass');
        const shepherd = await BaseClientHelper.createRegistered('shepherd pass shepherd pass shepherd pass');
        const kyc = await BaseClientHelper.createRegistered('kyc pass kyc pass kyc pass');

        // Alisa - save own data
        await alisa.profileManager.updateData(
            new Map([['some_data', 'some_value'], ['kyc_doc', 'kyc_data_value']])
        );

        // Alisa grant access some_data field for Shepherd
        await alisa.dataRequestManager
            .grantAccessForClient(
                shepherd.accountManager.getAccount().publicKey,
                new Map([['some_data', AccessRight.R]])
            );

        // Alisa grant access kyc_doc for Kyc
        await alisa.dataRequestManager
            .grantAccessForClient(kyc.accountManager.getAccount().publicKey, new Map([['kyc_doc', AccessRight.R]]));

        // Kyc - save own data
        await kyc.profileManager.updateData(new Map([['kyc_data', 'some_kyc_data_value']]));

        // Kyc grant access kyc_data for Alisa
        await kyc.dataRequestManager
            .grantAccessForClient(alisa.accountManager.getAccount().publicKey, new Map([['kyc_data', AccessRight.R]]));

        await alisa.dataRequestManager.grantAccessForClient(
            shepherd.accountManager.getAccount().publicKey,
            new Map([['kyc_data', AccessRight.R]]),
            kyc.accountManager.getAccount().publicKey
        );

        const graph = await alisa.dataRequestManager.getRequestsGraph(new InputGraphData(
            [
                alisa.accountManager.getAccount().publicKey,
                shepherd.accountManager.getAccount().publicKey,
                kyc.accountManager.getAccount().publicKey
            ]
        ));

        assert(graph.clients.has(alisa.accountManager.getAccount().publicKey));
        assert(graph.clients.has(shepherd.accountManager.getAccount().publicKey));
        assert(graph.clients.has(kyc.accountManager.getAccount().publicKey));

        const clients = Array.from(graph.clients);
        assert(clients[0] === alisa.accountManager.getAccount().publicKey);
        assert(clients[1] === shepherd.accountManager.getAccount().publicKey);
        assert(clients[2] === kyc.accountManager.getAccount().publicKey);

        const expectedResult = [
            new GraphLink(
                0,
                1,
                'some_data',
                LinkType.SHARE
            ),
            new GraphLink(
                0,
                2,
                'kyc_doc',
                LinkType.SHARE
            ),
            new GraphLink(
                0,
                1,
                'kyc_data',
                LinkType.RESHARE
            ),
            new GraphLink(
                2,
                0,
                'kyc_data',
                LinkType.SHARE
            ),
        ];

        assert(graph.links.length === 4);
        graph.links.should.have.deep.members(expectedResult);

        try {
            await alisa.accountManager.unsubscribe();
            await shepherd.accountManager.unsubscribe();
            await kyc.accountManager.unsubscribe();
        } catch (e) {
            console.warn(e);
        }
    });
});
