const ResultsService = require('../services/results.service');

class ResultsController {
  constructor(resultsService = ResultsService) {
    this.resultsService = resultsService;
    this.viewResults = this.viewResults.bind(this);
  }

 
  buildResultsResponse(data) {
    if (!data) return null;
    return data;
  }

  handleNoOpenElection(res) {
    return res.status(404).json({ error: 'No open election found' });
  }

  
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


const resultsController = new ResultsController();
module.exports = resultsController;
module.exports.ResultsController = ResultsController;
