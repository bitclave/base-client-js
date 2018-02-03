import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import Input from 'reactstrap/lib/Input';
import FormGroup from 'reactstrap/lib/FormGroup';
import Form from 'reactstrap/lib/Form';
import { RouteComponentProps } from 'react-router';
import { lazyInject } from '../Injections';
import BaseManager from '../manager/BaseManager';

interface Props extends RouteComponentProps<{}> {
}

export default class Auth extends React.Component<Props> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    mnemonicPhrase: string = '';

    render() {
        return (
            <div className="d-flex align-items-center flex-column justify-content-center h-100">
                <Form>
                    <FormGroup>
                        <Input
                            onChange={e => this.onChangeMnemonic(e.target.value)}
                            className="form-control form-control-lg"
                            bsSize="lg"
                            placeholder={'Mnemonic phrase'}
                        />
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

    onChangeMnemonic(mnemonicPhrase: string) {
        this.mnemonicPhrase = mnemonicPhrase;
    }

    onSingUp() {
        const {history} = this.props;
        this.baseManager.signUp(this.mnemonicPhrase)
            .then(account => history.replace('dashboard'))
            .catch(response => {
                if (response.json.status === 409) {
                    alert('User already registered!');
                } else {
                    alert('message: ' + response.json.error);
                }
            });
    }

    onSingIn() {
        const {history} = this.props;
        this.baseManager.signIn(this.mnemonicPhrase)
            .then(account => history.replace('dashboard'))
            .catch(response => {
                if (response.json.status === 405) {
                    alert('User not found');
                } else {
                    alert('message: ' + response.json.error);
                }
            });
    }

}
