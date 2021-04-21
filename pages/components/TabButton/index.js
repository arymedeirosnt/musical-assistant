import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriver, faInfinity, faHeartbeat } from '@fortawesome/free-solid-svg-icons'
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

class TabButton extends React.Component {
    constructor(props) {
        super(props)
        this.props = props;
        this.icon = props.title === "Afinador" ? faScrewdriver : ( props.title === "Metronomo" ? faHeartbeat : faInfinity);
    }
  // Declarar uma nova variável de state, na qual chamaremos de "count"
  render() {
    return <div id={this.props.id} className={'tab '+this.props.className} onClick={this.props.handleClick}>
                <FontAwesomeIcon icon={this.icon}  size="lg"/>
                <span>{this.props.title}</span>
    </div>;
  }
}

export default TabButton;