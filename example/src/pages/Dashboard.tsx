import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import PairItemHolder from '../components/holders/PairItemHolder';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { lazyInject } from '../Injections';
import BaseManager, { SyncDataListener } from '../manager/BaseManager';
import ClientDataList from '../components/lists/SimplePairList';
import { RouteComponentProps } from 'react-router';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import Badge from 'reactstrap/lib/Badge';
import DataRequest from 'base/repository/models/DataRequest';
import { DataRequestState } from 'base';
import Pair from '../models/Pair';
import Web3 from 'web3'
const ethUtil = require('ethereumjs-util');

interface Props extends RouteComponentProps<{}> {
}

interface State {
    inputKey: string;
    inputValue: string;
    ethAddress: string;
    ethSignature: string;
    numberRequests: number;
    numberResponses: number;
    clientDataRefreshhTrigger: number;
}

var web3: Web3;

window.addEventListener('load', function() {
    if (typeof window.web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        web3 = new Web3(window.web3.currentProvider)


        console.log('Injected web3 detected.');
    }
});

var g_Dashboard: any;

export default class Dashboard extends React.Component<Props, State> implements SyncDataListener {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    clientData: Array<Pair<string, string>> = [];

    constructor(props: Props) {
        super(props);
        this.state = {
            inputKey: '',
            inputValue: '',
            ethAddress: '',
            ethSignature: '',
            numberRequests: 0,
            numberResponses: 0,
            clientDataRefreshhTrigger: 0
        };
    }

    componentDidMount() {
        this.baseManager.addSyncDataListener(this);
        this.getDataList();
        this.state.ethSignature = "aaa";

        g_Dashboard = this;
    }

    componentWillUnmount() {
        this.baseManager.removeSyncDataListener(this);
    }

