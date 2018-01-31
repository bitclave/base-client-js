import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './res/styles/index.scss';
import 'bootstrap/dist/css/bootstrap.css';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { HashRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <HashRouter>
        <div>
            <Route exact={true} path="/" component={Auth} />
            <Route path="/dashboard/" component={Dashboard} />
        </div>
    </HashRouter>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
