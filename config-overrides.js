const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  return {
    ...config,
    allowedHosts: ['localhost', '.example.com'],
  };
};

module.exports = {
  webpack: override(),
  devServer: overrideDevServer(devServerConfig()),
};

