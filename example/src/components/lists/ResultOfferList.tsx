import * as React from 'react';
import AbstractList, { AbstractProperties } from './AbstractList';
import Offer from 'bitclave-base/repository/models/Offer';
import OfferHolder from '../holders/OfferHolder';
import { OfferSearch, OfferSearchResultItem } from 'bitclave-base';
import OfferSearchHolder from '../holders/OfferSearchHolder';

interface Properties extends AbstractProperties<Offer> {
    onComplainClick: Function;
    onGrantAccessClick: Function;
}

export default class ResultOfferList extends AbstractList<Properties, OfferSearchResultItem> {

    bindHolder(dataItem: OfferSearchResultItem, position: number): Object {
        return (
            <div>
                <OfferHolder
                    selected={false}
                    onClick={(model: Offer, target: React.Component) => this.onClick(model, target)}
                    model={dataItem.offer}
                    key={`offer-${position}`}
                />
                <OfferSearchHolder
                    selected={false}
                    onClick={() => null}
                    onComplainClick={() => this.props.onComplainClick(dataItem)}
                    onGrantAccessClick={() => this.props.onGrantAccessClick(dataItem)}
                    model={dataItem.offerSearch}
                    key={`stat-${position}`}
                />
            </div>

        );
    }

}
