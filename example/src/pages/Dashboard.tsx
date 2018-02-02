import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import ClientDataHolder from '../components/holders/ClientDataHolder';
import Form from 'reactstrap/lib/Form';
import FormGroup from 'reactstrap/lib/FormGroup';
import Input from 'reactstrap/lib/Input';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

export default class Dashboard extends React.Component {

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

                            <ClientDataHolder keyField="Key:" valueField="Value:" onDeleteClick={null}/>
                            <ClientDataHolder keyField="Em" valueField="s@" onDeleteClick={() => this.onDeleteClick()}/>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }

    getDataList() {
        foreach((item) =>{
            return
        })
    }

    onLogoutClick() {
    }

    onAddClick() {
    }

    onDeleteClick() {
        console.log('delete');
    }

}
