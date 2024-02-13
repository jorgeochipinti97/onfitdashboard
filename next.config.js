const path = require('path');

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './');
    // Si quieres que '@' referencie directamente a la carpeta 'components',
    // puedes ajustar la línea anterior para que sea:
    // config.resolve.alias['@'] = path.resolve(__dirname, 'components');

    return config;
  },
}

module.exports = nextConfig;
