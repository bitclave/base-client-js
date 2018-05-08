import { RouteComponentProps } from 'react-router';
import * as React from 'react';
import { FormEvent } from 'react';
import Form from 'reactstrap/lib/Form';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import SimpleList from '../components/lists/SimpleList';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import { lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';
import Container from 'reactstrap/lib/Container';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    searchClientId: string;
    clientFields: Map<string, boolean>;
}

export default class CreateRequest extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    private clientCheckedFields: Set<string> = new Set<string>();

    constructor(props: Props) {
        super(props);

        this.state = {
            searchClientId: '',
            clientFields: new Map()
        };
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">

                    <div className="h-100 justify-content-center align-items-center">
                        <Form onSubmit={e => this.onSubmitSearch(e)}>
                            <InputGroup>
                                <Input
                                    value={this.state.searchClientId}
                                    onChange={e => this.onChangeClientId(e.target.value)}
                                    placeholder="client id"
                                />
                                <InputGroupAddon addonType="prepend">
                                    <Button color="primary" onClick={e => this.onSearchClick()}>Search</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <SimpleList
                                data={this.state.clientFields}
                                onCheck={(key: string, checked: boolean) => this.onCheckClientField(key, checked)}
                            />

                            <Button
                                className="m-1"
                                hidden={(this.state.clientFields.size === 0 || this.clientCheckedFields.size === 0)}
                                color="primary"
                                onClick={e => this.onSendRequestClick()}
                            >
                                Send request
                            </Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }

    private onSubmitSearch(e: FormEvent<HTMLFormElement>) {
        this.onSearchClick();
        e.preventDefault();
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onChangeClientId(value: string): void {
        this.setState({searchClientId: value});
    }

    private onCheckClientField(key: string, checked: boolean): void {
        if (checked) {
            this.clientCheckedFields.add(key);

        } else {
            this.clientCheckedFields.delete(key);
        }

        this.state.clientFields.set(key, checked);

        this.setState({clientFields: this.state.clientFields});
    }

    private onSendRequestClick() {
        const fields: Array<string> = [];

        this.state.clientFields.forEach((value, key) => {
            if (value) {
                fields.push(key);
            }
        });

        this.baseManager.requestPermissions(this.state.searchClientId.trim(), fields)
            .then(result => alert('Request has been created!'))
            .catch(reason =>
                alert('Something went wrong! =(' + JSON.stringify(reason)));

        this.clientCheckedFields.clear();
        this.setState({searchClientId: '', clientFields: []});
    }

    private onSearchClick() {
        this.clientCheckedFields.clear();
        this.setState({clientFields: []});

        this.baseManager.getClientRawData(this.state.searchClientId.trim())
            .then((fields: Map<string, string>) => {
                const keys: Array<string> = Array.from(fields.keys());
                return this.mergePermissionsClientFields(this.state.searchClientId.trim(), keys);

            }).then(result => this.setState({clientFields: result}))
            .then(res => this.setState({}));
    }

    private mergePermissionsClientFields(clientId: string, clientFields: Array<string>): Promise<Map<string, boolean>> {
        return this.baseManager.getAlreadyRequestedPermissions(clientId)
            .then((permissions: Array<string>) => {
                const result: Map<string, boolean> = new Map();


                for (let clientField of clientFields) {
                    const checked = permissions.indexOf(clientField) > -1;
                    if (checked) {
                        this.clientCheckedFields.add(clientField);
                    }

                    result.set(clientField, checked);
                }

                return result;
            });
    }

}
