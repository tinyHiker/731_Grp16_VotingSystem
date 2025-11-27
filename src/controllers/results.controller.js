const ResultsService = require('../services/results.service');

async function viewResults(req, res) {
  try {
    const data = await ResultsService.getCurrentResults();

    if (!data) {
      return res.status(404).json({ error: 'No open election found' });
    }

    res.json(data);
  } catch (err) {
    console.error('View results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  viewResults,
};
