'use strict';

module.exports = {
  meta: {
    name: "sustainable-eslint-plugin"
  },
  rules: {
    'energy-hotspot': require('./src/rules/energy-hotspot'),
    'no-multiple-imgs': require('./src/rules/no-multiple-imgs'),
    'test': require('./src/rules/test'),
    'propose-document-fragment': require('./src/rules/propose-document-fragment'),
  }
};
