import React, { Component } from 'react';
import $script from 'scriptjs';

export default class Pixels extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let self = this;
        /* <![CDATA[ */
        let google_conversion_id = 965438425,
            google_conversion_language = 'en',
            google_conversion_format = '2',
            google_conversion_color = 'ffffff',
            google_conversion_label = 'tmyGCPimiVYQ2detzAM',
            google_remarketing_only = false;
        /* ]]> */
        $script('//www.googleadservices.com/pagead/conversion_async.js', function () {
            /*BEGIN: Marin Software Tracking Script (Complete Page)*/
            let m_Track = [];
            m_Track.push(['addTrans', {
                currency: 'USD',
                items: [{
                    orderId: self.props.id,
                    convType: 'custbook',
                    price: 0
                }]
            }]);
            m_Track.push(['processOrders']);
            (function () {
                var mClientId = '518wgf49532';
                var mProto = (('https:' == document.location.protocol) ? 'https://' : 'http://');
                var mHost = 'tracker.marinsm.com';
                var mt = document.createElement('script');
                mt.type = 'text/javascript';
                mt.async = true;
                mt.src = mProto + mHost + '/tracker/async/' + mClientId + '.js';
                var fscr = document.getElementsByTagName('script')[0];
                fscr.parentNode.insertBefore(mt, fscr);
            })();
            /*END: Copyright Marin Software*/
        });
    }

    render() {
        return (
            <div style={{display:'inline'}}>
                <img width="1" height="1" src="https://tracker.marinsm.com/tp?act=2&cid=518wgf49532&script=no"/>
                <img height="1" width="1" border="0"
                     src="https://s.amazon-adsystem.com/iui3?d=forester-did&ex-fargs=%3Fid%3D97b88fcb-3e4f-e49a-23a3-137633ae6245%26type%3D30%26m%3D1&ex-fch=416613&ex-src=https://www.ztailors.com/&ex-hargs=v%3D1.0%3Bc%3D9473635581950%3Bp%3D97B88FCB-3E4F-E49A-23A3-137633AE6245"/>
                <div style={{display:'inline'}}>
                    <img height="1" width="1" style={{borderStyle:'none'}}
                         src="//www.googleadservices.com/pagead/conversion/965438425/?label=tmyGCPimiVYQ2detzAM&guid=ON&script=0"/>
                </div>
            </div>
        );
    }
}




