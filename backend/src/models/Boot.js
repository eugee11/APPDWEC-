const mongoose = require('mongoose');

const validSurfaces = ['FG', 'AG', 'TF', 'IC'];

const bootSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    brand: {
      type: String,
      required: [true, 'La marca es obligatoria'],
      trim: true
    },
    color: {
      type: String,
      required: [true, 'El color es obligatorio'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      minlength: [10, 'La descripción debe tener al menos 10 caracteres']
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [30, 'El precio mínimo permitido es 30€'],
      max: [500, 'El precio máximo permitido es 500€']
    },
    releaseDate: {
      type: Date,
      required: [true, 'La fecha de lanzamiento es obligatoria']
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo']
    },
    size: {
      type: Number,
      required: [true, 'La talla es obligatoria'],
      min: [36, 'La talla mínima es 36'],
      max: [47, 'La talla máxima es 47']
    },
    surface: {
      type: String,
      enum: {
        values: validSurfaces,
        message: 'Superficie inválida. Valores permitidos: FG, AG, TF, IC'
      },
      required: [true, 'La superficie es obligatoria']
    }
  },
  {
    timestamps: true
  }
);

bootSchema.index({ name: 1, brand: 1, size: 1, color: 1 }, { unique: true });

module.exports = mongoose.model('Boot', bootSchema);
