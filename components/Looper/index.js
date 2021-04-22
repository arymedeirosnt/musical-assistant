import React from "react";
import RoundSelector from "../RoundSelector";

class Looper extends React.Component {
    constructor(props){
        super(props);
        this.state = { loaded: false }
    }

    componentDidMount(){
        const self = this;
        require("../recorder.js");
        window.AudioContext = window.AudioContext || window.webkitAudioContext  || window.mozAudioContext || window.msAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL  || window.msURL;    
        this.context = new window.AudioContext();
        this.context.createGain = this.context.createGain || this.context.createGainNode;
        navigator.getUserMedia({audio: true}, function (stream) {
            var input = self.context.createMediaStreamSource(stream);
            self.recorder = new Recorder(input);
            self.setState({ loaded: true});
        },function(e){});
    }

    render(){
        return (
            <div>
                <RoundSelector label="BPM"/>
                <RoundSelector label="TEMPO" value="3/4" />
                <h2>{this.state.loaded ? "Ok" : "NADA"}</h2>
                <div className="stripe">
                <div>
                    Looper
                </div>
            </div>

            </div> 
        )
    }
}

export default Looper;