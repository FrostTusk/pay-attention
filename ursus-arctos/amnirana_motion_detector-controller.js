module.exports = function (ginger, tokenHA) {
  // const tokenHA = require('./hidden/tokens-lutra.js')();
  // const ginger = require('@frosttusk/ginger')(true);
  //const ginger = require('../G.I.N.G.E.R./core/ginger.js')(true);
  let logTunnel = ginger.createMyLogLogOutputTunnel('amnirana-motion-detection');

  let httpOutputOptions = {
    hostname: '192.168.1.105',
    port: 8123,
    method: 'POST',
    headers: {
  	"Authorization": tokenHA,
  	"content-type": "application/json"
    }
  }

  let outputTunnels = [ginger.createHTTPOutputTunnel(
    Object.assign({path: '/api/services/counter/increment'}, httpOutputOptions),
    (data) => {
      return JSON.stringify({"entity_id": "counter.amnirana_motion_detector"});
    }/*, undefined, undefined, logTunnel*/)];

  outputTunnels.push(ginger.createHTTPOutputTunnel(
    Object.assign({path: '/api/states/input_boolean.amnirana_motion_detector'}, httpOutputOptions),
    (data) => {
      return JSON.stringify({state: 'on'});
  }/*, undefined, undefined, logTunnel*/));

  /**
  const tokenssmtp = require('./hidden/tokens-smtp.js')();
  let options = {
    host: "smtp.zoho.eu",
    port:  465,
    secure: true, // use SSL
    auth: tokenssmtp
  }

  outputTunnels.push(ginger.createSMTPOutputTunnel(
    options, undefined, undefined, undefined, undefined,
    '"Fred Foo 👻" <admin@hub.industries>', 'frosttusk@gmail.com', 'motion detected on amnirana'));
  */

  let watch = '/home/arctos/ftp/files/amnirana';

  // function trickMood(evt, name) {
  //   if (evt != 'update') //filter
  //     throw 'skip'
  //   return; //data doesn't matter
  // }

  ginger.createFilewatchTrick(watch, outputTunnels,
    (evt, name) => {
      if (evt != 'update') //filter
        throw 'skip'
      return; //data doesn't matter
    }, true, logTunnel);
}
