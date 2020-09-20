const tokenHA = require('./hidden/tokens-lutra.js')();
const tv_name = 'taricha';

const ginger = require('@frosttusk/ginger')(true);

let tunnel = ginger.createMyLogLogOutputTunnel('taricha-hdmi-cec');

let inputOptions = {
  hostname: '0.0.0.0',
  port: 7896,
  method: 'POST',
}

let logTunnel = ginger.createMyLogLogOutputTunnel('HDMI-CEC Trick Input');

let express = require('express');

let onInputTunnel = ginger.createHTTPInputTunnel(
  Object.assign({path: '/' + tv_name + '/on'}, inputOptions),
  undefined, undefined, undefined, undefined /*logTunnel*/,
  [express.json()]
);

let offInputTunnel = ginger.createHTTPInputTunnel(
  Object.assign({path: '/' + tv_name + '/off'}, inputOptions),
  undefined, undefined, undefined, undefined /*logTunnel*/,
  [express.json()]
);

let sourceInputTunnel = ginger.createHTTPInputTunnel(
  Object.assign({path: '/' + tv_name + '/source'}, inputOptions),
  (req, res) => {
    let source = req.body.new_source;
    if (typeof(source) === 'number' && source >= 0 && source <= 9)
      return source;
    throw "invalid source";
  }, undefined, undefined, undefined /*logTunnel*/, [express.json()]);


let outputOptions = {
  hostname: '192.168.222.222',
  port: 8123,
  method: 'POST',
  headers: {
    "Authorization": tokenHA,
    "content-type": "application/json"
  }
}

let onOutputTunnel = ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_boolean.' + tv_name}, outputOptions),
  (data) => {
    return JSON.stringify({state: 'on'});
  });

let offOutputTunnel = ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_boolean.' + tv_name}, outputOptions),
  (data) => {
    return JSON.stringify({state: 'off'});
});

let sourceOutputTunnel = ginger.createHTTPOutputTunnel(
  Object.assign({path: '/api/states/input_select.' + tv_name}, outputOptions),
  (data) => {
    return JSON.stringify({state: data});
});


ginger.createHDMICECTVTrick(tv_name,
  [onInputTunnel], [offInputTunnel], [sourceInputTunnel],
  [onOutputTunnel], [offOutputTunnel], [sourceOutputTunnel], tunnel);
