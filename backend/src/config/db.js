const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log('Conexión a MongoDB establecida correctamente');
      return;
    } catch (error) {
      console.warn('No se pudo conectar al MongoDB configurado. Se usará MongoDB en memoria.');
    }
  }

  mongoMemoryServer = await MongoMemoryServer.create();
  const memoryUri = mongoMemoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log('Conexión a MongoDB en memoria establecida correctamente');
};

const stopMemoryDB = async () => {
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = {
  connectDB,
  stopMemoryDB
};
