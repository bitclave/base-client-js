import * as React from 'react';
import BaseManager from '../manager/BaseManager';
import { lazyInject } from '../Injections';
import { RouteComponentProps } from 'react-router';
import Button from 'reactstrap/lib/Button';
import Container from 'reactstrap/lib/Container';
import Offer from 'bitclave-base/repository/models/Offer';
import OfferList from '../components/lists/OfferList';

interface Props extends RouteComponentProps<{}> {
}

interface State {
    offersList: Array<Offer>;
}

export default class Offers extends React.Component<Props, State> {

    @lazyInject(BaseManager)
    baseManager: BaseManager;

    constructor(props: Props) {
        super(props);
        this.state = {
            offersList: []
        };
    }

    componentDidMount() {
        this.baseManager
            .getOfferManager()
            .getMyOffers()
            .then(this.onSyncData.bind(this));
    }

    render() {
        return (
            <div className="h-100">
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onBackClick()}>
                    Back
                </Button>
                <Button className="m-2" color="primary" size="sm" onClick={e => this.onCreateOfferClick()}>
                    Create offer
                </Button>
                <Container className="h-100 p-4">
                    <div className="h-100 justify-content-center align-items-center">
                        <OfferList
                            selectable={false}
                            data={this.state.offersList}
                            onItemClick={(item: Offer) => this.onOfferClick(item)}
                        />
                    </div>
                </Container>
            </div>
        );
    }

    private onSyncData(result: Array<Offer>) {
        this.setState({offersList: result});
    }

    private onBackClick() {
        const {history} = this.props;
        history.goBack();
    }

    private onCreateOfferClick() {
        const {history} = this.props;
        history.push('create-offer');
    }

    private onOfferClick(offer: Offer) {
        console.log(offer);
    }

}
