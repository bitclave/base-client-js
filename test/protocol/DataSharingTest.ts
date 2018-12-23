/**
 * Test the data sharing flow between users, service provider and business
 */
import Base, { SubscriptionManagerImpl, Offer, CompareAction, SearchRequest, OfferSearch, ShareDataRepository, HttpTransportImpl, ShareDataRepositoryImpl, OfferShareDataRepositoryImpl, OfferShareDataRepository, OfferShareData, TokenPointer, WalletManagerImpl } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { ServiceInfo, Service } from '../../src/repository/service/Service';
import GeneralService from '../../src/repository/service/GeneralService';
import DataRequest from '../../src/repository/models/DataRequest';
import { OfferPrice } from '../../src/repository/models/OfferPrice';
import { OfferPriceRules } from '../../src/repository/models/OfferPriceRules';
import { AccessRight } from '../../src/utils/keypair/Permissions';
import SharePointer from '../../src/repository/offer/SharePointer';

const should = require('chai')
    .use(require('chai-as-promised'))
    .should();
const Web3 = require('web3');

const host = 'http://localhost:8080';
const site = 'localhost';
const sig = 'unique message for sig';
const contractAddress: string = '0xe6116e89f3c7382aa2a974fc409e78ebb7f0819d';
const blockchain: string = 'http://localhost:8545';

