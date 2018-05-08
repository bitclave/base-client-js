import * as React from 'react';
import ListGroup from 'reactstrap/lib/ListGroup';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';

interface Properties {
    data: Map<string, boolean>;
    onCheck: Function;
}

export default class SimpleList extends React.Component<Properties, {}> {

    render() {
        return (
            <ListGroup>
                {this.bindItems()}
            </ListGroup>
        );
    }

    bindItems() {
        const data: Map<string, boolean> = this.props.data;
        const onCheck = this.props.onCheck;
        const result: Array<Object> = [];
        let item: object;

        data.forEach((value: boolean, key: string) => {
            item = (
                <ListGroupItem key={key}>
                    <Label>{key}</Label>
                    <Input
                        type="checkbox"
                        defaultChecked={value}
                        onChange={e => onCheck(key, e.target.checked)}
                        className="checkbox-default"
                    />
                </ListGroupItem>
            );

            result.push(item);
        });

        return result;
    }

}
