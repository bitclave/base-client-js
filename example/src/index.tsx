import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './res/styles/index.css';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { HashRouter, Route } from 'react-router-dom';
import CreateRequest from './pages/CreateRequest';
import SearchRequests from './pages/SearchRequests';
import Offers from './pages/Offers';
import CreateSearchRequest from './pages/CreateSearchRequest';
import CreateOffer from './pages/CreateOffer';
import SearchOfferMatch from './pages/SearchOfferMatch';
import DataPermissions from './pages/DataPermissions';
import SearchResult from './pages/SearchResult';

ReactDOM.render(
    <HashRouter>
        <div className="router">
            <Route exact={true} path="/" component={Auth}/>
            <Route path="/dashboard/" component={Dashboard}/>
            <Route path="/create-request/" component={CreateRequest}/>
            <Route path="/permissions/" component={DataPermissions}/>
            <Route path="/search-requests/" component={SearchRequests}/>
            <Route path="/search-result/:searchRequestId" component={SearchResult}/>
            <Route path="/create-search-request/" component={CreateSearchRequest}/>
            <Route path="/offers/" component={Offers}/>
            <Route path="/create-offer/" component={CreateOffer}/>
            <Route path="/search-match/" component={SearchOfferMatch}/>
        </div>
    </HashRouter>,
    document.getElementById('root') as HTMLElement
);
