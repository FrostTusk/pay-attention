//const ginger = require('@frosttusk/ginger')(true);
const ginger = require('../../G.I.N.G.E.R./core/ginger.js')(true);

const tokensSMTP = require('../hidden/tokens-smtp.js')();
const recaptchaSecret = require('../hidden/recaptcha.js')();
const websiteMailformReflector =
  require('./website_mailform-reflector.js')(ginger, tokensSMTP, recaptchaSecret);
