import React from "react";
import Switch from "react-switch";

class TempoButton extends React.Component {
    constructor(param){
        super(param);
        this.state = { checked: false }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({ checked });
        if (typeof this.props.onChange === "function" )
            this.props.onChange(checked);
    }

    render() {
        return (
            <div className="flex onoff">
                <Switch 
                    className="onOff" 
                    onChange={this.handleChange} 
                    checked={this.state.checked } 
                    onColor="#FFFFFF"
                    onHandleColor="#808080"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    disabled={this.props.disabled}
                    className="react-switch"/>                 
            </div>
        );
      }
}

export default TempoButton;