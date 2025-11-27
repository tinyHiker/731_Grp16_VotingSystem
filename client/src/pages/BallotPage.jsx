import React from 'react';
import api from '../api';

class BallotPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      election: null,
      candidates: [],
      selectedCandidateId: '',
      error: '',
      successMsg: '',
      hasVoted: props.voter?.hasVoted ?? false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCandidateClick = this.handleCandidateClick.bind(this);
  }

  // Keep hasVoted in sync if the voter prop changes
  componentDidUpdate(prevProps) {
    if (prevProps.voter?.hasVoted !== this.props.voter?.hasVoted) {
      this.setState({ hasVoted: this.props.voter?.hasVoted ?? false });
    }
  }

  componentDidMount() {
    this.fetchBallot();
  }

  // 🔍 Method you can unit test: loads election + candidates
  async fetchBallot() {
    try {
      this.setState({ loading: true });
      const res = await api.get('/api/ballot/current');

      this.setState({
        election: res.data.election,
        candidates: res.data.candidates,
        error: '',
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Failed to load ballot';
      this.setState({ error: msg });
    } finally {
      this.setState({ loading: false });
    }
  }

  // ✅ Method you can unit test: submits vote, updates hasVoted + localStorage
  async handleSubmit(e) {
    e.preventDefault();
    const { selectedCandidateId, election, hasVoted } = this.state;

    if (!selectedCandidateId || !election || hasVoted) return;

    this.setState({ error: '', successMsg: '' });

    try {
      await api.post('/api/vote', {
        electionId: election._id,
        candidateIds: [selectedCandidateId],
      });

      this.setState({
        successMsg: 'Your vote has been recorded. Thank you!',
        hasVoted: true,
      });

      // update voter in localStorage so it stays in sync
      const stored = localStorage.getItem('voter');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.hasVoted = true;
        localStorage.setItem('voter', JSON.stringify(parsed));
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Failed to submit vote';

      const nextState = { error: msg };
      // if backend reports they've already voted, set hasVoted to true
      if (
        msg.toLowerCase().includes('already voted') ||
        msg.toLowerCase().includes('duplicate')
      ) {
        nextState.hasVoted = true;
      }

      this.setState(nextState);
    }
  }

  // 🖱 Method you can test: selecting a candidate (no-op if already voted)
  handleCandidateClick(candidateId) {
    if (this.state.hasVoted) return;
    this.setState({ selectedCandidateId: candidateId });
  }

  render() {
    const {
      loading,
      election,
      candidates,
      selectedCandidateId,
      error,
      successMsg,
      hasVoted,
    } = this.state;
    const { voter } = this.props;

    if (loading) {
      return <div>Loading ballot...</div>;
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
            <h2 style={{ marginBottom: '0.25rem' }}>{election.name}</h2>
            <p style={{ marginBottom: '1rem', color: '#555' }}>
              {election.description}
            </p>

            {voter && (
              <p
                style={{
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#666',
                }}
              >
                Voter: {voter.name} ({voter.idNumber})
              </p>
            )}

            {/* 🔴 Show clear message when they can't vote anymore */}
            {hasVoted && (
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
                You have already cast your vote in this election. You cannot vote again.
              </div>
            )}

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

            {successMsg && (
              <div
                style={{
                  marginBottom: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '4px',
                  background: '#dcfce7',
                  color: '#166534',
                  fontSize: '0.9rem',
                }}
              >
                {successMsg}
              </div>
            )}

            <form onSubmit={this.handleSubmit}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Select one candidate:
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {candidates.map((c) => (
                  <li
                    key={c._id}
                    style={{
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border:
                        selectedCandidateId === c._id
                          ? '2px solid #2563eb'
                          : '1px solid #cbd5e1',
                      cursor: hasVoted ? 'not-allowed' : 'pointer',
                      opacity: hasVoted ? 0.6 : 1,
                    }}
                    onClick={() => this.handleCandidateClick(c._id)}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <input
                        type="radio"
                        name="candidate"
                        value={c._id}
                        checked={selectedCandidateId === c._id}
                        onChange={() => this.handleCandidateClick(c._id)}
                        disabled={hasVoted}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: '#555',
                          }}
                        >
                          {c.description}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#64748b',
                          }}
                        >
                          {c.party && `Party: ${c.party}`}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>

              <button
                type="submit"
                disabled={!selectedCandidateId || hasVoted}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  border: 'none',
                  background:
                    !selectedCandidateId || hasVoted ? '#9ca3af' : '#22c55e',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor:
                    !selectedCandidateId || hasVoted
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                Cast Vote
              </button>
            </form>
          </>
        ) : (
          <div>No open election found.</div>
        )}
      </div>
    );
  }
}

export default BallotPage;
