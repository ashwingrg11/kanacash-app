const BETA_WIDGET_STYLE = 'https://beta.kanacash.com/kanacash-raas-style.css';
const BETA_BASE_URL = 'https://beta.kanacash.com/v1';

//dev
const DEV_WIDGET = 'https://sandbox.api.machpay.com/v2/widget/widget.js';
const DEV_WIDGET_STYLE = 'https://uat.kanacash.com/kanacash-raas-style.css';
const DEV_BASE_URL = 'https://uat.kanacash.com/v1';

// prod
// https://api.machpay.com/v2/widget/widget.js
const PROD_WIDGET = 'https://api.machpay.com/v2/widget/widget.js';
const PROD_BASE_URL = 'https://kanacash.com/v1/';
const PROD_WIDGET_STYLE = 'https://kanacash.com/kanacash-raas-style.css';

const WIDGET = __DEV__ ? DEV_WIDGET : PROD_WIDGET;
const BASE_URL = __DEV__ ? DEV_BASE_URL : PROD_BASE_URL;
const WIDGET_STYLE = __DEV__ ? DEV_WIDGET_STYLE : PROD_WIDGET_STYLE;

export {WIDGET, BASE_URL, WIDGET_STYLE};
