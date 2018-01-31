import * as React from 'react';
import { Link } from 'react-router-dom';
import Button from 'reactstrap/lib/Button';

export default class Auth extends React.Component {
    render() {
        return (
            <div>
                <Link to={'dashboard'}>
                    <Button color="primary" size="sm">To dashboard!</Button>
                </Link>
            </div>
        );
    }
}
