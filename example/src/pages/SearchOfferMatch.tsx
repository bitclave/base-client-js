import * as React from 'react';
import BaseManager from '../manager/BaseManager';
import { lazyInject } from '../Injections';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import Offer from 'bitclave-base/repository/models/Offer';
import OfferList from '../components/lists/OfferList';
import SearchRequest from 'bitclave-base/repository/models/SearchRequest';
import SearchRequestList from '../components/lists/SearchRequestList';
import {OfferSearch} from 'bitclave-base';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    offersList: Array<Offer>;
    searchRequestList: Array<SearchRequest>;
    selectedOffer: Offer | undefined;
    selectedSearch: SearchRequest | undefined;
}

export default class SearchOfferMatch extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            offersList: [],
            searchRequestList: [],
            selectedOffer: undefined,
            selectedSearch: undefined
        };
    }

    componentDidMount() {
        this.baseManager
            .getOfferManager()
            .getAllOffers()
            .then(this.onSyncOffers.bind(this));

        this.baseManager
            .getSearchManager()
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
                            selectable={true}
                            data={this.state.offersList}
                            onItemClick={(item: Offer) => this.onOfferClick(item)}
                        />
                    </div>

                    <div className="my-5 justify-content-center align-items-center">
                        <div className="text-white">Search Requests:</div>
                        <SearchRequestList
                            selectable={true}
                            data={this.state.searchRequestList}
                            onItemClick={(item: SearchRequest) => this.onRequestClick(item)}
                        />
                    </div>

                    <div className="text-center">
                        <Button
                            color="primary"
                            onClick={() => this.onMatchClick()}
                        >
                            Match offer with search
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    private onMatchClick() {
        if (this.state.selectedOffer === undefined) {
            alert('Please select offer');
            return;
        }

        if (this.state.selectedSearch === undefined) {
            alert('Please select search request');
            return;

        }
        this.baseManager.getSearchManager().addResultItem(
            new OfferSearch(this.state.selectedSearch.id, this.state.selectedOffer.id)
        )
            .then(() => alert('offer successful added to search result!'))
            .catch(() => alert('something went wrong'));
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
        this.setState({selectedOffer: offer});
    }

    private onRequestClick(searchRequest: SearchRequest) {
        this.setState({selectedSearch: searchRequest});
    }

}
