import * as React from 'react';
import BaseManager, { SyncDataListener } from '../manager/BaseManager';
import { lazyInject } from '../Injections';
import { RouteComponentProps } from 'react-router';
import { DataRequestState } from 'base';
import DataRequest from 'bitclave-base/repository/models/DataRequest';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import ResponseList from '../components/lists/ResponseList';
import ResponseModel from '../models/ResponseModel';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    responseData: Array<ResponseModel>;
}

export default class Responses extends React.Component<Props, State> implements SyncDataListener {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            responseData: []
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
                        <ResponseList data={this.state.responseData}/>
                    </div>
                </Container>
            </div>
        );
    }

    async onSyncData(result: Array<DataRequest>) {
        this.baseManager.removeSyncDataListener(this);

        const items: Array<ResponseModel> = [];

        result.forEach(item => {
            if (item.state !== DataRequestState.AWAIT) {
                this.prepareResponseData(item)
                    .then(responseModel => {
                        items.push(responseModel);
                        this.setState({responseData: items});
                    });
            }
        });
    }

    private prepareResponseData(item: DataRequest): Promise<ResponseModel> {
        return this.baseManager.getAuthorizedData(item.toPk, item.responseData)
            .then(result => {
                return new ResponseModel(item.id, item.toPk, result, item.state);
            })
            .catch(reason => {
                return new ResponseModel(item.id, item.toPk, new Map(), item.state);
            });
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

}
