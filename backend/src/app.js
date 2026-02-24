const express = require('express');
const cors = require('cors');
const bootRoutes = require('./routes/bootRoutes');
const documentationRoutes = require('./routes/documentationRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    message: 'API REST Tienda de Botas de Fútbol',
    version: 'v1'
  });
});

app.use('/api/v1/documentation', documentationRoutes);
app.use('/api/v1/boots', bootRoutes);

app.use(errorHandler);

module.exports = app;
