import * as React from 'react';
import AbstractList, { AbstractProperties } from './AbstractList';
import Pair from '../../models/Pair';
import PairItemOptionsHolder from '../holders/PairItemOptionsHolder';

interface Properties extends AbstractProperties<Pair<string, string>> {
    optionsList: Array<string>;
    onSelectOption: Function;
    onDeleteClick: Function | null;
}

export default class SimplePairOptionsList extends AbstractList<Properties, Pair<string, string>> {

    bindHolder(dataItem: Pair<string, string>, position: number): Object {
        const {onSelectOption, optionsList} = this.props;

        return (
            <PairItemOptionsHolder
                name={dataItem.key}
                value={dataItem.value}
                listOptions={optionsList}
                onSelectOption={(value: string) => onSelectOption(position, value)}
                onDeleteClick={this.onDeleteButton(dataItem.key)}
                key={position}
            />
        );
    }

    onDeleteButton(key: string) {
        if (this.props.onDeleteClick != null) {
            const {onDeleteClick} = this.props;
            return () => onDeleteClick(key);
        } else {
            return null;
        }
    }
}
