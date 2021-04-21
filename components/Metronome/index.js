import React from "react";
import OnOffButton from "../OnOffButton";
// import ReactCanvasGauge from "../ReactCanvasGauge";

import { WorkerMetronome } from '../metronome_base.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import dynamic from 'next/dynamic';

config.autoAddCss = false;

const DynamicGauge = dynamic(
    () => import('../ReactCanvasGauge'),
    { ssr: false }
  )
  

class Metronome extends React.Component {
    constructor(props){
        super(props);
        this.state = { value: 50, tempo: 60, onOff: false }
        this.metronome = null;
        this.onOffChanged = this.onOffChanged.bind(this);
        this.beat = this.beat.bind(this);
    }

    beat(){
        this.setState({ value: (this.state.value === 100 || this.state.value === 50 ? 0 : 100) });
    }

    async onOffChanged(){
        if ( !this.state.onOff ){
            this.metronome = new WorkerMetronome(this.state.tempo);
            this.metronome.start(this.beat);
    	}
		else{
			this.metronome.stop();
		}
		this.setState({ onOff : !this.state.onOff, value: 50 });		

    }

    render() {
        return (
            <div className="center">
                <DynamicGauge
                    key="radialGauge"
                    width={300}
                    height={300}
                    value={this.state.value}
                    gaugeType="RADIAL"
                    startAngle = {110}
                    ticksAngle= {140}
                    valueBox = {false}
                    majorValue = {100}
                    majorTicks = {["",""]}
                    minorTicks = {0}
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
                            "to": 100,
                            "color": "rgba(0, 0, 0, .75)"
                        }
                    ]}
                    />
                    <OnOffButton onChange={this.onOffChanged}></OnOffButton>
                    <div className="control control-met">
                        <FontAwesomeIcon icon={faMinus} />
                        <div className="mostrador">
                            <span>{this.state.tempo}</span>
                        </div>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>

                </div>
        )
    }
}

export default Metronome;