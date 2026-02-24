require('dotenv').config();
const app = require('./src/app');
const { connectDB, stopMemoryDB } = require('./src/config/db');
const Boot = require('./src/models/Boot');
const bootsData = require('./src/seed/bootsData');

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  const existing = await Boot.countDocuments();
  if (existing === 0) {
    await Boot.insertMany(bootsData);
    console.log('Datos iniciales cargados en la base de datos');
  }

  app.listen(PORT, () => {
    console.log(`API de botas de fútbol ejecutándose en http://localhost:${PORT}`);
  });
};

process.on('SIGINT', async () => {
  await stopMemoryDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopMemoryDB();
  process.exit(0);
});

startServer();
