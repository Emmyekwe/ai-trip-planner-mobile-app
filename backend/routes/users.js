var express = require('express');
var router = express.Router();
const pool = require('../db');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM users'); // Assumes a 'users' table exists
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
