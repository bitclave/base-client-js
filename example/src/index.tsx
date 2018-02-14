import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './res/styles/index.css';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { HashRouter, Route } from 'react-router-dom';
import Requests from './pages/Requests';
import Responses from './pages/Responses';
import CreateRequest from './pages/CreateRequest';

ReactDOM.render(
    <HashRouter>
        <div className="router">
            <Route exact={true} path="/" component={Auth}/>
            <Route path="/dashboard/" component={Dashboard}/>
            <Route path="/create-request/" component={CreateRequest}/>
            <Route path="/requests/" component={Requests}/>
            <Route path="/responses/" component={Responses}/>
        </div>
    </HashRouter>,
    document.getElementById('root') as HTMLElement
);
