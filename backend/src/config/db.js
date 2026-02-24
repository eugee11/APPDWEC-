const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer;
let connectPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectPromise) {
    await connectPromise;
    return;
  }

  connectPromise = (async () => {
    const uri = process.env.MONGODB_URI;

    if (uri) {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
        console.log('Conexión a MongoDB establecida correctamente');
        return;
      } catch (error) {
        throw new Error(`No se pudo conectar a MongoDB. Revisa MONGODB_URI y Atlas Network Access. Detalle: ${error.message}`);
      }
    }

    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('Conexión a MongoDB en memoria establecida correctamente');
  })();

  try {
    await connectPromise;
  } finally {
    connectPromise = undefined;
  }
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
