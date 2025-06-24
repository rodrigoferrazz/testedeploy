const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const guardianController = require('../controllers/guardianController');

// Rota para renderizar a tela PI (view)
router.get('/guardians/:guardianId/pi', studentController.renderGuardianInfo);

// Rota para API REST (JSON)
router.get('/api/guardians/:guardianId/pi', guardianController.getGuardianById);

// POST /guardians
router.post('/', guardianController.createGuardian);

// PUT /guardians/:id
router.put('/:id', guardianController.updateGuardian);

// DELETE /guardians/:id
router.delete('/:id', guardianController.deleteGuardian);

module.exports = router;