    render() {
        return (
            <div className="text-white h-100">
                <Button className="m-2 float-right" color="danger" size="sm" onClick={e => this.onLogoutClick()}>
                    Logout
                </Button>

                <ButtonGroup className="m-2 btn-group-toggle justify-content-center">
                    <Button color="primary" onClick={e => this.onRequestsClick()}>
                        Requests <Badge color="secondary">{this.state.numberRequests}</Badge>
                    </Button>{''}
                    <Button color="primary" onClick={e => this.onResponsesClick()}>
                        Responses <Badge color="secondary">{this.state.numberResponses}</Badge>
                    </Button>{''}
                    <Button color="primary" onClick={e => this.onCreateRequestClick()}>
                        Create request
                    </Button>
                    <Button color="primary" onClick={e => this.onSearchRequestsClick()}>
                        Search Requests
                    </Button>
                    <Button color="primary" onClick={e => this.onOffersClick()}>
                        Offers
                    </Button>
                    <Button color="primary" onClick={e => this.onMatchClick()}>
                        Match Search And Offer
                    </Button>
                </ButtonGroup>

                <div className="m-2 text-white">your id: {this.baseManager.getId()}</div>

                <Container className="h-100 align-items-center">
                    <div className="row h-100 justify-content-center align-items-center">
                        <Form>
                            <FormGroup>
                                <Row>
                                    <Col className="p-0" xs="1" sm="2">
                                        <Input
                                            value={'eth_address'} readOnly
                                        />
                                    </Col>
                                    <Col className="p-0" xs="1" sm="5">
                                        <Input
                                            value={this.state.ethAddress || ''}
                                            placeholder="eth address"
                                            onChange={e => this.onChangeEthAddress(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="p-0" xs="1" sm="5">
                                        <Input
                                            value={this.state.ethSignature || ''}
                                            placeholder="signature"
                                            onChange={e => this.onChangeEthSignature(e.target.value)}
                                        />
                                    </Col>
                                </Row>
                                <Row> <p/> </Row>
                                <Row>
                                    <Col xs="3" sm="3">
                                        <Button color="primary"  onClick={e => this.onSetEthAddress()}>
                                            Set Single
                                        </Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="primary"  onClick={e => this.onSetEthSignature()}>
                                            Sign w/Web3
                                        </Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="primary"  onClick={e => this.onVerifyWallets()}>
                                            Verify
                                        </Button>
                                    </Col>
                                    <Col xs="3" sm="3">
                                        <Button color="primary"  onClick={e => this.onSignWallets()}>
                                            SignWallets
                                        </Button>
                                    </Col>
                                </Row>
                                <Row> <p/> </Row>
                                <Row> <p/> </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputKey || ''}
                                            placeholder="key"
                                            onChange={e => this.onChangeKey(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputValue || ''}
                                            placeholder="value"
                                            onChange={e => this.onChangeValue(e.target.value)}
                                        />
                                    </Col>
                                    <Col sm="4">
                                        <Button color="primary" onClick={e => this.onSetClick()}>
                                            Set
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <PairItemHolder name="Key:" value="Value:" onDeleteClick={null}/>
                            <ClientDataList
                                data={this.clientData}
                                onDeleteClick={(key: string) => this.onDeleteClick(key)}
                            />
                            <Button color="primary" className="m-2 float-right" onClick={e => this.onSaveClick()}>
                                Save
                            </Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }

    async onSyncData(result: Array<DataRequest>) {
        let countRequests = 0;
        let countResponses = 0;
        result.forEach(item => {
            if (item.state === DataRequestState.ACCEPT || item.state === DataRequestState.REJECT) {
                countResponses++;
            } else if (item.state === DataRequestState.AWAIT) {
                countRequests++;
            }
        });

        this.setState({
            numberRequests: countRequests,
            numberResponses: countResponses,
        });
    }

    private async getDataList() {
        return this.baseManager.loadClientData()
            .then(data => {
                this.clientData = [];
                data.forEach((value, key) => {
                    this.clientData.push(new Pair(key, value));
                });
                this.state.clientDataRefreshhTrigger=1;
            }).catch(response => console.log('message: ' + JSON.stringify(response)));
    }

    private onChangeKey(key: string) {
        this.setState({inputKey: key});
    }

    private onChangeEthAddress(key: string) {
        this.setState({ethAddress: key});
    }

    private onChangeEthSignature(key: string) {
        this.setState({ethSignature: key});
    }

    private onChangeValue(value: string) {
        this.setState({inputValue: value});
    }

    private onLogoutClick() {
        const {history} = this.props;
        history.replace('/');
    }

    private onRequestsClick() {
        const {history} = this.props;
        history.push('requests');
    }

    private onResponsesClick() {
        const {history} = this.props;
        history.push('responses');
    }

    private onCreateRequestClick() {
        const {history} = this.props;
        history.push('create-request');
    }

    private onSearchRequestsClick() {
        const {history} = this.props;
        history.push('search-requests');
    }

    private onOffersClick() {
        const {history} = this.props;
        history.push('offers');
    }

    private onMatchClick() {
        const {history} = this.props;
        history.push('search-match');
    }

    private onSaveClick() {
        const map: Map<string, string> = new Map();

        this.clientData.forEach(item => {
            map.set(item.key, item.value);
        });

        this.baseManager.saveData(map)
            .then(result => alert('data has been saved'))
            .catch(e => alert('Something went wrong! data not saved! =(') + e);
    }

    private onSetEthAddress() {
        // alert('onSetEthAddress');
        const {ethAddress, ethSignature} = this.state;
        if (ethAddress == null
            || ethAddress.trim().length === 0
            || ethAddress == null
            || ethAddress.trim().length === 0) {
            alert('The ethAddress must not be empty');
            return;
        }
        var pos = this.clientData.findIndex(model => model.key === 'eth_wallets');

        var newAddr = {
            'baseID' : this.baseManager.getId(),
            'ethAddr': ethAddress
        };
        var newAddrRecord = {
            'data' : JSON.stringify(newAddr),
            'sig' : ethSignature
        };
        if (pos >= 0) {
            var wallets = JSON.parse(this.clientData[pos].value);
            wallets.data.push(newAddrRecord);
            wallets.sig = '';
            this.clientData[pos].value = JSON.stringify(wallets);
        } else {
            this.clientData.push(new Pair('eth_wallets', JSON.stringify(
                {
                    'data': [newAddrRecord],
                    'sig' : ''
                })));
            pos = this.clientData.length - 1;
        }

        // var msg = JSON.parse(this.clientData[pos].value);
        // var res = this.baseManager.getProfileManager().validateEthWallets(
        //     this.clientData[pos].key, msg, this.baseManager.getId());
        // alert(JSON.stringify(res));

        this.setState({ethAddress: '', ethSignature: ''});
    }

    private onVerifyWallets(){
        var pos = this.clientData.findIndex(model => model.key === 'eth_wallets');
        if (pos>=0) {
            var msg = JSON.parse(this.clientData[pos].value);
            var res = this.baseManager.getProfileManager().validateEthWallets(
                this.clientData[pos].key, msg, this.baseManager.getId());
            alert(JSON.stringify(res));
        }
        else {
            alert('no eth_wallets found');
        }
    }

    private async onSignWallets(){
        var pos = this.clientData.findIndex(model => model.key === 'eth_wallets');
        if (pos>=0) {
            var msg = JSON.parse(this.clientData[pos].value);
            var res = await this.baseManager.getProfileManager().createEthWallets(
                msg.data, this.baseManager.getId());
            msg.sig = res.sig;
            this.clientData[pos].value = JSON.stringify(msg);
            alert('eth_wallets signed');
        }
        else {
            alert('no eth_wallets found');
        }
    }

    private async onSetEthSignature()  {
        var signingAddr : string;
        await web3.eth.getAccounts((err, res) => {
            console.log(res[0]);
            signingAddr = res[0];
        });

        //always use lower casse for addresses
        signingAddr = signingAddr.toLowerCase();

        var thisMessage = JSON.stringify(
            {
                "baseID": this.baseManager.getId(),
                "ethAddr" : signingAddr
            }
        );
        var signedMessage = '';
        if (typeof web3 != 'undefined')
        {
            // alert('onSetEthSignature');
            var msg = ethUtil.bufferToHex(new Buffer(thisMessage, 'utf8'));

            var params = [msg, signingAddr];
            var method = 'personal_sign';
            // alert("Sent message for signing via MetaMask / Mist.");

            var sig: string;
            await web3.currentProvider.sendAsync({
                method,
                params,
                signingAddr,
            }, function(err, result) {
                // if (err) return $scope.notifier.danger(err)
                // if (result.error) return $scope.notifier.danger(result.error)
                sig = result.result;
                signedMessage = JSON.stringify({
                    address: signingAddr,
                    msg: thisMessage,
                    sig: sig,
                    version: '3',
                    signer: 'web3'
                }, null, 2)
                // alert('Successfully Signed Message with ' + signingAddr + signedMessage);
                g_Dashboard.setState({ethSignature: sig});
                g_Dashboard.setState({ethAddress: signingAddr})
            })
        }

    }

    private onSetClick() {
        const {inputKey, inputValue} = this.state;
        if (inputKey == null
            || inputKey.trim().length === 0
            || inputValue == null
            || inputValue.trim().length === 0) {
            alert('The key and value must not be empty');
            return;
        }
        const pos = this.clientData.findIndex(model => model.key === inputKey);

        if (pos >= 0) {
            this.clientData[pos].value = inputValue;
        } else {
            this.clientData.push(new Pair(inputKey, inputValue));
        }

        this.setState({inputKey: '', inputValue: ''});
    }

    private onDeleteClick(key: string) {
        this.clientData = this.clientData.filter(model => model.key !== key);

        this.setState({});
    }

}
