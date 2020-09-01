const Ginger = require('../../core/ginger.js');
const ginger = new Ginger(true);

let outputOptions = {
  hostname: 'localhost',
  port: 8123,
  method: 'POST'
}
outputOptions.headers = require('./tokens.js')();

let watch = '/home/arctos/ftp/files/staurois';

let tunnel = ginger.createMyLogLogOutputTunnel('amnirana-motion-detection');
let outputTunnels = [ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/services/counter/increment'}, outputOptions),
  (data) => {
    return JSON.stringify({"entity_id": "counter.amnirana_motion_detector"});
  }/*, undefined, undefined, tunnel*/)];

outputTunnels.push(ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_boolean.amnirana_motion_detector'}, outputOptions),
  (data) => {
    return JSON.stringify({state: 'on'});
}/*, undefined, undefined, tunnel*/));

function trickMood(evt, name) {
  if (evt != 'update') //filter
    throw 'skip'
  return; //data doesn't matter
}

ginger.createFilewatchTrick(watch, outputTunnels, trickMood, true, tunnel);
