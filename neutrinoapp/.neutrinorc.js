const standard = require('@neutrinojs/standardjs');
const react = require('@neutrinojs/react');
const mocha = require('@neutrinojs/mocha');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    standard(),
    react({
      html: {
        title: 'OHOS'
      }
    }),
    mocha(),
  ],
};
