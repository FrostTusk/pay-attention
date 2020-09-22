const ginger = require('@frosttusk/ginger')(true);

const tokensSMTP = require('../hidden/tokens-smtp.js')();
const websiteMailformReflector =
  require('./website_mailform-reflector.js')(ginger, tokensSMTP);
