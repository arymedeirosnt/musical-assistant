import React, { useState } from 'react';
import  TabButton  from "../TabButton";

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            components: [
                {id: 0, title: "Afinador", element: "tuner"},
                {id: 1, title: "Metronomo", element: "metronome"},
                {id: 2, title: "Loop", element: "loop" }
            ],
            activeID: null
        };
        //this.handleClick = this.handleClick.bind(this);
    }
 
    handleClick(e) {
        const panels = document.getElementsByClassName("panel");
        for ( let i = 0; i < panels.length; i++){
            panels[i].className = "panel";
        }        
        const tab = e.target.closest('.tab');
        if ( tab ){
            const id = tab.id;
            panels[id].className += " active";
            this.setState({ activeID: id });
        }
    }

    renderComponents() {
        return (this.state.components.map( c =>
            <TabButton
                id={c.id}
                key={c.id}
                active={c.id == this.state.activeID}
                className= {c.id == this.state.activeID ? 'active': ''}
                title={c.title}
                handleClick={this.handleClick.bind(this)} 
            />)
        );
    }

    render() {
        return this.renderComponents()
    }
 


}

export default Tabs;
