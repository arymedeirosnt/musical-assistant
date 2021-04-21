import React from "react";
import ReactCanvasGauge from "../ReactCanvasGauge";
import OnOffButton from "../OnOffButton";
import PitchDetector from "../pitchDetector.js"

let instance;

class Tuner extends React.Component {
    constructor(props){
        super(props);
        this.state = { pitch : new PitchDetector(), onOff: false, note: "--", cents: 0, value: 50, initialized: false }
        instance = this;
        this.onOffChanged = this.onOffChanged.bind(this);
        this.state.pitch.setModelLoadCallBack(this.onModelLoaded);
		this.state.pitch.setPitchCallBack(this.gotPitch);
		this.state.pitch.setSilenceCallBack(this.gotSilence);
    }

    gotPitch(pitch){
		if ( instance.state.onOff ){
			instance.setState({ note: pitch.note, cents: pitch.detune,value: (pitch.detune+90)*100/180 });
		}
	}

	gotSilence(){
		instance.setState({ note: "--", value: 50 });
	}

	async onOffChanged(){
		if ( !this.state.onOff ){
			this.state.pitch.init();
			this.setState({ initialized: true});	
    	}
		else{
			this.state.pitch.terminate();
			this.setState({ initialized: false });
		}
		this.setState({ onOff : !this.state.onOff, note: "--", value: 50 });		
	}

    render() {
        return (
            <div className="center">
                <ReactCanvasGauge
                    key="radialGauge"
                    width={300}
                    height={300}
                    value={this.state.value}
                    gaugeType="RADIAL"
                    startAngle = {60}
                    ticksAngle= {240}
                    valueBox = {false}
                    majorValue = {100}
                    minorValue = {-90}
                    majorTicks = {["",""]}
                    minorTicks = {2}
                    strokeTicks = { true }
                    colorPlate = {"#fff"}
                    needleType =  {"arrow"}
                    needleWidth = {2}
                    needleCircleSize = {7}
                    needleCircleOuter =  {true}
                    needleCircleInner = {false}
                    animationDuration = {1500}
                    animationRule =  {"linear"}					
                    highlights ={[
                        {
                            "from": 0,
                            "to": 20,
                            "color": "rgba(255, 0, 0, .75)"
                        },
                        {
                            "from": 20,
                            "to": 40,
                            "color": "rgba(255, 165, 0, .75)"
                        },
                        {
                            "from": 40,
                            "to": 48,
                            "color": "rgba(255, 255, 0, .75)"
                        },
                        {
                            "from": 48,
                            "to": 52,
                            "color": "rgba(0, 128, 0, .75)"
                        },
                        {
                            "from": 52,
                            "to": 60,
                            "color": "rgba(255, 255, 0, .75)"
                        },
                        {
                            "from": 60,
                            "to": 80,
                            "color": "rgba(255, 165, 0, .75)"
                        },

                        {
                            "from": 80,
                            "to": 100,
                            "color": "rgba(255, 0, 0, .75)"
                        }

                    ]}
                    />
                    <OnOffButton onChange={this.onOffChanged}></OnOffButton>
                    <div className="control">
                        <div className="mostrador">
                            <span>{this.state.note}</span>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Tuner;