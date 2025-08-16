const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {getEmission, addEmission, updateEmission, deleteEmission,} = require('../controllers/emissionController');

router.use(protect);
router.get('/', getEmission);
router.post('/', addEmission);
router.put('/:id', updateEmission); 
router.delete('/:id', deleteEmission);

module.exports = router;