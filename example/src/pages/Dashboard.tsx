import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import ClientDataHolder from '../components/holders/ClientDataHolder';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { lazyInject } from '../Injections';
import BaseManager, { SyncDataListener } from '../manager/BaseManager';
import ClientDataList from '../components/lists/ClientDataList';
import { RouteComponentProps } from 'react-router';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';
import Badge from 'reactstrap/lib/Badge';
import DataRequest from 'base/repository/models/DataRequest';
import { DataRequestState } from 'base';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    inputKey: string;
    inputValue: string;
    numberRequests: number;
    numberResponses: number;
}

export default class Dashboard extends React.Component<Props, State> implements SyncDataListener {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    clientData: Map<string, string> = new Map();

    constructor(props: Props) {
        super(props);
        this.state = {
            inputKey: '',
            inputValue: '',
            numberRequests: 0,
            numberResponses: 0,
        };
    }

    componentDidMount() {
        this.baseManager.addSyncDataListener(this);
        this.getDataList();
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
                </ButtonGroup>

                <div className="m-2 text-white">your id: {this.baseManager.getId()}</div>

                <Container className="h-100 align-items-center">
                    <div className="row h-100 justify-content-center align-items-center">
                        <Form>
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

                            <ClientDataHolder name="Key:" value="Value:" onDeleteClick={null}/>
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
            .then(data => this.clientData = data)
            .catch(response => console.log('message: ' + JSON.stringify(response)));
    }

    private onChangeKey(key: string) {
        this.setState({inputKey: key});
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

    private onSaveClick() {
        this.baseManager.saveData(this.clientData)
            .then(result => alert('data has been saved'))
            .catch(e => alert('Something went wrong! data not saved! =('));
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

        this.clientData.set(inputKey, inputValue);
        this.setState({inputKey: '', inputValue: ''});
    }

    private onDeleteClick(key: string) {
        this.clientData.delete(key);
        this.setState({});
    }

}
