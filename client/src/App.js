import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3000';

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ title: '', description: '' });
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [updatedIssue, setUpdatedIssue] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issues`);
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const createIssue = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issues`);
      const lastIssueId = response.data[response.data.length - 1].id;
      const newIssueId = lastIssueId + 1;
      const createdIssue = { ...newIssue, id: newIssueId };
      await axios.post(`${API_BASE_URL}/issues`, createdIssue);
      console.log('Issue created successfully');
      fetchIssues();
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  const startEditingIssue = (id) => {
    const issueToEdit = issues.find((issue) => issue.id === id);
    setEditingIssueId(id);
    setUpdatedIssue({ title: issueToEdit.title, description: issueToEdit.description });
  };

  const cancelEditingIssue = () => {
    setEditingIssueId(null);
    setUpdatedIssue({ title: '', description: '' });
  };

  const updateIssue = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/issues/${id}`, updatedIssue);
      console.log('Issue updated successfully');
      setEditingIssueId(null);
      setUpdatedIssue({ title: '', description: ''});
      fetchIssues();
    } catch (error) {
      console.error('Error updating issue:', error);
    }
  };

  const deleteIssue = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/issues/${id}`);
      console.log('Issue deleted successfully');
      fetchIssues();
    } catch (error) {
      console.error('Error deleting issue:', error);
    }
  };

  return (
    <div className="app">
      <h1>Issues</h1>
      <ul className="issue-list">
        {issues.map((issue) => (
          <li key={issue.id} className="issue-item">
            {editingIssueId === issue.id ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor={`title-${issue.id}`}>Title:</label>
                  <input
                    type="text"
                    id={`title-${issue.id}`}
                    value={updatedIssue.title}
                    onChange={(e) => setUpdatedIssue({ ...updatedIssue, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`description-${issue.id}`}>Description:</label>
                  <input
                    type="text"
                    id={`description-${issue.id}`}
                    value={updatedIssue.description}
                    onChange={(e) => setUpdatedIssue({ ...updatedIssue, description: e.target.value })}
                  />
                </div>
                <button className="update-button" onClick={() => updateIssue(issue.id)}>
                  Update
                </button>
                <button className="cancel-button" onClick={cancelEditingIssue}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="issue-info">
                <h3>{issue.title}</h3>
                <p>{issue.description}</p>
                <div className="actions">
                  <button className="edit-button" onClick={() => startEditingIssue(issue.id)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => deleteIssue(issue.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="create-form">
        <h2>Create Issue</h2>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={newIssue.title}
            onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={newIssue.description}
            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
          />
        </div>
        <button className="create-button" onClick={createIssue}>
          Create
        </button>
      </div>
    </div>
  );
}

export default App;