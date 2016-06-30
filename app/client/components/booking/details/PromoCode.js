import MaskedInput from 'react-maskedinput';
import React, { Component } from 'react';
import { isNull } from '../../../utils/Common';
import PromoCodeService from '../../../services/ZApi/PromoCode';
import ZError from '../../shared/ZError';


export default class PromoCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promoCode: this.props.promoCode,
            promoCodeError: { message: null },
            show: false
        };
    }

    handlePromoCodeChange(e) {
        let changes = {
            promoCode: e.target.value
        };

        if (!isNull(this.state.promoCodeError.message)) {
            changes.promoCodeError = {message: null};
        }

        this.setState(changes, () => {
            this.updateDetailsPromoCode();
        });
    }

    handleGotPromoCodeClick(e) {
        this.setState({
            show: true
        });
    }

    updateDetailsPromoCode() {
        this.props.updatePromoCode(this.state.promoCode);
    }

    isValid() {
        let p;

        if (isNull(this.props.customer.id)) {
            p = PromoCodeService.validate(this.state.promoCode);
        } else {
            p = PromoCodeService.validate(this.state.promoCode, this.props.customer.id);
        }


        p.catch(() => {
            this.setState({
                promoCodeError: { message: 'Promo Code is not valid' }
            })
        });

        return p;
    }

    render() {
        return (
            <fieldset className="text-left">
                <div className="row promo-code-container">
                    <button type="button"
                            className={'btn btn-link btn-promo-code jcf-ignore ' +
                                (this.state.show || !isNull(this.props.promoCode)? 'hidden' : '')}
                            onClick={this.handleGotPromoCodeClick.bind(this)}
                            disabled={this.props.disabled}>Got Promo Code?</button>
                    <div className={this.state.show || !isNull(this.props.promoCode)? '' : 'hidden'}>
                        <input
                            type="text"
                            value={this.state.promoCode}
                            onChange={this.handlePromoCodeChange.bind(this)}
                            placeholder="Promo Code"
                            disabled={this.props.disabled}/>
                        <ZError error={this.state.promoCodeError} />
                    </div>
                </div>
            </fieldset>
        )
    }
}