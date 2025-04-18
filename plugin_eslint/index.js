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
    'avoid-canvas': require('./src/rules/avoid-canvas'),
    'avoid-image-resize': require('./src/rules/avoid-image-resize'),
    'prefer-standard-fonts': require('./src/rules/prefer-standard-fonts'),
    'respect-bf-cache': require('./src/rules/respect-bf-cache'),
    'multiple-console-log': require('./src/rules/multiple-console-log'),
    'request-animation-frame': require('./src/rules/request-animation-frame'),
    'avoid-autocomplete': require('./src/rules/avoid-autocomplete'),
    'check-link-preload': require('./src/rules/check-link-preload'),
  }
};
