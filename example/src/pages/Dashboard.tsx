import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import ClientDataHolder from '../components/holders/ClientDataHolder';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';
import { lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';
import ClientDataList from '../components/lists/ClientDataList';

export default class Dashboard extends React.Component {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    clientData: Map<string, string> = new Map();

    render() {
        return (
            <div className="text-white h-100">
                <Button className="m-2 float-right" color="danger" size="sm" onClick={e => this.onLogoutClick()}>
                    Logout
                </Button>

                <Container className="h-100 align-items-center">
                    <div className="row h-100 justify-content-center align-items-center">
                        <Form>
                            <FormGroup>
                                <Row>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input placeholder="key"/>
                                    </Col>
                                    <Col className="p-0" xs="6" sm="4">
                                        <Input placeholder="value"/>
                                    </Col>
                                    <Col sm="4"><Button color="primary" onClick={(e) => this.onAddClick()}>
                                        Add
                                    </Button>
                                    </Col>
                                </Row>
                            </FormGroup>

                            <ClientDataHolder name="Key:" value="Value:" onDeleteClick={null}/>
                            <ClientDataList
                                data={this.clientData}
                                onDeleteClick={(key: string) => this.onDeleteClick(key)}
                            />
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }

    componentWillMount() {
        this.getDataList();
    }

    getDataList() {
        this.baseManager.loadClientData().then(data => {
            this.clientData = data;

            this.setState({data: this.clientData});
        }).catch(response => {
            alert('message: ' + response);
        });
    }

    onLogoutClick() {
     // dasd
    }

    onAddClick() {
        // dsd
    }

    onDeleteClick(key: string) {
        console.log(this.baseManager);
    }

}
