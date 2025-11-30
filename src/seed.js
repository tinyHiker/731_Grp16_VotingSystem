
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import models
const Voter = require('./models/voter.model');
const Election = require('./models/election.model');
const Candidate = require('./models/candidate.model');
const Vote = require('./models/vote.model');
const ResultSnapshot = require('./models/resultSnapshot.model');
const AuditEntry = require('./models/auditEntry.model');
const Ballot = require('./models/ballot.model');
const ElectionAdministrator = require('./models/electionAdministrator.model');

async function seed() {
  await connectDB();

  console.log('🚨 Clearing old data...');
  await Promise.all([
    Voter.deleteMany({}),
    Election.deleteMany({}),
    Candidate.deleteMany({}),
    Vote.deleteMany({}),
    ResultSnapshot.deleteMany({}),
    AuditEntry.deleteMany({}),
    Ballot.deleteMany({}),
    ElectionAdministrator.deleteMany({}),
  ]);

  console.log('✅ Collections cleared');

  console.log('🗳 Creating election...');
  const election = await Election.create({
    name: 'Student Council Election 2025',
    description: 'Election for student council president',
    state: 'Open', // important: this makes it show up as current ballot
    startTime: new Date(Date.now() - 60 * 60 * 1000), // started 1h ago
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // ends in 24h
    tallyRule: 'Plurality',
  });

  console.log('✅ Election created:', election._id.toString());

  console.log('👤 Creating voters...');
  const voters = await Voter.insertMany([
    {
      idNumber: '1001',
      passwordHash: 'password1', // plain for now – login with this
      name: 'Alice Anderson',
      email: 'alice@example.com',
    },
    {
      idNumber: '1002',
      passwordHash: 'password2',
      name: 'Bob Brown',
      email: 'bob@example.com',
    },
    {
      idNumber: '1003',
      passwordHash: 'password3',
      name: 'Charlie Clark',
      email: 'charlie@example.com',
    },
  ]);

  console.log(
    '✅ Voters created:',
    voters.map((v) => `${v.idNumber} (${v.email})`).join(', ')
  );

  console.log('🧑‍💼 Creating election admin...');
  const admin = await ElectionAdministrator.create({
    name: 'Admin User',
    email: 'admin@example.com',
  });
  console.log('✅ Admin created:', admin.email);

  console.log('🧾 Creating candidates...');
  const candidates = await Candidate.insertMany([
    {
      electionId: election._id,
      name: 'Candidate A',
      description: 'Experienced student leader',
      party: 'Blue Party',
      position: 0,
    },
    {
      electionId: election._id,
      name: 'Candidate B',
      description: 'Focused on student welfare',
      party: 'Green Party',
      position: 1,
    },
    {
      electionId: election._id,
      name: 'Candidate C',
      description: 'Tech and innovation advocate',
      party: 'Yellow Party',
      position: 2,
    },
  ]);

  console.log(
    '✅ Candidates created:',
    candidates.map((c) => c.name).join(', ')
  );

  console.log('🌱 Seeding complete!');
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed');
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  mongoose.connection.close().then(() => process.exit(1));
});
