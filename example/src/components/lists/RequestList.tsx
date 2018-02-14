import * as React from 'react';
import RequestHolder from '../holders/RequestHolder';
import RequestModel from '../../models/RequestModel';

interface Properties {
    data: Array<RequestModel>;
    onAcceptClick: Function;
    onRejectClick: Function;
}

export default class RequestList extends React.Component<Properties, {}> {

    render() {
        return (
            <div>
                {this.bindItems()}
            </div>
        );
    }

    bindItems() {
        const {data, onAcceptClick, onRejectClick} = this.props;
        const result: Array<Object> = [];
        let item: object;

        data.forEach((value: RequestModel, index: number) => {
            item = (
                <RequestHolder
                    model={value}
                    onAcceptClick={() => onAcceptClick(index)}
                    onRejectClick={() => onRejectClick(index)}
                    key={index}
                />
            );
            result.push(item);
        });

        return result;
    }

}
