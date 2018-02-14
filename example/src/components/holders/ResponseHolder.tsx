import * as React from 'react';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import ResponseModel from '../../models/ResponseModel';
import { DataRequestState } from 'base';

interface Prop {
    model: ResponseModel;
}

export default class ResponseHolder extends React.Component<Prop, {}> {

    render() {
        return (
            <Row>
                <Col className="client-data-item-field" xs="auto">{this.props.model.from}</Col>
                <Col className="client-data-item-field" xs="3">{this.prepareFields()}</Col>
                <Col
                    className={this.stateStyle()}
                    xs="auto"
                >
                    {this.props.model.state}
                </Col>
            </Row>
        );
    }

    private stateStyle() {
        return 'client-data-item-field  text-white '
            + ((this.props.model.state === DataRequestState.ACCEPT)
                ? 'bg-success'
                : 'bg-warning')
            + ' text-white';
    }

    private prepareFields() {
        const result: Array<object> = [];

        this.props.model.fields.forEach((value, key) => {
            result.push(<div key={key}>{key}: {value}</div>);
        });

        return result;
    }

}
