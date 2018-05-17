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
import BaseManager from '../manager/BaseManager';
import { RouteComponentProps } from 'react-router';
import Pair from '../models/Pair';
import { SearchRequest } from 'bitclave-base';
import SimplePairList from '../components/lists/SimplePairList';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    inputKey: string;
    inputValue: string;
}

export default class CreateSearchRequest extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    tags: Array<Pair<string, string>> = [];

    constructor(props: Props) {
        super(props);
        this.state = {
            inputKey: '',
            inputValue: '',
        };
    }

    render() {
        return (
            <div className="text-white h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>
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

                            <PairItemHolder name="Key:" value="Value:" onDeleteClick={null}/>
                            <SimplePairList
                                data={this.tags}
                                onDeleteClick={(key: string) => this.onDeleteClick(key)}
                            />
                            <Button color="primary" className="m-2 float-right" onClick={e => this.onCreateClick()}>
                                Create
                            </Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }

    private onChangeKey(key: string) {
        this.setState({inputKey: key});
    }

    private onChangeValue(value: string) {
        this.setState({inputValue: value});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onCreateClick() {
        const map: Map<string, string> = new Map();

        this.tags.forEach(item => {
            map.set(item.key, item.value);
        });

        this.baseManager
            .getSearchManager()
            .createRequest(new SearchRequest(map))
            .then(result => {
                alert('data has been saved');
                this.onBackClick();
            }).catch(e => alert('Something went wrong! data not saved! =('));
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
        const pos = this.tags.findIndex(model => model.key === inputKey);

        if (pos >= 0) {
            this.tags[pos].value = inputValue;
        } else {
            this.tags.push(new Pair(inputKey, inputValue));
        }

        this.setState({inputKey: '', inputValue: ''});
    }

    private onDeleteClick(key: string) {
        this.tags = this.tags.filter(model => model.key !== key);

        this.setState({});
    }

}
