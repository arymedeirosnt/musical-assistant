import React, { useState } from 'react';

class GetCompass extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="get-compass">
                <div class="btn-down">
                    <span class="arrow-left"></span>
                </div>
                <div class="compass-ct">
                    <div className="display">
                        12
                    </div>
                    <div className="title">COMPASSOS</div>
                </div>
                <div class="btn-up">
                    <span class="arrow-right"></span>
                </div>

            </div>
        )
    }
}

export default GetCompass;