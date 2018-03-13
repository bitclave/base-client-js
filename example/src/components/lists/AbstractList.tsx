import * as React from 'react';

export interface AbstractProperties<M> {
    data: Array<M>;
    onItemClick?: Function;
    selectable?: boolean;
}

export default abstract class AbstractList<P extends AbstractProperties<M>, M> extends React.Component<P> {

    private selected: React.Component | undefined = undefined;

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

    protected onClick(item: M, target: React.Component) {
        if (this.props.onItemClick) {
            this.props.onItemClick(item);
        }

        if (this.props.selectable) {
            if (this.selected !== undefined) {
                this.selected.setState({selected: false});
            }
            this.selected = target;
            this.selected.setState({selected: true});
        }
    }

    abstract bindHolder(dataItem: M, position: number): Object;

}
