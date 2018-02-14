import { RouteComponentProps } from 'react-router';
import * as React from 'react';
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
    clientFields: Array<string>;
}

export default class CreateRequest extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    private clientCheckedFields: Set<number> = new Set<number>();

    constructor(props: Props) {
        super(props);

        this.state = {
            searchClientId: '',
            clientFields: []
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
                        <Form>
                            <InputGroup>
                                <Input
                                    value={this.state.searchClientId}
                                    onChange={e => this.onChangeClientId(e.target.value)}
                                    placeholder="client id"
                                />
                                <InputGroupAddon addonType="prepend">
                                    <Button color="primary" onClick={e => this.onClickSearch()}>Search</Button>
                                </InputGroupAddon>
                            </InputGroup>

                            <SimpleList
                                data={this.state.clientFields}
                                onCheck={(index: number, checked: boolean) => this.onCheckClientField(index, checked)}
                            />

                            <Button
                                className="m-1"
                                hidden={(this.state.clientFields.length === 0 || this.clientCheckedFields.size === 0)}
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

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onChangeClientId(value: string): void {
        this.setState({searchClientId: value});
    }

    private onCheckClientField(index: number, checked: boolean): void {
        if (checked) {
            this.clientCheckedFields.add(index);

        } else {
            this.clientCheckedFields.delete(index);
        }

        this.setState({});
    }

    private onSendRequestClick() {
        const fields: Array<string> = [];

        this.clientCheckedFields.forEach(value => {
            fields.push(this.state.clientFields[value]);
        });

        this.baseManager.createRequest(this.state.searchClientId.trim(), fields)
            .then(result => alert('Request has been created!'))
            .catch(reason => alert('Something went wrong! =('));

        this.clientCheckedFields.clear();
        this.setState({searchClientId: '', clientFields: []});
    }

    private onClickSearch() {
        this.clientCheckedFields.clear();
        this.setState({clientFields: []});

        this.baseManager.getClientRawData(this.state.searchClientId.trim())
            .then((fields: Map<string, string>) => {
                const keys: Array<string> = Array.from(fields.keys());
                this.setState({clientFields: keys});
            });
    }

}