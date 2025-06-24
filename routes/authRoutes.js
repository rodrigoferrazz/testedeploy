// routes/authRoutes.js
const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/login', (req, res) =>
  res.render('login/index', { error: null })
)
router.post('/login', authController.login)

router.get(
  '/guardians/:guardianId/change-password',
  authController.renderChangePassword
)
router.post(
  '/guardians/:guardianId/change-password',
  authController.handleChangePassword
)

module.exports = router
