import * as React from 'react';
import ClientDataHolder from '../holders/ClientDataHolder';

interface Properties {
    data: Map<string, string>;
    onDeleteClick: Function;
}

export default class ClientDataList extends React.Component<Properties> {

    render() {
        return (
            <div>
                {this.bindItems()}
            </div>
        );
    }

    bindItems() {
        const {data, onDeleteClick} = this.props;
        const result: Array<object> = [];
        let index: number = 0;
        let item: object;

        data.forEach((value: string, key: string) => {
            item = (
                <ClientDataHolder
                    name={key}
                    value={value}
                    onDeleteClick={() => onDeleteClick(key)}
                    key={index}
                />
            );
            result.push(item);
            index++;
        });
        return result;
    }

}
