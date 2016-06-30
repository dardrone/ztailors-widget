import React, { Component } from 'react';
import ExpertiseService from '../../../services/ZApi/Expertise';
import User from '../../../services/ZApi/User';
import classNames from 'classnames';

export default class Expertise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expertise: [
                {name: 'Loading...', active: false}
            ],
            loading: true,
            expertiseAttempts: 0
        };
    }

    componentDidMount() {
        this.getExpertise();

    }

    getExpertise(){
        let attempts = 2;
        ExpertiseService.getExpertise(this.props.zipcode).then(success => {
            let data = success.data.items;
            let expertiseItems = [];
            for (let i = 0; i < data.length; ++i) {
                expertiseItems.push({name: data[i].name, active: false});
            }
            this.setState({loading: false, expertise: expertiseItems});
        }, error => {
            this.setState({loading: false});
            if (error.status == 401) {
                if (this.state.expertiseAttempts < attempts) {
                    User.clearLocalUserToken();
                    this.setState({expertiseAttempts: this.state.timeslotsAttempts + 1}, ()=> {
                        this.getExpertise();
                    });
                }
            }
        });
    }

    handleClickExpertise(e) {
        let expertise = e.target.attributes['data-expertise'].value;
        let index = e.target.attributes['data-index'].value;

        for (let key in this.state.expertise) {
            this.state.expertise[key].active = key === index;
        }

        this.setState({
            expertise: this.state.expertise
        }, ()=> {
            this.props.handleUpdateExpertise(expertise);
        });
    }

    render() {
        let expertiseClasses = classNames(!this.state.loading ? '' : 'z-form-loading', this.state.expertise.length > 3 ? 'text-center' : '');
        return (
            <div className="appointment-form expertise">
                <h2>What Would You Like Tailored?</h2>
                <p className="error-msg hidden" id="msg_zipcode_error">{this.state.error}</p>
                <section className="garments">
                    <h3>Select Garment Types Below</h3>
                    <div id="cont_div_expertise" className={expertiseClasses}>
                        {this.state.expertise.map(function (object, key) {
                            return (<button key={object.name}
                                            data-index={key}
                                            type="button"
                                            disabled={this.state.loading}
                                            className={object.active ? 'active btn-expertise jcf-ignore' : 'btn-expertise jcf-ignore'}
                                            data-expertise={object.name}
                                            onClick={this.handleClickExpertise.bind(this)}>
                                    {object.name}
                                </button>
                            )
                        }, this)}
                    </div>
                </section>
            </div>
        );
    }
}