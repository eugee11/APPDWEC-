const express = require('express');
const { getDocumentation } = require('../controllers/documentationController');

const router = express.Router();

router.get('/', getDocumentation);

module.exports = router;
