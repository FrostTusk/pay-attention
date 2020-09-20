const express = require('express');
const path = require("path");

const ginger = require('../G.I.N.G.E.R./core/ginger.js')(true);
let logTunnel = ginger.createMyLogLogOutputTunnel('Tester');

let http_uses = [express.static(path.join(__dirname, '../react-resume-template/build'))];
const bodyParser = require('body-parser');
http_uses.push(bodyParser.urlencoded({ extended: false }));

const options = {
  hostname: '0.0.0.0',
  port: 7895,
}

let htmlHTTPTunnel = ginger.createHTTPInputTunnel(Object.assign({method: 'GET', path: '*'}, options),
  (req, res) => {return res;}, undefined, undefined, logTunnel, http_uses);

htmlHTTPTunnel.on((data) => {
  data.sendFile(path.resolve(__dirname, '../react-resume-template/build', 'index.html'));
});

let emailHTTPTunnel = ginger.createHTTPInputTunnel(Object.assign({method: 'POST', path: '/inc/sendEmail.php'}, options),
  (req, res) => {
    return req.body;
  }, undefined, undefined, logTunnel);


const mailOptions = {
  host: 'smtp.zoho.eu',
  port:  465,
  secure: true, // use SSL
  auth: require('./hidden/tokens-smtp.js')()
}

let mailTunnel = ginger.createSMTPOutputTunnel(mailOptions, undefined, undefined, undefined, logTunnel,
  'admin@hub.industries');

emailHTTPTunnel.on((data) => {
  sendData = {
    from: data.contactName ,
    to: 'frosttusk@gmail.com',
    subject: data.contactSubject,
    data:
      data.contactEmail.replace(/(\r\n|\n|\r)/gm,' ') + '<br/>' +
      data.contactMessage.replace(/(\r\n|\n|\r)/gm,' ')
  }
  mailTunnel.emit(sendData);
});
