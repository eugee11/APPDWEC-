const getDocumentation = (_req, res) => {
  res.status(200).json({
    ok: true,
    project: 'Tienda de Botas de Fútbol',
    endpoints: [
      { method: 'GET', path: '/api/v1/boots/get/all?page=1&limit=5&search=&surface=&inStock=' },
      { method: 'GET', path: '/api/v1/boots/get/:id' },
      { method: 'POST', path: '/api/v1/boots/post' },
      { method: 'PUT', path: '/api/v1/boots/update/:id' },
      { method: 'PATCH', path: '/api/v1/boots/update/:id' },
      { method: 'DELETE', path: '/api/v1/boots/delete/:id' }
    ]
  });
};

module.exports = { getDocumentation };
