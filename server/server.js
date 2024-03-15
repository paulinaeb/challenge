const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let issues = [];

// Load data from data.json
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error loading data:', err);
  } else {
    issues = JSON.parse(data);
    console.log('Data loaded successfully');
  }
});

// Create an issue
app.post('/issues', (req, res) => {
  const issue = req.body;
  issues.push(issue);
  console.log('Created issue:', issue);
  res.send('Issue created successfully');
});

// Read all issues
app.get('/issues', (req, res) => {
  res.json(issues);
});

// Update an issue
app.put('/issues/:id', (req, res) => {
  const id = req.params.id;
  const updatedIssue = req.body;

  const index = issues.findIndex(issue => issue.id === id);
  if (index >= 0) {
    issues[index] = updatedIssue;
    console.log('Updated issue:', updatedIssue);
    res.send('Issue updated successfully');
  } else {
    res.status(404).send('Issue not found');
  }
});

// Delete an issue
app.delete('/issues/:id', (req, res) => {
  const id = req.params.id;

  const index = issues.findIndex(issue => issue.id === id);
  if (index >= 0) {
    const deletedIssue = issues.splice(index, 1)[0];
    console.log('Deleted issue:', deletedIssue);
    res.send('Issue deleted successfully');
  } else {
    res.status(404).send('Issue not found');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});