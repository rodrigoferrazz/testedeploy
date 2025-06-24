// controllers/authController.js

const db = require('../config/db')
const guardianService = require('../services/guardianService')

// POST /login
exports.login = async (req, res) => {
  const { email_guardians, password_guardians } = req.body

  // Early return para campos obrigatórios vazios
  if (!email_guardians || !password_guardians) {
    return res.render('login/index', {
      error: 'You’ve entered an incorrect email address or password.'
    });
  }

  try {
    const result = await db.query(
      `SELECT id, email_guardians, password_guardians, change_password
       FROM guardians
       WHERE email_guardians = $1
         AND password_guardians = $2`,
      [email_guardians, password_guardians]
    )

    if (result.rows.length === 0) {
      return res.render('login/index', {
        error: 'You’ve entered an incorrect email address or password.'
      })
    }

    const guardian = result.rows[0]

    if (guardian.change_password) {
      // first-time login → force password change
      return res.redirect(`/guardians/${guardian.id}/change-password`)
    }

    // normal flow
    res.redirect(`/students/guardians/${guardian.id}/students`)

  } catch (error) {
    console.error('Authentication error:', error)
    res.render('login/index', {
      error: 'An error occurred during authentication. Please try again.'
    })
  }
}

// GET /guardians/:guardianId/change-password
exports.renderChangePassword = (req, res) => {
  const { guardianId } = req.params
  res.render('auth/changePassword', {
    error: null,
    guardianId
  })
}

// POST /guardians/:guardianId/change-password
exports.handleChangePassword = async (req, res) => {
  const { guardianId } = req.params
  const { newPassword, confirmPassword } = req.body

  if (newPassword !== confirmPassword) {
    return res.render('auth/changePassword', {
      error: 'Passwords do not match.',
      guardianId
    })
  }

  try {
    await guardianService.updateGuardianPassword(guardianId, newPassword)
    // flag is set to false inside the service
    res.redirect(`/students/guardians/${guardianId}/students`)
  } catch (error) {
    console.error('Password update error:', error)
    res.render('auth/changePassword', {
      error: 'Failed to update password. Please try again.',
      guardianId
    })
  }
}
