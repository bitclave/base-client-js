import * as React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Offer from 'base/repository/models/Offer';
import AbstractHolder, { AbstractProperties, AbstractState } from './AbstractHolder';

interface Properties extends AbstractProperties<Offer> {
}

export default class OfferHolder extends AbstractHolder<Properties, Offer, AbstractState> {

    public bindModel(model: Offer): object {
        return (
            <Row>
                <Col className="client-data-item-field" xs="2" sm="3">{this.prepareDesc()}</Col>
                <Col className="client-data-item-field" xs="6" sm="2">
                    {this.prepareFields(this.props.model.tags)}
                </Col>
                <Col className="client-data-item-field" xs="6" sm="2">
                    {this.prepareFields(this.props.model.compare)}
                </Col>
                <Col className="client-data-item-field" xs="6" sm="3">
                    {this.prepareFields(this.props.model.rules)}
                </Col>
            </Row>
        );
    }

    private prepareDesc() {
        const model: Offer = this.props.model;
        return (
            <div>
                <div>{model.id}</div>
                <div>{model.title}</div>
                <div>{model.description}</div>
                <div>{model.imageUrl}</div>
            </div>
        );
    }

    private prepareFields(map: Map<String, Object>) {
        const result: Array<object> = [];

        map.forEach((value, key) => {
            result.push(<div key={key.toString()}>{key}: {value.toString()}</div>);
        });

        return result;
    }

}