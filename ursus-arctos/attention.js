const ginger = require('@frosttusk/ginger')(true);

const tokenHA = require('../hidden/tokens-lutra.js')();
const amniranaMotionDetectorController =
  require('./amnirana-motion-dection-controller.js')(ginger, tokenHA);
