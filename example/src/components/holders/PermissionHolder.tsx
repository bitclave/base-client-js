import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import PermissionModel from '../../models/PermissionModel';

interface Prop {
    model: PermissionModel;
    onAcceptClick: Function;
}

export default class PermissionHolder extends React.Component<Prop, {}> {

    render() {
        return (
            <small>
                <Row>
                    <Col className="client-data-item-field" xs="5">{this.prepareFromTo()}</Col>

                    <Col className="client-data-item-field" xs="2">
                        Requested:
                        <br/>
                        {this.prepareRequestFields()}
                    </Col>
                    <Col className="client-data-item-field" xs="3">
                        Accepted:
                        <br/>
                        <br/>
                        {this.prepareResponseFields()}
                    </Col>

                    {this.prepareAcceptButton()}
                </Row>
            </small>
        );
    }

    private prepareFromTo() {
        const result: Array<any> = [];
        const {from, to, accountPublicKey} = this.props.model;

        if (from && from != accountPublicKey) {
            result.push(<div key='from'>from: {from}</div>);
        }

        if (to && to != accountPublicKey) {
            result.push(<div key='to'>to: {to}</div>);
        }

        return result;
    }

    private prepareRequestFields() {
        if ( this.props.model.requestFields.length<1 ) {
            return <div key='grant'>grant access</div>
        }

        if (this.props.model.requestFields && this.props.model.requestFields.length) {
            return this.props.model.requestFields.map(item => {
                return <div key={item}>{item}</div>;
            });
        }

    }

    private prepareResponseFields() {
        if (this.props.model.to == this.props.model.accountPublicKey) {
            return this.props.model.responseFields.map(item => {
                return <div key={item}>{item}</div>;
            });
        }

        const result: Array<any> = [];
        this.props.model.decryptedFields.forEach((value, key) => {
            result.push(<div key={key}>{key} => {value}</div>);
        });

        return result;
    }

    private prepareAcceptButton() {
        if (this.props.onAcceptClick == null || this.props.model.accountPublicKey != this.props.model.to) {
            return;
        }

        const {responseFields, requestFields} = this.props.model;

        if (requestFields.length<1) return;
        
        // const missing = responseFields.filter(item => requestFields.indexOf(item) < 0);
        const missing = requestFields.filter(item => responseFields.indexOf(item) < 0);
        if (responseFields.length != requestFields.length || missing.length > 0) {
            return (<Col className="client-data-item-field" xs="auto">
                <Button color="success" onClick={e => this.props.onAcceptClick()}>Accept</Button>
            </Col>);
        }

    }

}
