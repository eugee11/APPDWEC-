const app = require('../src/app');
const { connectDB } = require('../src/config/db');
const Boot = require('../src/models/Boot');
const bootsData = require('../src/seed/bootsData');

let seeded = false;

module.exports = async (req, res) => {
  try {
    await connectDB();

    if (!seeded) {
      const count = await Boot.countDocuments();
      if (count === 0) {
        await Boot.insertMany(bootsData);
      }
      seeded = true;
    }

    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al inicializar la API',
      details: error.message
    });
  }
};