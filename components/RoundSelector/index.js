import React, { useState } from 'react';

class RoundSelector extends React.Component {
    constructor(props){
        super(props);
        this.onChange = props.onChange || function(){};
        this.state = {};
        this.state.value = props.value ? parseInt(props.value) : 0;
        this.min = props.min ? parseInt(props.min) : 0;
        this.max = props.max ? parseInt(props.max) : 100;

        if ( props.values ){
            this.state.canDown = this.state.value > 0;
            this.state.canUp = this.state.value < (props.values.length -1);
        }
        else{
            this.state.canDown = this.state.value > this.min;
            this.state.canUp = this.state.value < this.max;
        }
        this.onUp = this.onUp.bind(this);
        this.onDown = this.onDown.bind(this);

    }

    onDown(){
        if ( !this.state.canDown )
            return;

        const value = this.state.value - 1;
        if ( this.props.values ){
            this.setState({value: value, canDown : value > 0, canUp : value < this.props.values.length-1 });
        }
        else{
            this.setState({ value: value, canDown: value > this.min, canUp: value < this.max });
        }
        this.onChange(value);
    }

    onUp(){
        if ( !this.state.canUp )
            return;

        const value = this.state.value + 1
        if (this.props.values ){
            this.setState({value: value, canDown : value > 0, canUp: value < this.props.values.length-1});
        }
        else{
            this.setState({ value: value, canDown: value > this.min, canUp: value < this.max});
        }
        this.onChange(value);
    }

    render(){
        return (
            <div className="rs-select">
                <div className="semi-up"></div>
                <div className="semi-down"></div>
                <div className="rs-display">
                    <div className="rs-value">{ this.props.values ? this.props.values[this.state.value] : this.state.value}</div>
                    <div>{this.props.label ? this.props.label : ''}</div>
                </div>
                <div className={'arrow-up' + (this.state.canUp ? '' : ' disabled')} onClick={this.onUp}></div>
                <div className={'arrow-down'+ (this.state.canDown ? '': ' disabled')} onClick={this.onDown}></div>
            </div>
        );
    }
}

export default RoundSelector;