const mongoose = require('mongoose');
const Boot = require('../models/Boot');

const buildFilters = (query) => {
  const filters = {};

  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }

  if (query.surface) {
    filters.surface = query.surface;
  }

  if (query.inStock === 'true' || query.inStock === 'false') {
    filters.inStock = query.inStock === 'true';
  }

  return filters;
};

const validateBusinessRules = (payload) => {
  if (payload.stock !== undefined && payload.stock === 0) {
    payload.inStock = false;
  }

  if (payload.inStock === false && payload.stock > 0) {
    const error = new Error('Si inStock es false, el stock debe ser 0');
    error.statusCode = 400;
    throw error;
  }

  if (payload.releaseDate && new Date(payload.releaseDate) > new Date()) {
    const error = new Error('La fecha de lanzamiento no puede estar en el futuro');
    error.statusCode = 400;
    throw error;
  }
};

const getAllBoots = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 20);
    const skip = (page - 1) * limit;
    const filters = buildFilters(req.query);

    const [items, total] = await Promise.all([
      Boot.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Boot.countDocuments(filters)
    ]);

    res.status(200).json({
      ok: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: items
    });
  } catch (error) {
    next(error);
  }
};

const getBootById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: 'ID inválido' });
    }

    const boot = await Boot.findById(id);

    if (!boot) {
      return res.status(404).json({ ok: false, message: 'Bota no encontrada' });
    }

    res.status(200).json({ ok: true, data: boot });
  } catch (error) {
    next(error);
  }
};

const createBoot = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    validateBusinessRules(payload);

    const boot = await Boot.create(payload);
    res.status(201).json({ ok: true, message: 'Bota creada correctamente', data: boot });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ ok: false, message: 'No se permiten botas duplicadas (nombre + marca + talla + color)' });
    }
    next(error);
  }
};

const updateBoot = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: 'ID inválido' });
    }

    const existing = await Boot.findById(id);
    if (!existing) {
      return res.status(404).json({ ok: false, message: 'Bota no encontrada' });
    }

    const payload = { ...req.body };
    const merged = {
      ...existing.toObject(),
      ...payload
    };

    validateBusinessRules(merged);

    const updatedBoot = await Boot.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ ok: true, message: 'Bota actualizada correctamente', data: updatedBoot });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ ok: false, message: 'No se permiten botas duplicadas (nombre + marca + talla + color)' });
    }
    next(error);
  }
};

const deleteBoot = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ ok: false, message: 'ID inválido' });
    }

    const deletedBoot = await Boot.findByIdAndDelete(id);

    if (!deletedBoot) {
      return res.status(404).json({ ok: false, message: 'Bota no encontrada' });
    }

    res.status(200).json({ ok: true, message: 'Bota eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBoots,
  getBootById,
  createBoot,
  updateBoot,
  deleteBoot
};
