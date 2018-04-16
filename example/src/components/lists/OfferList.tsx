import * as React from 'react';
import AbstractList, { AbstractProperties } from './AbstractList';
import Offer from 'bitclave-base/repository/models/Offer';
import OfferHolder from '../holders/OfferHolder';

interface Properties extends AbstractProperties<Offer> {
}

export default class OfferList extends AbstractList<Properties, Offer> {

    bindHolder(dataItem: Offer, position: number): Object {
        return (
            <OfferHolder
                selected={false}
                onClick={(model: Offer, target: React.Component) => this.onClick(model, target)}
                model={dataItem}
                key={position}
            />
        );
    }

}
