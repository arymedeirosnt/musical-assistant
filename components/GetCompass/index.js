import React, { useState } from 'react';

class GetCompass extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="get-compass">
                <div className="btn-down">
                    <span className="arrow-left"></span>
                </div>
                <div className="compass-ct">
                    <div className="display">
                        12
                    </div>
                    <div className="title">COMPASSOS</div>
                </div>
                <div className="btn-up">
                    <span className="arrow-right"></span>
                </div>
            </div>
        )
    }
}

export default GetCompass;