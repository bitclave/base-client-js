import * as React from 'react';
import ResponseModel from '../../models/ResponseModel';
import ResponseHolder from '../holders/ResponseHolder';

interface Properties {
    data: Array<ResponseModel>;
}

export default class ResponseList extends React.Component<Properties, {}> {

    render() {
        return (
            <div>
                {this.bindItems()}
            </div>
        );
    }

    bindItems() {
        const data: Array<ResponseModel> = this.props.data;
        const result: Array<Object> = [];
        let item: object;

        data.forEach((value: ResponseModel, index: number) => {
            item = (
                <ResponseHolder
                    model={value}
                    key={index}
                />
            );
            result.push(item);
        });

        return result;
    }

}
