"use strict";
const namingPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
module.exports = {
 extends: "stylelint-config-recommended-scss",
 plugins: ["stylelint-no-unsupported-browser-features"],
 rules: {
  "block-no-empty": null,
  "unit-no-unknown": [ true, {"ignoreUnits": [ "Hz", "kHz" ]}],
  "no-descending-specificity": [ true, {"severity": "warning"}]
 }
}
