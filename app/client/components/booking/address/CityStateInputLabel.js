import React, { Component } from 'react';
import { isNull } from '../../../utils/Common';
import AddressChangeZipcode from './AddressChangeZipcode';


export default class CityStateInputLabel extends Component {

    constructor(props) {
        super(props);
    }

    handleChangeCity(e) {
        let cityStateLabel = e.target.value.split(',');
        let city = cityStateLabel[0];
        let state = cityStateLabel[1];
        let state_abbreviation = cityStateLabel[2];
        this.props.handleCityChange(city, state, state_abbreviation);
    }

    onClickAddNewAddress(show){
        this.props.onClickAddNewAddress(show);
    }

    render() {
        let city = this.props.cityStates.length === 0 ? null : this.props.cityStates[0].city;
        let state = this.props.cityStates.length === 0 ? null : this.props.cityStates[0].state;
        let zipcode = this.props.zipcode;
        let showCityState = !isNull(city);
        let cityStateInput = null;

        if (this.props.cityStates.length > 1) {
            cityStateInput =
                <div>
                    <select id="bf_details_address"
                            onChange={this.handleChangeCity.bind(this)}>
                        {this.props.cityStates.map(function (object, key) {
                            return (<option key={key} className=""
                                            value={object.city + ',' + object.state + ',' + object.state_abbreviation}>
                                    {object.city}, {object.state}
                                </option>
                            )
                        })}
                    </select>
                    <div id="city-state-zip" className="row state-info">
                        {state}
                        <span>
                            {zipcode}
                        </span>
                        <AddressChangeZipcode updateViewIndex={this.props.updateViewIndex}/>
                    </div>
                </div>
        } else {
            cityStateInput =
                <div id="city-state-zip" className="row state-info">
                    {city}, {state} <span>{zipcode}</span><AddressChangeZipcode updateViewIndex={this.props.updateViewIndex}/>
                    <div className="text-right" style={{float:'right', display: this.props.hasExistingAddress ? 'inherit' : 'none'}}>
                        <div className="text-right">
                        <button className="btn btn-default" type="button" id="add-address"
                                onClick={this.onClickAddNewAddress.bind(this, false)}
                                disabled={this.props.disabled}>Use existing
                        </button>
                    </div>
                    </div>
                </div>
        }

        return (
            <div>
                {showCityState ?
                    cityStateInput
                    :
                    <span className="z-loading-title"
                          style={{display: !showCityState ? 'inherit' : 'none'}}>
                        <div id="city-state-zip" className="row state-info loading">
                            <span style={{margin: '0 0 0 20px'}}>
                                Loading...
                            </span>
                        </div>
                    </span>
                }
            </div>
        );
    }
}

