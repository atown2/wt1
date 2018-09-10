import $ from 'jquery';
import Foundation from 'foundation-sites';

Foundation.addToJquery($);
global.$ = require('jquery');

const COMMON = { onReady() {} };
$(document).foundation().ready(COMMON.onReady);
