import React, { Component } from 'react';

export default class ZBackButton extends Component {

    constructor(props) {
        super(props);
    }

    handlerGoToPreviousClick() {
        this.props.goToPrevView();
    }

    render() {
        return (
            <button onClick={this.handlerGoToPreviousClick.bind(this)} className="zback-button btn btn-link">
                <i className="fa fa-caret-left"/> BACK
            </button>
        );
    }
}