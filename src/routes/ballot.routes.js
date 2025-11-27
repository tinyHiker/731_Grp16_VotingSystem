const express = require('express');
const BallotController = require('../controllers/ballot.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/ballot/current
router.get('/current', authMiddleware, BallotController.getBallot);

module.exports = router;
