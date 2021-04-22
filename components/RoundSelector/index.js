import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

class RoundSelector extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="rs-select">
                <div className="semi-up"></div>
                <div className="semi-down"></div>
                <div className="rs-display">
                    <div className="rs-value">{this.props.value ? this.props.value:'--'}</div>
                    <div>{this.props.label ? this.props.label : ''}</div>
                </div>
                <div className="arrow-up"></div>
                <div className="arrow-down"></div>
            </div>
        );
    }
}

export default RoundSelector;