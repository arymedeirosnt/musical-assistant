import React from "react";
import RoundSelector from "../RoundSelector";
import GetCompass from "../GetCompass";
import LooperOnOff from "../LooperOnOff";
class Looper extends React.Component {
    constructor(props){
        super(props);
        this.state = { loaded: false };
        this.parameters = window.localStorage.getItem("looper") ? JSON.parse(window.localStorage.getItem("looper")) : { bpm: 60, tempo: 1, compass: 4 };
    }

    componentDidMount(){
        const self = this;
        require("../recorder.js");
        window.AudioContext = window.AudioContext || window.webkitAudioContext  || window.mozAudioContext || window.msAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL  || window.msURL;    
        this.context = new window.AudioContext();
        this.context.createGain = this.context.createGain || this.context.createGainNode;
        /*navigator.getUserMedia({audio: true}, function (stream) {
            var input = self.context.createMediaStreamSource(stream);
            self.recorder = new Recorder(input);
            self.setState({ loaded: true});
        },function(e){});*/
    }

    bpmChange(bpm){
        this.parameters.bpm = bpm;
        window.localStorage.setItem("looper",JSON.stringify(this.parameters));
    }

    tempoChange(tempo){
        this.parameters.tempo = tempo;
        window.localStorage.setItem("looper",JSON.stringify(this.parameters));
    }

    render(){
        return (
            <div className="looper-container">
                <div className="looper-main">
                    <div className="dsp-compass">
                        <GetCompass value={this.parameters.compass}/>
                    </div>
                    <div className="btn-bpm">
                        <RoundSelector label="BPM" value={this.parameters.bpm} min="40" max="218" onChange={this.bpmChange.bind(this)} />
                    </div>
                    <div className="btn-tempo">
                        <RoundSelector label="TEMPO" value={this.parameters.tempo} values={["3/4","4/4"]} onChange={this.tempoChange.bind(this)} />
                    </div>
                    <div className="btn-on-off">
                        <LooperOnOff />
                    </div>
                </div>
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