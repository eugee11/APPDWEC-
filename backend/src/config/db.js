const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer;
let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
      console.log('Conexión a MongoDB establecida correctamente');
      isConnecting = false;
      return;
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        isConnecting = false;
        throw new Error('No se pudo conectar a MongoDB en producción. Revisa MONGODB_URI.');
      }

      console.warn('No se pudo conectar al MongoDB configurado. Se usará MongoDB en memoria.');
    }
  }

  mongoMemoryServer = await MongoMemoryServer.create();
  const memoryUri = mongoMemoryServer.getUri();
  await mongoose.connect(memoryUri);
  console.log('Conexión a MongoDB en memoria establecida correctamente');
  isConnecting = false;
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
