const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Load swagger.yaml
const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, './swagger.yaml'), 'utf8'));

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = setupSwagger;