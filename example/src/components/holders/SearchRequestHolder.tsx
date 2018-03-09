import * as React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import SearchRequest from 'base/repository/models/SearchRequest';

interface Properties {
    model: SearchRequest;
}

export default class SearchRequestHolder extends React.Component<Properties, {}> {

    render() {
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
            result.push(<div>{key} => {value}</div>);
        });

        return result;
    }

}
