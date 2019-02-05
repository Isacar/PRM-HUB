// test-email.js
var Email = require('keystone-email');


new Email('test-email.hbs', {
  transport: 'mailgun',
  engine: 'html'
}).send({}, {
  apiKey: 'key-2cf4fa72267663f008dd4a21445fe1e2',
  domain: 'sandboxb44e2ef729984d07ae1f802dc2da8037.mailgun.org',
  to: 'iracine@copaair.com',
  //to: 'racine.isacar@gmail.com',
  //to: 'mtoso@copaair.com',

  from: {
    name: 'Isacar Racine Rodriguez',
    email: 'ace@gmail.com',
  },
  subject: 'Your first KeystoneJS email',
}, function (err, result) {
  if (err) {
    console.error('🤕 Mailgun test failed with error:\n', err);
  } else {
    console.log('📬 Successfully sent Mailgun test with result:\n', result);
  }
});

console.log(Email);
