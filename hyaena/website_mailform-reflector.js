const express = require('express');
const path = require('path');

module.exports = function (ginger, tokensSMTP, recaptchaSecret) {
  let logTunnel = ginger.createMyLogLogOutputTunnel('website_mailform_reflector');

  /**
   * Captcha verification.
   */

  let captchaOptions = {
    hostname: 'www.google.com',
    port: 443,
    method: 'POST',
    path: '/recaptcha/api/siteverify',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  }

  let captchaTunnel = ginger.createHTTPSOutputTunnel(captchaOptions,
    (data) => {
      return 'response=' + data.response + '&secret=' + data.secret;
    });


  /**
   * Mail output.
   */

  const mailOptions = {
    host: 'smtp.zoho.eu',
    port:  465,
    secure: true, // use SSL
    auth: tokensSMTP
  }

  let mailTunnel = ginger.createSMTPOutputTunnel(mailOptions, undefined, undefined, undefined, logTunnel,
    'admin@hub.industries');



  /**
   * HTTP server that serves the actual webpage.
   */

  const options = {
     hostname: '127.0.0.1',
     port: 7897,
   }

  let http_uses = [express.static(path.join('/var/www/me/react-resume-template/build'))];
  const bodyParser = require('body-parser');
  http_uses.push(bodyParser.urlencoded({ extended: false }));

  let htmlHTTPTunnel = ginger.createHTTPInputTunnel(Object.assign({method: 'GET', path: '*'}, options),
     (req, res) => {return res;}, undefined, undefined, undefined, http_uses);

  htmlHTTPTunnel.on((data) => {
     data.sendFile(path.resolve('/var/wwww/me/react-resume-template/build', 'index.html'));
  });


   /**
    * \/inc\/sendEmail endpoint, reflects the mail form to actual email after captcha verification.
    */

  let emailHTTPTunnel = ginger.createHTTPInputTunnel(Object.assign({method: 'POST', path: '/inc/sendEmail.php'}, options),
    (req, res) => {
      return req.body;
    }, undefined, undefined, logTunnel);

  emailHTTPTunnel.on((data) => {
    req = captchaTunnel.emit({secret: recaptchaSecret, response: data.token});
    req.on('response', (res) => {
      res.on("data", function(chunk) {
        if (!JSON.parse(chunk).success) return;

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
    });
  });
}
