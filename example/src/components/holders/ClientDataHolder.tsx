import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import '../../res/styles/ClientDataHolder.css';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';

interface Prop {
    keyField: string;
    valueField: string;
    onDeleteClick: Function|null;
}

export default class ClientDataHolder extends React.Component<Prop, {}> {
    render() {
        return (
            <Row>
                <Col className="client-data-item-field" xs="6" sm="4">{this.props.keyField}</Col>
                <Col className="client-data-item-field" xs="6" sm="4">{this.props.valueField}</Col>
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
