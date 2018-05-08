import * as React from 'react';
import BaseManager, { SyncDataListener } from '../manager/BaseManager';
import { lazyInject } from '../Injections';
import { RouteComponentProps } from 'react-router';
import DataRequest from 'bitclave-base/repository/models/DataRequest';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import PermissionModel from '../models/PermissionModel';
import PermissionsList from '../components/lists/PermissionsList';
import { JsonUtils } from 'bitclave-base';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    permissionsDataRequest: Array<PermissionModel>;
    permissionsDataResponse: Array<PermissionModel>;
}

export default class DataPermissions extends React.Component<Props, State> implements SyncDataListener {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            permissionsDataRequest: [],
            permissionsDataResponse: []
        };
        this.baseManager.getRequests(this.baseManager.account.publicKey, '')
            .then(this.onSyncRequest.bind(this));

        this.baseManager.getRequests('', this.baseManager.account.publicKey)
            .then(this.onSyncResponse.bind(this));
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <div className="m-2 text-white">Response</div>
                        <PermissionsList
                            data={this.state.permissionsDataRequest}
                            onAcceptClick={null}
                        />
                        <div className="m-4"/>
                        <div className="m-2 text-white">Request</div>
                        <PermissionsList
                            data={this.state.permissionsDataResponse}
                            onAcceptClick={(index: number) => this.onAcceptClick(index)}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    async onSyncRequest(requests: Array<DataRequest>) {
        const result: Array<PermissionModel> = [];
        let requestFields: Array<string> = [];
        let authData: Map<string, string> = new Map();

        for (let item of requests) {
            requestFields = await this.baseManager.decryptRequestFields(item.toPk, item.requestData);
            authData.clear();

            if (item.responseData != null && item.responseData.length > 0) {
                authData = await this.baseManager.getAuthorizedData(item.toPk, item.responseData);
            }

            result.push(new PermissionModel(
                item.fromPk,
                item.toPk,
                requestFields,
                Array.from(authData.keys()),
                authData,
                this.baseManager.account.publicKey
            ));
        }

        this.setState({permissionsDataRequest: result});
    }

    async onSyncResponse(requests: Array<DataRequest>) {
        const result: Array<PermissionModel> = [];
        let requestFields: Array<string> = [];
        let authData: Map<string, string> = new Map();
        let json: any;

        for (let item of requests) {
            requestFields = await this.baseManager.decryptRequestFields(item.fromPk, item.requestData);
            authData.clear();

            if (item.responseData != null && item.responseData.length > 0) {
                json = await this.baseManager.decryptRequestFields(item.fromPk, item.responseData);
                authData = JsonUtils.jsonToMap(json);
            }

            result.push(new PermissionModel(
                item.fromPk,
                item.toPk,
                requestFields,
                Array.from(authData.keys()),
                authData,
                this.baseManager.account.publicKey
            ));
        }

        this.setState({permissionsDataResponse: result});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onAcceptClick(index: number) {
        const request: PermissionModel = this.state.permissionsDataResponse[index];
        this.baseManager.grandPermissions(request.from, request.requestFields)
            .then((responseFields) => {
                request.responseFields = responseFields;
                this.setState({permissionsDataResponse: this.state.permissionsDataResponse});
                alert('Fields was accepted');
            })
            .catch(reason => {
                console.log(reason);
                alert('Something went wrong');
            });
    }

}
