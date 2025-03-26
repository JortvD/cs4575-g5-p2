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
    'lazy-elements': require('./src/rules/lazy-elements'),
    'avoid-gif-canvas': require('./src/rules/avoid-gif-canvas'),
    'avoid-image-resize': require('./src/rules/avoid-image-resize'),
    'prefer-standard-fonts': require('./src/rules/prefer-standard-fonts')
  }
};
