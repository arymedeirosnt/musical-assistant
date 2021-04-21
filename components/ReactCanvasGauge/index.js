import React from "react";
//import { RadialGauge } from "canvas-gauges";

class ReactCanvasGauge extends React.Component {
  componentDidMount() {
    const MyWindowDependentLibrary = require( 'canvas-gauges' );
    const options = { ...this.props, renderTo: this.canvasRef };
    this.gauge = new MyWindowDependentLibrary.RadialGauge(options).draw();
  }

  componentWillReceiveProps(props) {
    if (this.gauge) {
      this.gauge.update({ value: props.value, animation: true });
    }
  }

  render() {
    return <canvas ref={node => (this.canvasRef = node)} />;
  }
}

export default ReactCanvasGauge;
