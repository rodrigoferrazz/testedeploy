// services/guardianService.js
const db = require('../config/db');

/**
 * Busca um guardian pelo e-mail e senha.
 * Retorna `null` se não encontrar.
 */
const getGuardianByEmailAndPassword = async (email, pwd) => {
  const result = await db.query(
    `SELECT 
       id, 
       email_guardians, 
       password_guardians, 
       change_password 
     FROM guardians 
     WHERE email_guardians = $1 
       AND password_guardians = $2`,
    [email, pwd]
  );

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
};

/**
 * Atualiza a senha e desativa a flag change_password.
 * Lança se não encontrar o registro.
 */
const updateGuardianPassword = async (id, newPassword) => {
  const result = await db.query(
    `UPDATE guardians
       SET password_guardians = $1,
           change_password    = FALSE
     WHERE id = $2
     RETURNING id, email_guardians, change_password`,
    [newPassword, id]
  );

  if (result.rows.length === 0) {
    throw new Error('Guardian not found');
  }
  return result.rows[0];
};

module.exports = {
  getGuardianByEmailAndPassword,
  updateGuardianPassword
};
