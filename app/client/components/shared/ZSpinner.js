import React, { Component } from 'react';
import classNames from 'classnames';

export default class ZSpinner extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let classes = classNames(
            this.props.show ? 'fa fa-spinner' : '', 'fa-spin',
            this.props.inverse ? 'fa-inverse' : '', this.props.classes);
        return (
            <span style={{display: !this.props.show ? 'hide' : ''}}>
                <i style={{margin:'0 6px 0 6px'}} className={classes}/>
            </span>
        );
    }
}