const concurrently = require('concurrently');

concurrently([
  { 
    command: 'cd backend && npm run dev',
    name: 'backend',
    prefixColor: 'blue'
  },
  { 
    command: 'cd frontend && npm start',
    name: 'frontend',
    prefixColor: 'green'
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
}).then(
  () => console.log('All processes complete!'),
  (err) => console.error('Error occurred:', err)
); 