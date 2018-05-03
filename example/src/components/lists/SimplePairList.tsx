import * as React from 'react';
import PairItemHolder from '../holders/PairItemHolder';
import AbstractList, { AbstractProperties } from './AbstractList';
import Pair from '../../models/Pair';

interface Properties extends AbstractProperties<Pair<string, string>> {
    onDeleteClick: Function;
}

export default class SimplePairList extends AbstractList<Properties, Pair<string, string>> {

    bindHolder(dataItem: Pair<string, string>, position: number): Object {
        return (
            <PairItemHolder
                name={dataItem.key}
                value={dataItem.value}
                onDeleteClick={this.getDeleteCallBack()}
                key={position}
            />
        );
    }

    private getDeleteCallBack(): Function | null {
        const {onDeleteClick} = this.props;
        if (onDeleteClick) {
            return () => onDeleteClick(dataItem.key)
        } else {
            return null
        }

    }
}
