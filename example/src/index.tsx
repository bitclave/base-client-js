import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './res/styles/index.css';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { HashRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <HashRouter>
        <div className="router">
            <Route exact={true} path="/" component={Auth} />
            <Route path="/dashboard/" component={Dashboard} />
        </div>
    </HashRouter>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
