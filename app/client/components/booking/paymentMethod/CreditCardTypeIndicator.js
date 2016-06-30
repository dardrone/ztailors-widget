import React, { Component } from 'react';
import { isNull } from '../../../utils/Common';


export default class CreditCardTypeIndicator extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="credit-card-icon-container clearfix">
                <div className={'credit-card-icon credit-card-icon-american-express ' +
                    (this.props.cardType === 'american-express' || isNull(this.props.cardType) ? 'active' : '')}></div>
                <div className={'credit-card-icon credit-card-icon-visa ' +
                    (this.props.cardType === 'visa' || isNull(this.props.cardType) ? 'active' : '')}></div>
                <div className={'credit-card-icon credit-card-icon-master-card ' +
                    (this.props.cardType === 'master-card' || isNull(this.props.cardType) ? 'active' : '')}></div>
                <div className={'credit-card-icon credit-card-icon-discover ' +
                    (this.props.cardType === 'discover' || isNull(this.props.cardType) ? 'active' : '')}></div>
            </div>
        );
    }
}