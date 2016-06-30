require('../assets/sass/style.scss');
require('font-awesome-webpack!../assets/config/font-awesome.config.js');
require('font-awesome-webpack');

import React from 'react'
import { render } from 'react-dom'
import 'babel-polyfill';
import HomeApp from './components/home/Home'
import Startup from './utils/Startup'

let s = new Startup();
render(<HomeApp />, document.getElementById('zWidget'));