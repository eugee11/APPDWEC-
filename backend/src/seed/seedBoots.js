require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Boot = require('../models/Boot');
const seedData = require('./bootsData');

const seed = async () => {
  try {
    await connectDB();
    await Boot.deleteMany({});
    await Boot.insertMany(seedData);
    console.log('Base de datos poblada con éxito');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

seed();