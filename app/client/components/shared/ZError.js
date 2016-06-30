import React, { Component } from 'react';
import {isEmpty} from '../../utils/Common';

export default class ZError extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={'list-error z-danger ' + (isEmpty(this.props.error.message)? 'hidden' : '')}>
                <ul>
                    <li style={{display: isEmpty(this.props.error.message) === '' ? 'none' : 'inherit'}} className="">{this.props.error.message}</li>
                </ul>
            </div>
        );
    }
}