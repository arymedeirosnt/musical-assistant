import React from "react";
import RoundSelector from "../RoundSelector";
import GetCompass from "../GetCompass";
import { WorkerMetronome } from '../metronome_base.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faPause, faPlay } from '@fortawesome/free-solid-svg-icons'

class Looper extends React.Component {
    constructor(props){
        super(props);
        this.state = { cls: '', hasRecord: false };
        this.running = false;
        this.recording = false;
        this.parameters = window.localStorage.getItem("looper") ? JSON.parse(window.localStorage.getItem("looper")) : { bpm: 60, tempo: 1, compass: 4 };
        this.audioContext = null;
        this.bpmChange = this.bpmChange.bind(this);
        this.tempoChange = this.tempoChange.bind(this);
        this.compassChange = this.compassChange.bind(this);
        this.loopOnOff = this.loopOnOff.bind(this);
        this.recordSetup = this.recordSetup.bind(this);
        this.beat = this.beat.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.startRecord = this.startRecord.bind(this);
        this.stopRecord = this.stopRecord.bind(this);
        this.createBuffer = this.createBuffer.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount(){
        require("../recorder.js");
    }

    bpmChange(bpm){
        this.parameters.bpm = bpm;
        window.localStorage.setItem("looper",JSON.stringify(this.parameters));
    }

    tempoChange(tempo){
        this.parameters.tempo = tempo;
        window.localStorage.setItem("looper",JSON.stringify(this.parameters));
    }

    compassChange(compass){
        this.parameters.compass = compass;
        window.localStorage.setItem("looper",JSON.stringify(this.parameters));
    }

    loopOnOff(){
        if ( !this.running ){
            const self = this;
            if ( self.state.hasRecord ){
                self.recordSetup();
                self.setup.source.buffer = self.recordingBuffer;
                self.setup.source.start(0);
                self.metronome.start(self.beat);
            }
            else{
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                this.audioContext = new AudioContext();
                this.audioContext.resume().then(()=>{
                    self.recordSetup();
                    navigator.getUserMedia({audio: {
                        echoCancellation : false,
                        noiseSuppression : false
                    }}, function (stream) {
                        var input = self.audioContext.createMediaStreamSource(stream);
                        self.recorder = new Recorder(input);
                        self.metronome = new WorkerMetronome(self.parameters.bpm,self.parameters.tempo+3,self.parameters.compass);
                        self.metronome.start(self.beat,self.startRecord,self.stopRecord);    
                    },function(e){});        
                });
            }
        }
        else{
            if ( this.state.hasRecord )
                this.setup.source.stop();
            this.metronome.stop();
        }
        this.running = !this.running;
    }

    recordSetup(){
        this.setup = {};
        this.setup.source = this.audioContext.createBufferSource();
        this.setup.gainNode = this.audioContext.createGain();
        if (!this.setup.source.start) { this.setup.source.start = this.setup.source.noteOn; }
        if (!this.setup.source.stop) { this.setup.source.stop = this.setup.source.noteOff; }
        this.setup.source.connect(this.setup.gainNode);
        this.setup.gainNode.connect(this.audioContext.destination);
        this.setup.source.loop = true;
    }

    beat(){
        this.setState({cls: this.recording ? 'to-red' : 'to-green' });
    }

    onAnimationEnd(){
        this.setState({cls: ''});
    }

    startRecord(){
        this.recording = true;
        this.recorder.record();
    }

    createBuffer(buffers, channelTotal ) {
        let channel = 0;
        const buffer = this.audioContext.createBuffer(channelTotal, buffers[0].length, this.audioContext.sampleRate);
        for (channel = 0; channel < channelTotal; channel += 1) {
            buffer.getChannelData(channel).set(buffers[channel]);
        }
        return buffer;
    }

    stopRecord(){
        const self = this;
        if ( self.recording ){
            self.recorder.stop();
            self.recorder.getBuffer(function (buffers) {
                self.recordingBuffer = self.createBuffer(buffers, 2);
                self.setState({ hasRecord: true});
                self.setup.source.buffer = self.recordingBuffer;
                self.setup.source.start(0);
                self.metronome.stop();
            });
        }
        this.recording = false;
    }

    reset(){
        if ( this.state.hasRecord ){
            if ( this.running ){
                this.setup.source.stop();
                this.recordingBuffer = null;
            }
        }
        this.metronome.stop();
        this.setState({ hasRecord: false});
        this.running = false;
    }

    render(){
        return (
            <div className="looper-container">
                <div className="looper-main">
                    <div className="dsp-compass">
                        <GetCompass value={this.parameters.compass} onChange={this.compassChange}/>
                    </div>
                    <div className="btn-bpm">
                        <RoundSelector label="BPM" value={this.parameters.bpm} min="40" max="218" onChange={this.bpmChange} />
                    </div>
                    <div className="btn-tempo">
                        <RoundSelector label="TEMPO" value={this.parameters.tempo} values={["3/4","4/4"]} onChange={this.tempoChange} />
                    </div>
                    <div className="btn-on-off">
                        <div id="onOff" className={'lp-on-off '+this.state.cls} onClick={this.loopOnOff}  onAnimationEnd={this.onAnimationEnd}>
                            <div>
                                <FontAwesomeIcon icon={this.state.hasRecord ? faPlay : faCircle} /> / <FontAwesomeIcon icon={faPause} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'reset'+(this.state.hasRecord ? ' active':'')} onClick={this.reset}>RESET</div>
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