import * as React from 'react';
import BaseManager from '../manager/BaseManager';
import { lazyInject } from '../Injections';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import Offer from 'base/repository/models/Offer';
import OfferList from '../components/lists/OfferList';
import SearchRequest from 'base/repository/models/SearchRequest';
import SearchRequestList from '../components/lists/SearchRequestList';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    offersList: Array<Offer>;
    searchRequestList: Array<SearchRequest>;
}

export default class SearchOfferMatch extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            offersList: [],
            searchRequestList: []
        };
    }

    componentDidMount() {
        this.baseManager
            .getOfferManager()
            .getAllOffers()
            .then(this.onSyncOffers.bind(this));

        this.baseManager
            .getSearchRequestManager()
            .getAllRequests()
            .then(this.onSyncSearchRequest.bind(this));
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="justify-content-center align-items-center">
                        <div className="text-white">Offers:</div>
                        <OfferList
                            data={this.state.offersList}
                            onItemClick={(item: Offer) => this.onOfferClick(item)}
                        />
                    </div>

                    <div className="my-5 justify-content-center align-items-center">
                        <div className="text-white">Search Requests:</div>
                        <SearchRequestList
                            data={this.state.searchRequestList}
                            onItemClick={(item: SearchRequest) => this.onRequestClick(item)}
                        />
                    </div>

                </Container>
            </div>
        );
    }

    private onSyncOffers(result: Array<Offer>) {
        this.setState({offersList: result});
    }

    private onSyncSearchRequest(result: Array<SearchRequest>) {
        this.setState({searchRequestList: result});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onOfferClick(offer: Offer) {
        //
    }

    private onRequestClick(searchRequest: SearchRequest) {
        //
    }

}
