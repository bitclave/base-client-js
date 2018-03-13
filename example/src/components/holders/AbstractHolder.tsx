import * as React from 'react';
import '../../res/styles/AbstractHolder.css';

export interface AbstractProperties<M> {
    model: M;
    onClick: Function;
    selected: boolean;
}

export interface AbstractState {
    selected: boolean;
}

export default abstract class AbstractHolder<P extends AbstractProperties<M>, M, S extends AbstractState>
    extends React.Component<P, S> {

    componentWillMount() {
        this.setState({selected: this.props.selected});
    }

    render() {
        return (
            <div
                onClick={() => this.props.onClick(this.props.model, this)}
                className={this.state.selected ? 'active' : ''}
            >
                {this.bindModel(this.props.model)}
            </div>
        );
    }

    abstract bindModel(model: M): object;

}
