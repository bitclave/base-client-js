import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import '../../res/styles/ClientDataHolder.css';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Input from 'reactstrap/lib/Input';

interface Prop {
    name: string;
    value: string;
    listOptions: Array<string>;
    onSelectOption: Function;
    onDeleteClick: Function | null;
}

export default class PairItemOptionsHolder extends React.Component<Prop, {}> {
    render() {
        return (
            <Row>
                <Col className="client-data-item-field" xs="6" sm="4">{this.props.name}</Col>
                <Col className="client-data-item-field" xs="6" sm="4">
                    <Input type="select" name=">" onChange={e => this.props.onSelectOption(e.target.value)}>
                        {this.prepareListOptions()}
                    </Input>
                </Col>
                <Col className="client-data-item-field" sm="4">{this.prepareDeleteButton()}</Col>
            </Row>
        );
    }

    prepareListOptions() {
        const result: Array<object> = [];
        for (let value of this.props.listOptions) {
            result.push(<option key={result.length}>{value}</option>);
        }

        return result;
    }

    prepareDeleteButton() {
        if (this.props.onDeleteClick != null) {
            const {onDeleteClick} = this.props;
            return <Button color="danger" onClick={e => onDeleteClick()}>Delete</Button>;
        } else {
            return '';
        }
    }
}
