import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import RequestModel from '../../models/RequestModel';

interface Prop {
    model: RequestModel;
    onAcceptClick: Function;
    onRejectClick: Function;
}

export default class RequestHolder extends React.Component<Prop, {}> {

    render() {
        return (
            <Row>
                <Col className="client-data-item-field" xs="auto">{this.props.model.from}</Col>
                <Col className="client-data-item-field" xs="3">{this.prepareFields()}</Col>
                <Col className="client-data-item-field" xs="auto">
                    <Button color="success" onClick={e => this.props.onAcceptClick()}>Accept</Button>
                </Col>
                <Col className="client-data-item-field" xs="auto">
                    <Button color="danger" onClick={e => this.props.onRejectClick()}>Reject</Button>
                </Col>
            </Row>
        );
    }

    private prepareFields() {
        return this.props.model.fields.map(item => {
            return <div key={item}>{item}</div>;
        });
    }
}
