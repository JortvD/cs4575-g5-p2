'use strict';

module.exports = {
  meta: {
    name: "sustainable-eslint-plugin"
  },
  rules: {
    'energy-hotspot': require('./src/rules/energy-hotspot'),
    'no-multiple-imgs': require('./src/rules/no-multiple-imgs'),
    'test': require('./src/rules/test'),
    'document-fragment': require('./src/rules/document-fragment'),
    'intersection-observer': require('./src/rules/intersection-observer'),
    'repeated-expensive-identifiers': require('./src/rules/repeated-expensive-identifiers'),
  }
};
