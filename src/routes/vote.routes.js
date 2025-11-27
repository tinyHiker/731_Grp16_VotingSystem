const express = require('express');
const VoteController = require('../controllers/vote.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/vote
router.post('/', authMiddleware, VoteController.submitVote);

module.exports = router;
