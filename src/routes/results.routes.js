const express = require('express');
const ResultsController = require('../controllers/results.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/results/current
router.get('/current', authMiddleware, ResultsController.viewResults);

module.exports = router;
