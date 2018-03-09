import * as React from 'react';

export interface AbstractProperties<M> {
    data: Array<M>;
    onItemClick?: Function;
}

export default abstract class AbstractList<P extends AbstractProperties<M>, M> extends React.Component<P> {

    public render() {
        return (
            <div>
                {this.bindItems()}
            </div>
        );
    }

    protected bindItems(): Array<Object> {
        const {data} = this.props;
        const len: number = data.length;
        const result: Array<Object> = [];
        for (let i = 0; i < len; i++) {
            result.push(this.bindHolder(data[i], i));
        }

        return result;
    }

    abstract bindHolder(dataItem: M, position: number): Object;

}
