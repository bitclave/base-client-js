import * as React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import SearchRequest from 'bitclave-base/repository/models/SearchRequest';
import { default as AbstractHolder, AbstractProperties, AbstractState } from './AbstractHolder';

interface Properties extends AbstractProperties<SearchRequest> {
}

export default class SearchRequestHolder extends AbstractHolder<Properties, SearchRequest, AbstractState> {

    public bindModel(model: SearchRequest): object {
        return (
            <Row>
                <Col className="client-data-item-field" xs="2" sm="1">{this.props.model.id.toString()}</Col>
                <Col className="client-data-item-field" xs="6" sm="4">{this.prepareFields()}</Col>
            </Row>
        );
    }

    private prepareFields() {
        const result: Array<object> = [];

        this.props.model.tags.forEach((value, key) => {
            result.push(<div key={key.toString()}>{key} => {value}</div>);
        });

        return result;
    }

}
