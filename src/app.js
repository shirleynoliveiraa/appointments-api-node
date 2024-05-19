const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Carrega o arquivo swagger.json
//const YAML = require('yamljs');

const app = express();

// Middleware
app.use(bodyParser.json());

// Database Config
const db = require('./config/database');
mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
const professionals = require('./routes/professionals');
const appointments = require('./routes/appointments');

app.use('/api/professionals', professionals);
app.use('/api/appointments', appointments);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Passa o objeto Swagger


// Server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
