const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((entry) => entry.message);
    return res.status(400).json({
      ok: false,
      message: 'Error de validación',
      details
    });
  }

  return res.status(statusCode).json({
    ok: false,
    message: error.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;
