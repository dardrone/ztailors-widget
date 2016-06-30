import Zipcode from '../zipcode/Zipcode';
import Garments from './Garments';
import React, { Component } from 'react';
import {getZElementByAttributeName, isDefined} from '../../../utils/Common';

export default class StartHome extends Component {

    constructor(props) {
        super(props);
        let zipcode = getZElementByAttributeName('user-zipcode');
        this.state = {
            zipcode: isDefined(zipcode) ? zipcode : null
        }
    }

    render() {
        return (
            <div>
                {this.state.zipcode ?
                    <Garments
                    key="1"
                    zipcode={this.state.zipcode}
                    updateViewIndex={this.props.updateViewIndex.bind(this)}/>
                    :
                    <Zipcode
                        key="0"
                        updateViewIndex={this.props.updateViewIndex.bind(this)}/>
                }
            </div>
        );
    }
}