import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import FormGroup from 'reactstrap/lib/FormGroup';
import Form from 'reactstrap/lib/Form';
import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<{}> {}

export default class Auth extends React.Component<Props> {

    render() {
        return (
            <div className="d-flex align-items-center flex-column justify-content-center h-100">
                <Form>
                    <FormGroup>
                        <Input className="form-control form-control-lg" bsSize="lg" placeholder={'Mnemonic phrase'}/>
                    </FormGroup>
                    <FormGroup>
                        <Button block={true} size="lg" color="primary" onClick={e => this.onSingUp()}>
                            Sign Up
                        </Button>
                    </FormGroup>
                    <FormGroup>
                        <Button block={true} size="lg" color="primary" onClick={e => this.onSingIn()}>
                            SignIn
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }

    onSingUp() {
        const {history} = this.props;
        console.log(history.replace('dashboard'));
    }

    onSingIn() {
//
    }

}
