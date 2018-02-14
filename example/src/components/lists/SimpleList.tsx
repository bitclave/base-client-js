import * as React from 'react';
import ListGroup from 'reactstrap/lib/ListGroup';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';

interface Properties {
    data: Array<string>;
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
        const {data, onCheck} = this.props;
        const result: Array<Object> = [];
        let item: object;

        data.forEach((value: string, index: number) => {
            item = (
                <ListGroupItem key={index}>
                    <Label>{value}</Label>
                    <Input
                        type="checkbox"
                        onChange={e => onCheck(index, e.target.checked)}
                        className="checkbox-default"
                    />
                </ListGroupItem>
            );

            result.push(item);
        });

        return result;
    }

}
