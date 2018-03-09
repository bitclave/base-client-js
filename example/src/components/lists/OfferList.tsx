import * as React from 'react';
import AbstractList, { AbstractProperties } from './AbstractList';
import Offer from 'base/repository/models/Offer';
import OfferHolder from '../holders/OfferHolder';

interface Properties extends AbstractProperties<Offer> {
}

export default class OfferList extends AbstractList<Properties, Offer> {

    bindHolder(dataItem: Offer, position: number): Object {
        return (
            <OfferHolder
                onClick={() => this.onClick(dataItem)}
                model={dataItem}
                key={position}
            />
        );
    }

    private onClick(item: Offer) {
        if (this.props.onItemClick) {
            this.props.onItemClick(item);
        }
    }
}
