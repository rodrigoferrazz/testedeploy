const db = require('../config/db');

// GET /guardians/:guardianId/pi
const getGuardianById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM guardians WHERE id = $1', [req.params.guardianId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Guardian not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// POST /guardians
const createGuardian = async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await db.query(
      'INSERT INTO guardians (name, email) VALUES ($1, $2) RETURNING id, name, email',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// PUT /guardians/:id
const updateGuardian = async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await db.query(
      'UPDATE guardians SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
      [name, email, req.params.id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Guardian not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

// DELETE /guardians/:id
const deleteGuardian = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM guardians WHERE id = $1', [req.params.id]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Responsável deletado' });
    } else {
      res.status(404).json({ error: 'Responsável não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};

module.exports = {
  getGuardianById,
  createGuardian,
  updateGuardian,
  deleteGuardian
};