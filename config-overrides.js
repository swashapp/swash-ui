const {override} = require('customize-cra');

function customizeConf(config) {
  //config.node.global = false;
  //config.devtool = 'source-map';
  return config;
}

module.exports = {
  webpack: override(customizeConf),
};
