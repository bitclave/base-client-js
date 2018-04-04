import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import '../../res/styles/ClientDataHolder.css';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';

interface Prop {
    name: string;
    value: string;
    onDeleteClick: Function | null;
}

export default class PairItemHolder extends React.Component<Prop, {}> {
    render() {
        return (
            <Row>
                <Col className="client-data-item-field" xs="6" sm="4" >{this.props.name}</Col>
                <Col className="client-data-item-field" xs="6" sm="4" >{this.props.value}</Col>
                <Col className="client-data-item-field" sm="4">{this.showDeleteButton()}</Col>
            </Row>

        );
    }

    showDeleteButton() {
        if (this.props.onDeleteClick != null) {
            const {onDeleteClick} = this.props;
            return <Button color="danger" onClick={e => onDeleteClick()}>Delete</Button>;
        } else {
            return '';
        }
    }
}
