import * as React from 'react';
import BaseManager from '../manager/BaseManager';
import { lazyInject } from '../Injections';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import { AccessRight, OfferResultAction, OfferSearch, OfferSearchResultItem } from 'bitclave-base';
import ResultOfferList from '../components/lists/ResultOfferList';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    resultList: Array<OfferSearchResultItem>;
}

export default class SearchResult extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);

        this.state = {
            resultList: []
        };
    }

    componentDidMount() {
        this.baseManager
            .getSearchManager()
            .getSearchResult(this.props.match.params.searchRequestId)
            .then(this.onSyncData.bind(this));
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <ResultOfferList
                            selectable={false}
                            data={this.state.resultList}
                            onGrantAccessClick={(model: OfferSearch) => this.onGrantAccessClick(model)}
                            onComplainClick={(model: OfferSearch) => this.onComplainClick(model)}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    private onSyncData(result: Array<OfferSearchResultItem>) {
        this.setState({resultList: result});
    }

    private onGrantAccessClick(model: OfferSearchResultItem) {
        const grantFields: Map<string, AccessRight> = new Map();
        Array.from(model.offer.compare.keys()).forEach(value => {
            grantFields.set(value, AccessRight.R)
        });

        this.baseManager.getDataReuqestManager()
            .grantAccessForOffer(
                model.offerSearch.id,
                model.offer.owner,
                grantFields
            )
            .then(() => {
                model.offerSearch.state = OfferResultAction.ACCEPT;
                this.setState({resultList: this.state.resultList});
            })
            .catch((e) => {
                console.log(e);
                alert('something went wrong!');
            });
    }

    private onComplainClick(model: OfferSearchResultItem) {
        this.baseManager.getSearchManager()
            .complainToSearchItem(model.offerSearch.id)
            .then(() => {
                model.offerSearch.state = OfferResultAction.REJECT;
                this.setState({resultList: this.state.resultList});
            })
            .catch((e) => {
                console.log(e);
                alert('something went wrong!');
            });
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

}
