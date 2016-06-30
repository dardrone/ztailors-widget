import React, { Component } from 'react';
import Zipcode from '../zipcode/Zipcode';

export default class AddressChangeZipcode extends Component {

    constructor(props) {
        super(props);
    }

    onChangeZipcodeClick() {
        this.props.updateViewIndex(
            <Zipcode
                updateViewIndex={this.props.updateViewIndex}/>);
    }

    render() {
        return (
            <button type="button" className="btn btn-link" onClick={this.onChangeZipcodeClick.bind(this)}>Change</button>
        );
    }
}
