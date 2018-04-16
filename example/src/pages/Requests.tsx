import * as React from 'react';
import BaseManager, { SyncDataListener } from '../manager/BaseManager';
import { lazyInject } from '../Injections';
import { RouteComponentProps } from 'react-router';
import { DataRequestState } from 'base';
import DataRequest from 'bitclave-base/repository/models/DataRequest';
import RequestModel from '../models/RequestModel';
import RequestList from '../components/lists/RequestList';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    requestData: Array<RequestModel>;
}

export default class Requests extends React.Component<Props, State> implements SyncDataListener {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            requestData: []
        };
    }

    componentDidMount() {
        this.baseManager.addSyncDataListener(this);
    }

    componentWillUnmount() {
        this.baseManager.removeSyncDataListener(this);
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <RequestList
                            data={this.state.requestData}
                            onAcceptClick={(index: number) => this.onAcceptClick(index)}
                            onRejectClick={(index: number) => this.onRejectClick(index)}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    async onSyncData(result: Array<DataRequest>) {
        this.baseManager.removeSyncDataListener(this);
        const items: Array<RequestModel> = [];
        let fields: Array<string>;

        for (let item of result) {
            if (item.state === DataRequestState.AWAIT) {
                fields = await this.baseManager.decryptRequestFields(item.fromPk, item.requestData);
                items.push(new RequestModel(item.id, item.fromPk, fields));
            }
        }

        this.setState({requestData: items});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onAcceptClick(index: number) {
        const request: RequestModel = this.state.requestData[index];
        this.sendRequest(request.requestId, request.from, request.fields);
    }

    private onRejectClick(index: number) {
        const request: RequestModel = this.state.requestData[index];
        this.sendRequest(request.requestId, request.from, []);
    }

    private sendRequest(id: number, from: string, fields: Array<string>) {
        this.baseManager.responseToRequest(id, from, fields)
            .then(state => {
                const items: Array<RequestModel> = this.state.requestData
                    .filter(item => item.requestId !== id);
                this.setState({requestData: items});
                alert('Response has been sent');
            })
            .catch(reason => alert('Something went wrong'));
    }

}