describe('Data sharing test between user, service provider and business', async () => {
    const passPhraseUser: string = 'data sharing user';
    const passPhraseService: string = 'data sharing service';
    const passPhraseBusiness: string = 'data sharing business';
    const baseUser: Base = new Base(host, site);
    const baseService: Base = new Base(host, site);
    const baseBusiness: Base = new Base(host, site);
    // The eth_wallets address of the three entities
    let eth_wallets_user: string;
    let eth_wallets_service: string;
    let eth_wallets_business: string;
    // TODO: two configurations
    const web3 = new Web3(new Web3.providers.HttpProvider(blockchain));

    let accUser: Account;
    let accService: Account;
    let accBusiness: Account;

    let shareDataRepoUser: ShareDataRepository;
    let shareDataRepoService: ShareDataRepository;
    let offerShareDataRepoBusiness: OfferShareDataRepository;
    let shareDataRepoBusiness: ShareDataRepository;

    let serviceInfo: ServiceInfo;
    let service: Service;

    let userOriginBalance;
    let serviceOriginBalance;
    let businessOriginBalance;

    function offerFactory(): Offer {
        const offerTags = new Map<String, String>([
            ['bank', 'credit card']
        ]);
        const compareUserTag = new Map<String, String>([
            ['gpa', '4.0']
        ]);
        const rules = new Map<String, CompareAction>([
            ['gpa', CompareAction.EQUALLY]
        ]);
        const offer = new Offer(
            'it is offer description',
            'it is title of offer',
            '', '1', offerTags, compareUserTag, rules
        );
        offer.offerPrices = [
            new OfferPrice(
                0, 'special price for individual with gpa 4.0', '20', [
                    new OfferPriceRules(0, 'gpa', '4.0', CompareAction.EQUALLY),
                    new OfferPriceRules(0, 'courses', 'data', CompareAction.EQUALLY)
                ]
            )
        ];
        return offer;
    }

    function requestFactory(): SearchRequest {
        return new SearchRequest(new Map([
            ['bank', 'credit card'],
        ]));

    }

    beforeEach(async () => {
        let updates: Map<string, string> = new Map();
        accUser = await baseUser.accountManager.authenticationByPassPhrase(passPhraseUser, sig);
        updates.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, eth_wallets_user);
        await baseUser.profileManager.updateData(updates);

        accService = await baseService.accountManager.authenticationByPassPhrase(passPhraseService, sig);
        updates.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, eth_wallets_service);
        await baseService.profileManager.updateData(updates);

        accBusiness = await baseBusiness.accountManager.authenticationByPassPhrase(passPhraseBusiness, sig);
        updates.set(WalletManagerImpl.DATA_KEY_ETH_WALLETS, eth_wallets_business);
        await baseBusiness.profileManager.updateData(updates);
        const accounts = await web3.eth.getAccounts();

        userOriginBalance = await web3.eth.getBalance(accounts[0]);
        serviceOriginBalance = await web3.eth.getBalance(accounts[1]);
        businessOriginBalance = await web3.eth.getBalance(accounts[2]);

        // Fetch the eth_wallet addresses
        eth_wallets_user = accounts[0];
        eth_wallets_service = accounts[1];
        eth_wallets_business = accounts[2];
        shareDataRepoUser = new ShareDataRepositoryImpl(
            baseUser.dataRequestManager,
            baseUser.profileManager,
            new OfferShareDataRepositoryImpl(new HttpTransportImpl(host), baseUser.accountManager, baseUser.profileManager),
            web3,
            contractAddress,
            eth_wallets_user
        );
        shareDataRepoService = new ShareDataRepositoryImpl(
            baseService.dataRequestManager,
            baseService.profileManager,
            new OfferShareDataRepositoryImpl(new HttpTransportImpl(host), baseService.accountManager, baseService.profileManager),
            web3,
            contractAddress,
            eth_wallets_service    
        );
        offerShareDataRepoBusiness = new OfferShareDataRepositoryImpl(new HttpTransportImpl(host), baseBusiness.accountManager, baseBusiness.profileManager);
        shareDataRepoBusiness = new ShareDataRepositoryImpl(
            baseBusiness.dataRequestManager,
            baseBusiness.profileManager,
            offerShareDataRepoBusiness,
            web3,
            contractAddress,
            eth_wallets_business
        );

        serviceInfo = new ServiceInfo(
            'gpa',
            accService.publicKey,
            'GPA certification',
            ['courses']
        );
        service = new GeneralService(serviceInfo, baseService.profileManager, baseService.dataRequestManager);
    });

    it('Announce service', async () => {
        await baseService.subscriptionManager.announceService(service);
        // Check 'service' entry in the storage
        const data: Map<string, string> = await baseService.profileManager.getData();
        data.get(SubscriptionManagerImpl.KEY_SERVICE_INFO).should.be.equal(service.toJsonString());
    });

    it('User subscribe to service', async () => {
        let updates: Map<string, string> = new Map();
        updates.set('courses', 'data');
        await baseUser.profileManager.updateData(updates);
        const promise = baseUser.subscriptionManager.subscribe(serviceInfo).then(async (status) => {
            status.should.be.equal(true);
            const dataRequests: Array<DataRequest> = await baseUser.dataRequestManager.getRequests(accUser.publicKey, accService.publicKey);
            dataRequests.length.should.be.equal(1);
            const data: Map<string, string> = await baseUser.profileManager.getAuthorizedData(dataRequests[0].toPk, dataRequests[0].responseData);
            data.has(accUser.publicKey).should.be.equal(true);
        })
        const waitTimer = setTimeout(
            async () => {
                const dataRequests: Array<DataRequest> = await baseService.dataRequestManager.getRequests(accService.publicKey, '');
                dataRequests.length.should.be.equal(1);
                const uid: string = dataRequests[0].toPk;
                await service.addSubscriber(uid);
                await service.updateData(uid, '4.0');
            },
            10000);
        await promise;
    });

    it('Business create offer & user create search request, match and grant permission', async () => {
        // Business create offer
        const offer = offerFactory();
        const businessOffer = await baseBusiness.offerManager.saveOffer(offer);
        businessOffer.id.should.exist;
        // User create search request
        const request = requestFactory();
        const userSearchRequest = await baseUser.searchManager.createRequest(request);
        // Match offer and search request
        const offerSearch = new OfferSearch(userSearchRequest.id, businessOffer.id);
        await baseUser.searchManager.addResultItem(offerSearch);
        const searchResults = await baseUser.searchManager.getSearchResult(userSearchRequest.id);
        const searchResult: OfferSearch = searchResults[0].offerSearch;
        // Select one OfferPrice object
        const onePrice = businessOffer.offerPrices[0];
        const acceptedFields = onePrice.getFieldsForAcception(AccessRight.R);
        // User Grant permission for offer
        console.log('user grant permission for offer');
        const userPromise = shareDataRepoUser.grantAccessForOffer(searchResult.id, accBusiness.publicKey, acceptedFields, onePrice.id, accUser.publicKey).then(async (status) => {
            status.should.be.equal(true);
            // Check the TokenPointer is written into the storage
            const tokenPointerKey: string = TokenPointer.generateKey(accBusiness.publicKey, accService.publicKey);
            const data: Map<string, string> = await baseUser.profileManager.getData();
            data.has(tokenPointerKey).should.be.equal(true);
            console.log('user share tokenpointer to service provider');
        });
        let businessPromise;
        let servicePromise;
        setTimeout(
            async () => {
                // Get all granted but not yet accepted offer
                const offerShareDatas: Array<OfferShareData> = await offerShareDataRepoBusiness.getShareData(accBusiness.publicKey, false);
                offerShareDatas.length.should.be.equal(1);
                const offerShareData: OfferShareData = offerShareDatas[0];
                const dataFields: Map<string, string> = await baseBusiness.profileManager.getAuthorizedData(offerShareData.clientId, offerShareData.clientResponse);
                console.log('business get not yet accepted share data');
                businessPromise = shareDataRepoBusiness.acceptShareData(dataFields, offerShareData.clientId, accBusiness.publicKey, offerShareData.offerSearchId, offerShareData.worth).then((data) => {
                    // Exclude the eth_wallets entry
                    data.size.should.be.equal(2);
                    data.get('gpa').should.be.equal('4.0');
                    console.log('received data');
                    console.log(data);
                });
            },
            5000);
        setTimeout(
            async () => {
                // Check granted TokenPointer from user, then write & share SharePointer with business
                const dataRequests: Array<DataRequest> = await baseService.dataRequestManager.getRequests(accService.publicKey, accUser.publicKey);
                dataRequests.length.should.be.equal(1);
                const dataRequest: DataRequest = dataRequests[0];
                const data: Map<string, string> = await baseService.profileManager.getAuthorizedData(dataRequest.toPk, dataRequest.responseData);
                const tokenPointerKey: string = await TokenPointer.generateKey(accBusiness.publicKey, accService.publicKey);
                data.has(tokenPointerKey).should.be.equal(true);

                const value: string = data.get(tokenPointerKey);
                const tokenPointer: TokenPointer = JSON.parse(value);
                tokenPointer.token.bid.should.be.equal(accBusiness.publicKey);
                console.log('service get tokenpointer from user');
                servicePromise = shareDataRepoService.shareWithBusiness(tokenPointerKey, value, accUser.publicKey).then(async (status) => {
                    // Check the SharePointer is written into the storage
                    status.should.be.equal(true);
                    const sharePointerKey: string = SharePointer.generateKey(accUser.publicKey, accBusiness.publicKey);
                    const data: Map<string, string> = await baseService.profileManager.getData();
                    data.has(sharePointerKey).should.be.equal(true);
                });
            },
            60000);
        await userPromise;
        await servicePromise;
        await businessPromise;
        const accounts = await web3.eth.getAccounts();
        const userCurrentBalance = await web3.eth.getBalance(accounts[0]);
        const serviceCurrentBalance = await web3.eth.getBalance(accounts[1]);
        const businessCurrentBalance = await web3.eth.getBalance(accounts[2]);
        console.log(`User balance, from ${userOriginBalance} to ${userCurrentBalance}, diff: ${userCurrentBalance - userOriginBalance}`);
        console.log(`Service balance, from ${serviceOriginBalance} to ${serviceCurrentBalance}, diff: ${serviceCurrentBalance - serviceOriginBalance}`);
        console.log(`business balance, from ${businessOriginBalance} to ${businessCurrentBalance}, diff: ${businessCurrentBalance - businessOriginBalance}`);
    });
});