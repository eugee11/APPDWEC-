const express = require('express');
const {
  getAllBoots,
  getBootById,
  createBoot,
  updateBoot,
  deleteBoot
} = require('../controllers/bootController');

const router = express.Router();

router.get('/get/all', getAllBoots);
router.get('/get/:id', getBootById);
router.post('/post', createBoot);
router.put('/update/:id', updateBoot);
router.patch('/update/:id', updateBoot);
router.delete('/delete/:id', deleteBoot);

module.exports = router;
