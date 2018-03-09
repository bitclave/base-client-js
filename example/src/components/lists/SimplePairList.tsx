import * as React from 'react';
import PairItemHolder from '../holders/PairItemHolder';
import AbstractList, { AbstractProperties } from './AbstractList';
import Pair from '../../models/Pair';

interface Properties extends AbstractProperties<Pair<string, string>> {
    onDeleteClick: Function;
}

export default class SimplePairList extends AbstractList<Properties, Pair<string, string>> {

    bindHolder(dataItem: Pair<string, string>, position: number): Object {
        const {onDeleteClick} = this.props;

        return (
            <PairItemHolder
                name={dataItem.key}
                value={dataItem.value}
                onDeleteClick={() => onDeleteClick(dataItem.key)}
                key={position}
            />
        );
    }

}
