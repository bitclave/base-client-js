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
import { CompareAction, Offer } from 'bitclave-base';
import SimplePairList from '../components/lists/SimplePairList';
import SimplePairOptionsList from '../components/lists/SimplePairOptionsList';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    title: string;
    desc: string;
    imageUrl: string;
    worth: string;
    inputTagKey: string;
    inputTagValue: string;
    inputCompareKey: string;
    inputCompareValue: string;
}

export default class CreateOffer extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    tags: Array<Pair<string, string>> = [];
    compareActions: Array<string> = ['=', '!=', '<=', '>=', '>', '<'];
    compareActionToValue: Map<string, CompareAction> = new Map<string, CompareAction>(
        [
            ['=', CompareAction.EQUALLY],
            ['!=', CompareAction.NOT_EQUAL],
            ['<=', CompareAction.LESS_OR_EQUAL],
            ['>=', CompareAction.MORE_OR_EQUAL],
            ['>', CompareAction.MORE],
            ['<', CompareAction.LESS]
        ]
    );
    compare: Array<Pair<string, string>> = [];

    compareRules: Array<Pair<string, string>> = [];

    constructor(props: Props) {
        super(props);
        this.state = {
            title: '',
            desc: '',
            imageUrl: '',
            worth: '0',
            inputTagKey: '',
            inputTagValue: '',
            inputCompareKey: '',
            inputCompareValue: '',
        };
    }

    render() {
        return (
            <div className="text-white h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>

                <Container className="h-100 align-items-center">
                    <Input
                        placeholder="title"
                        value={this.state.title}
                        onChange={e => this.onChangeTitle(e.target.value)}
                    />
                    <Input
                        placeholder="description"
                        value={this.state.desc}
                        onChange={e => this.onChangeDesc(e.target.value)}
                    />
                    <Input
                        placeholder="image url"
                        value={this.state.imageUrl}
                        onChange={e => this.onChangeImageUrl(e.target.value)}
                    />
                    <Input
                        placeholder="count of CAT (reward for client)"
                        value={this.state.worth}
                        type="number"
                        step="0.01"
                        onChange={e => this.onChangeWorth(e.target.value)}
                    />
                    <div className="my-4 row justify-content-center align-items-center">
                        <Form className="w-50">
                            <FormGroup>
                                <Row>
                                    Tags:
                                </Row>
                                <Row>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputTagKey || ''}
                                            placeholder="key"
                                            onChange={e => this.onChangeTagKey(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputTagValue || ''}
                                            placeholder="value"
                                            onChange={e => this.onChangeTagValue(e.target.value)}
                                        />
                                    </Col>
                                    <Col sm="4">
                                        <Button color="primary" onClick={e => this.onSetTagClick()}>
                                            Set
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <PairItemHolder name="Key:" value="Value:" onDeleteClick={null}/>
                            <SimplePairList
                                data={this.tags}
                                onDeleteClick={(key: string) => this.onDeleteTagClick(key)}
                            />
                        </Form>
                    </div>
                    <div className="my-4 row justify-content-center align-items-center">
                        <Form className="w-50">
                            <FormGroup>
                                <Row>
                                    Compare (Client private fields):
                                </Row>
                                <Row>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputCompareKey || ''}
                                            placeholder="key"
                                            onChange={e => this.onChangeCompareKey(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input
                                            value={this.state.inputCompareValue || ''}
                                            placeholder="value"
                                            onChange={e => this.onChangeCompareValue(e.target.value)}
                                        />
                                    </Col>
                                    <Col sm="4">
                                        <Button color="primary" onClick={e => this.onSetCompareClick()}>
                                            Set
                                        </Button>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <PairItemHolder name="Key:" value="Value:" onDeleteClick={null}/>
                            <SimplePairList
                                data={this.compare}
                                onDeleteClick={(key: string) => this.onDeleteCompareClick(key)}
                            />
                        </Form>
                    </div>
                    <div className="my-4 row justify-content-center align-items-center">
                        <Form className="w-50">
                            <FormGroup>
                                <Row>
                                    Compare rules:
                                </Row>
                            </FormGroup>

                            <PairItemHolder name="Key:" value="Value:" onDeleteClick={null}/>
                            <SimplePairOptionsList
                                data={this.compareRules}
                                optionsList={this.compareActions}
                                onSelectOption={
                                    (index: number, value: string) =>
                                        this.onChangeCompareRules(index, value)
                                }
                                onDeleteClick={null}
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

    private onChangeTitle(value: string) {
        this.setState({title: value});
    }

    private onChangeDesc(value: string) {
        this.setState({desc: value});
    }

    private onChangeImageUrl(value: string) {
        this.setState({imageUrl: value});
    }

    private onChangeWorth(value: string) {
       const worth: number = parseFloat(value);

        this.setState({worth: (worth || 0).toString()});
    }

    private onChangeCompareRules(index: number, value: string) {
        const action: CompareAction | undefined = this.compareActionToValue.get(value);
        if (action !== undefined) {
            this.compareRules[index].value = action.toString();
        }
    }

    private onChangeTagKey(key: string) {
        this.setState({inputTagKey: key});
    }

    private onChangeTagValue(value: string) {
        this.setState({inputTagValue: value});
    }

    private onChangeCompareKey(key: string) {
        this.setState({inputCompareKey: key});
    }

    private onChangeCompareValue(value: string) {
        this.setState({inputCompareValue: value});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onCreateClick() {
        if (this.state.title.length === 0) {
            alert('Please type Title');
            return;
        }
        if (this.state.desc.length === 0) {
            alert('Please type Description');
            return;
        }

        if (this.tags.length === 0) {
            alert('Add tags for offer');
            return;
        }

        const tagsMap: Map<string, string> = new Map();
        const compareMap: Map<string, string> = new Map();
        const rulesMap: Map<string, CompareAction> = new Map();

        this.tags.forEach(item => {
            tagsMap.set(item.key, item.value);
        });

        this.compare.forEach(item => {
            compareMap.set(item.key, item.value);
        });

        this.compareRules.forEach(item => {
            rulesMap.set(item.key, CompareAction[item.value]);
        });

        this.baseManager
            .getOfferManager()
            .saveOffer(new Offer(
                this.state.desc,
                this.state.title,
                this.state.imageUrl,
                this.state.worth,
                tagsMap,
                compareMap,
                rulesMap
            ))
            .then(result => {
                alert('data has been saved');
                this.onBackClick();
            }).catch(e => alert('Something went wrong! data not saved! =('));
    }

    private onSetTagClick() {
        const {inputTagKey, inputTagValue} = this.state;
        if (inputTagKey == null
            || inputTagKey.trim().length === 0
            || inputTagValue == null
            || inputTagValue.trim().length === 0) {
            alert('The key and value must not be empty');
            return;
        }
        const pos = this.tags.findIndex(model => model.key === inputTagKey);

        if (pos >= 0) {
            this.tags[pos].value = inputTagValue;
        } else {
            this.tags.push(new Pair(inputTagKey, inputTagValue));
        }

        this.setState({inputTagKey: '', inputTagValue: ''});
    }

    private onSetCompareClick() {
        const {inputCompareKey, inputCompareValue} = this.state;
        if (inputCompareKey == null
            || inputCompareKey.trim().length === 0
            || inputCompareValue == null
            || inputCompareValue.trim().length === 0) {
            alert('The key and value must not be empty');
            return;
        }
        const pos = this.compare.findIndex(model => model.key === inputCompareKey);

        if (pos >= 0) {
            this.compare[pos].value = inputCompareValue;
        } else {
            this.compare.push(new Pair(inputCompareKey, inputCompareValue));
            this.compareRules.push(
                new Pair(inputCompareKey, CompareAction.EQUALLY.toString())
            );
        }

        this.setState({inputCompareKey: '', inputCompareValue: ''});
    }

    private onDeleteTagClick(key: string) {
        this.tags = this.tags.filter(model => model.key !== key);

        this.setState({});
    }

    private onDeleteCompareClick(key: string) {
        this.compare = this.compare.filter(model => model.key !== key);
        this.compareRules = this.compareRules.filter(model => model.key !== key);
        this.setState({});
    }

}
