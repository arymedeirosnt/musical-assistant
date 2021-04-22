import React, { useState } from 'react';

class GetCompass extends React.Component {
    constructor(props){
        super(props);
        this.state = { value: props.value || 4 };
        this.onChange = props.onChange || function(){};
    }

    stepDown(){
        const value = this.state.value - 1;
        if ( value > 0 ){
            this.setState({value: value});
            this.onChange(value);
        }
    }

    stepUp(){
        const value = this.state.value + 1;
        if ( value <= 32 ){
            this.setState({value:value});
            this.onChange(value);
        }
    }

    render(){
        return (
            <div className="get-compass">
                <div className="btn-down" onClick={this.stepDown.bind(this)}>
                    <span className={'arrow-left'+(this.state.value > 1 ? '' : ' disabled')}></span>
                </div>
                <div className="compass-ct">
                    <div className="display">{this.state.value}</div>
                    <div className="title">COMPASSOS</div>
                </div>
                <div className="btn-up" onClick={this.stepUp.bind(this)}>
                    <span className={'arrow-right'+(this.state.value < 32 ? '': ' disabled')}></span>
                </div>
            </div>
        )
    }
}

export default GetCompass;