const ResultsService = require('../services/results.service');

class ResultsController {
  constructor(resultsService = ResultsService) {
    this.resultsService = resultsService;

    // Bind methods used as route handlers
    this.viewResults = this.viewResults.bind(this);
  }

  /**
   * ✅ Pure helper: normalize the results data.
   *    Great for unit tests: input -> output.
   *    For now it just returns the data or null, but you could
   *    shape/validate it here if you want.
   */
  buildResultsResponse(data) {
    if (!data) return null;
    return data;
  }

  /**
   * ✅ Helper: standard "no open election" response.
   *    Easy to assert with a mocked res.
   */
  handleNoOpenElection(res) {
    return res.status(404).json({ error: 'No open election found' });
  }

  /**
   * Express route handler: GET /api/results/current
   *
   * Matches your original behavior:
   *  - calls ResultsService.getCurrentResults()
   *  - 404 if no data
   *  - 200 + JSON data on success
   *  - 500 on unexpected error
   */
  async viewResults(req, res) {
    try {
      const data = await this.resultsService.getCurrentResults();

      if (!data) {
        return this.handleNoOpenElection(res);
      }

      const responseBody = this.buildResultsResponse(data);
      return res.json(responseBody);
    } catch (err) {
      console.error('View results error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Default instance for the app
const resultsController = new ResultsController();

// Export instance (for routes) and class (for unit tests)
module.exports = resultsController;
module.exports.ResultsController = ResultsController;
