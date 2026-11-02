const yaml = require('yamljs');

const loadSwagger = () => {
    try {
        return yaml.load('./swagger.yaml');
    } catch (error) {
        console.error('Failed to load swagger.yaml:', error);
        return null;
    }
};

module.exports = loadSwagger;
