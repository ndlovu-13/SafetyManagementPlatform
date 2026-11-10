
/* ==========================================
   SAFETY MANAGEMENT PLATFORM
   Main React Dashboard
   ========================================== */

import { useEffect, useState } from 'react'
import './App.css'

// Flask backend address.
const API_URL = 'http://127.0.0.1:5000'

// Main application component.
function App() {

  // Store the incident records received from Flask.
  const [incidents, setIncidents] = useState([])

  // Track whether incident information is loading.
  const [loading, setLoading] = useState(true)

  // Store any API errors.
  const [error, setError] = useState('')

  // Control the incident reporting form.
  const [showForm, setShowForm] = useState(false)

  // Store the incident selected for viewing.
const [selectedIncident, setSelectedIncident] = useState(null)

  // Store information entered into the incident form.
  const [formData, setFormData] = useState({
    title: '',
    incident_type: 'Near Miss',
    location: '',
    incident_date: '',
    description: ''
  })

  // Load incidents from the Flask backend.
  async function fetchIncidents() {

    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/api/incidents`)

      if (!response.ok) {
        throw new Error('Could not retrieve incidents.')
      }

      const data = await response.json()

      setIncidents(data)

    } catch (err) {

      setError(
        'Unable to connect to the backend. Check that Flask is running.'
      )

    } finally {

      setLoading(false)

    }
  }

  // Fetch incident records when the dashboard first loads.
  useEffect(() => {
    fetchIncidents()
  }, [])

  // Update form information whenever a field changes.
  function handleInputChange(event) {

    const { name, value } = event.target

    setFormData(previousData => ({
      ...previousData,
      [name]: value
    }))
  }

  // Submit a new incident to the Flask backend.
  async function handleSubmit(event) {

    event.preventDefault()

    try {

      const response = await fetch(`${API_URL}/api/incidents`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Incident submission failed.')
      }

      // Clear the form after successful submission.
      setFormData({
        title: '',
        incident_type: 'Near Miss',
        location: '',
        incident_date: '',
        description: ''
      })

      setShowForm(false)

      // Refresh the incident list from Flask.
      await fetchIncidents()

      alert('Incident reported successfully!')

    } catch (err) {

      alert(err.message)

    }
  }

  // Count incidents that are currently open.
  const openIncidents = incidents.filter(
    incident => incident.status === 'open'
  ).length

  // Display the dashboard.
  return (

    <div className="app-layout">

      {/* ==================================
          SIDEBAR NAVIGATION
          ================================== */}

      <aside className="sidebar">

        <div className="sidebar-brand">
          SAFETY MANAGEMENT
          <span>WORKPLACE SAFETY SYSTEM</span>
        </div>

        <nav className="sidebar-menu">

          <a href="#dashboard" className="active">
            ▦ Dashboard
          </a>

          <a href="#incidents">
            ⚠ Incidents
          </a>

          <a href="#inspections">
            ✓ Inspections
          </a>

          <a href="#risks">
            ◈ Risk Assessments
          </a>

          <a href="#employees">
            ♙ Employees
          </a>

          <a href="#reports">
            ▤ Reports
          </a>

        </nav>

      </aside>


      {/* ==================================
          MAIN DASHBOARD
          ================================== */}

      <main className="main-content" id="dashboard">

        {/* Dashboard header */}

        <header className="topbar">

          <div>
            <h1>Safety Dashboard</h1>
            <p>Workplace health and safety overview</p>
          </div>

          <div className="user-profile">
            Administrator
          </div>

        </header>


        {/* ==================================
            DASHBOARD SUMMARY CARDS
            ================================== */}

        <section className="stats-grid">

          <div className="stat-card">
            <h3>Total Incidents</h3>
            <strong>{incidents.length}</strong>
            <small>Recorded incidents</small>
          </div>

          <div className="stat-card">
            <h3>Open Incidents</h3>
            <strong>{openIncidents}</strong>
            <small>Require attention</small>
          </div>

          <div className="stat-card">
            <h3>Inspections</h3>
            <strong>0</strong>
            <small>Inspection records</small>
          </div>

          <div className="stat-card">
            <h3>Risk Assessments</h3>
            <strong>0</strong>
            <small>Risk records</small>
          </div>

        </section>


        {/* ==================================
            INCIDENT REPORTING SECTION
            ================================== */}

        <section className="dashboard-panel" id="incidents">

          <div className="panel-header">

            <h2>Recent Incidents</h2>

            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Close Form' : '+ Report Incident'}
            </button>

          </div>


          {/* Incident reporting form */}

          {showForm && (

            <form onSubmit={handleSubmit} className="incident-form">

              <h3>New Workplace Incident</h3>

              <label htmlFor="title">Incident Title</label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter incident title"
              />

              <label htmlFor="incident_type">Incident Type</label>

              <select
                id="incident_type"
                name="incident_type"
                value={formData.incident_type}
                onChange={handleInputChange}
              >
                <option>Near Miss</option>
                <option>Injury</option>
                <option>Property Damage</option>
                <option>Environmental Incident</option>
                <option>Unsafe Condition</option>
              </select>

              <label htmlFor="location">Location</label>

              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Where did it happen?"
              />

              <label htmlFor="incident_date">Incident Date</label>

              <input
                id="incident_date"
                type="date"
                name="incident_date"
                value={formData.incident_date}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="description">Description</label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what happened..."
                rows="4"
              />

              <button type="submit" className="btn btn-success">
                Submit Incident
              </button>

            </form>

          )}


          {/* Show errors and loading messages */}

          {loading && <p>Loading incident records...</p>}

          {error && <p role="alert">{error}</p>}


          {/* Display saved incidents */}

          {!loading && !error && (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Incident Title</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {incidents.length === 0 ? (

                    <tr>
                      <td colSpan="7">
                        No incidents have been reported yet.
                      </td>
                    </tr>

                  ) : (

                    incidents.map(incident => (

                      <tr key={incident.id}>

                        <td>{incident.id}</td>

                        <td>{incident.title}</td>

                        <td>{incident.incident_type}</td>

                        <td>{incident.location}</td>

                        <td>{incident.incident_date}</td>

                        <td>
                          <span
                            className={
                              incident.status === 'open'
                                ? 'status status-open'
                                : 'status status-closed'
                            }
                          >
                            {incident.status}
                          </span>
                        </td>
                      {/* Button for viewing full incident details */}
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          View Details
                        </button>
                      </td>
                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

          {/* FULL INCIDENT DETAILS PANEL */}
          {selectedIncident && (
            <div className="dashboard-panel">

              <div className="panel-header">
                <h2>Incident Details</h2>

                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close Details
                </button>
              </div>

              <p><strong>Incident ID:</strong> {selectedIncident.id}</p>

              <p><strong>Title:</strong> {selectedIncident.title}</p>

              <p><strong>Incident Type:</strong> {selectedIncident.incident_type}</p>

              <p><strong>Location:</strong> {selectedIncident.location}</p>

              <p><strong>Incident Date:</strong> {selectedIncident.incident_date}</p>

              <p><strong>Status:</strong> {selectedIncident.status}</p>

              <p>
                <strong>Description:</strong>
                {selectedIncident.description || 'No description provided.'}
              </p>

              <p>
                <strong>Reported By:</strong>
                {selectedIncident.reported_by || 'Not specified'}
              </p>

              <p>
                <strong>Created At:</strong>
                {selectedIncident.created_at || 'Not available'}
              </p>

            </div>
          )}

        </section>

      </main>

    </div>

  )
}

// Make the App component available to main.jsx.
export default App