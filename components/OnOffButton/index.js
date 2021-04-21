import React from "react";
import Switch from "react-switch";

class OnOffButton extends React.Component {
    constructor(param){
        super(param);
        this.state = { checked: false }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({ checked });
        if (typeof this.props.onChange === "function" )
            this.props.onChange();
    }

    render() {
        return (
            <div className="flex onoff">
                <Switch className="onOff" onChange={this.handleChange} checked={this.state.checked } />
            </div>
        );
      }
}

export default OnOffButton;