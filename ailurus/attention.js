const ginger = require('@frosttusk/ginger')(true);

const tokenHA = require('../hidden/tokens-lutra.js')();
const tarichaController =
  require('./taricha-controller.js')(ginger, tokenHA);
