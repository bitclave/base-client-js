import * as React from 'react';
import PermissionModel from '../../models/PermissionModel';
import PermissionHolder from '../holders/PermissionHolder';

interface Properties {
    data: Array<PermissionModel>;
    onAcceptClick: Function;
}

export default class PermissionsList extends React.Component<Properties, {}> {

    render() {
        return (
            <div>
                {this.bindItems()}
            </div>
        );
    }

    bindItems() {
        const {data, onAcceptClick} = this.props;
        const result: Array<Object> = [];
        let item: object;

        data.forEach((value: PermissionModel, index: number) => {
            item = (
                <PermissionHolder
                    model={value}
                    onAcceptClick={onAcceptClick == null ? null : () => onAcceptClick(index)}
                    key={index}
                />
            );
            result.push(item);
        });

        return result;
    }

}
