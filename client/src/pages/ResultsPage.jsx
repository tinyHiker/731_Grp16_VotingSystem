import React from 'react';
import api from '../api';

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      election: null,
      results: [],
      error: '',
    };

    this.fetchResults = this.fetchResults.bind(this);
  }

  componentDidMount() {
    this.fetchResults();
  }

  // 🧪 Testable method: loads results from the API
  async fetchResults() {
    try {
      this.setState({ loading: true });

      const res = await api.get('/api/results/current');

      // 👇 log fetched results to the console
      console.log('Results fetched from /api/results/current:', res.data);

      this.setState({
        election: res.data.election,
        results: res.data.results,
        error: '',
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Failed to load results';
      this.setState({ error: msg });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading, election, results, error } = this.state;

    if (loading) {
      return <div>Loading results...</div>;
    }

    if (error && !election) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '1rem auto',
          padding: '1.5rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {election ? (
          <>
            <h2 style={{ marginBottom: '0.25rem' }}>Current Results</h2>
            <p style={{ marginBottom: '1rem', color: '#555' }}>{election.name}</p>

            {error && (
              <div
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '4px',
                  background: '#fee2e2',
                  color: '#b91c1c',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e5e7eb' }}>
                  <th style={thStyle}>Candidate</th>
                  <th style={thStyle}>Party</th>
                  <th style={thStyle}>Votes</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.candidateId}>
                    <td style={tdStyle}>{r.name}</td>
                    <td style={tdStyle}>{r.party || '-'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{r.votes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div>No open election found.</div>
        )}
      </div>
    );
  }
}

const thStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #d1d5db',
  textAlign: 'left',
  color: '#111827', // force dark text
  fontWeight: 'bold',
};

const tdStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #e5e7eb',
  color: '#111827', // force dark text
};

export default ResultsPage;
