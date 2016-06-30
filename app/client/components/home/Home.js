import React, { Component } from 'react';
import StartHome from '../booking/start/StartHome';
import Startup from '../../utils/Startup';
import { isEmpty, isDefined, isNull } from '../../utils/Common';
import Footer from '../shared/Footer';
import ZBackButton from '../shared/ZBackButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import imgLogo from '../../../assets/img/logo.svg';

export default class HomeApp extends Component {
    constructor(props) {
        super(props);

        let startingComponent = <StartHome key="0"
                                           updateViewIndex={this.updateViewIndex.bind(this)}/>;
        this.state = {
            currentView: startingComponent,
            prevView: null
        }
    }

    goToPrevView() {
        let prevView = this.state.prevView;
        this.setState({
            currentView: prevView,
            prevView: null
        });
    }

    updateViewIndex(component, rememberCurrent = true) {
        let currentView = rememberCurrent ? this.state.currentView : null;
        this.setState({
            prevView: currentView,
            currentView: component
        }, ()=> {
            // We choose to not show Garments route here because we want google analytics page views for
            // "/Garments" to signal that a user has landed on the widget and not navigated back.
            if (isDefined(ga) && this.state.currentView.type.displayName.toLowerCase() != 'garments') {
                ga('send', 'pageview', this.state.currentView.type.displayName.toLowerCase());
            }
        });
    }

    initGoogleAnalytics() {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', GOOGLE_ANALYTICS_CODE, 'auto');
        ga('send', 'pageview');
    }

    componentDidMount() {
        this.initGoogleAnalytics();
        if (isDefined(ga)) {
            ga('send', 'pageview', 'Garments');
        }
    }

    render() {
        let url = `${ZTAILORS_URL}zipcode`;
        return (
            <div id="z-widget-wrapper" className="booking-flow">
                <div className="lightbox yellow">
                    <header className="lightbox-head">
                        <div className="logo">
                            <a href={url}
                               target=""
                               className="lightbox-head-logo">
                                <img src={imgLogo} height="22" width="130" alt="ZTailors"/>
                            </a>
                        </div>
                        <div className="zback-button-container">
                            { (this.state.prevView) ?
                                <ZBackButton goToPrevView={this.goToPrevView.bind(this)}/>
                                : ''
                            }
                        </div>
                    </header>

                    <div className="lightbox-main text confirmation-block">
                        <ReactCSSTransitionGroup transitionName="view"
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={500}>
                            { this.state.currentView }
                        </ReactCSSTransitionGroup>
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
}
