import { useState, useEffect } from "react"
import { Trash2, Plus, Users } from "lucide-react"
import { apiClient } from "../api/client"
import "./TablesPage.css"

function TablesPage() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", capacity: 2 })

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const data = await apiClient.getTables()
      setTables(data.data || data)
    } catch (error) {
      console.error("Error fetching tables:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTable = async (e) => {
    e.preventDefault()
    
    // REQUIREMENT: Total Tables: 30
    if (tables.length >= 30) {
      alert("Maximum 30 tables allowed!")
      return
    }
    
    try {
      await apiClient.createTable(formData)
      setFormData({ name: "", capacity: 2 })
      setShowAddForm(false)
      fetchTables()
    } catch (error) {
      console.error("Error adding table:", error)
    }
  }

  const handleDeleteTable = async (table) => {
    // REQUIREMENT: Reserved tables cannot be deleted
    if (table.isReserved) {
      alert("Cannot delete a reserved table! Please unreserve it first.")
      return
    }
    
    if (window.confirm(`Are you sure you want to delete Table ${table.tableNumber}?`)) {
      try {
        await apiClient.deleteTable(table._id)
        
        // REQUIREMENT: Deleting a table reshuffles table numbering (always sequential: 1, 2, 3...)
        // After deletion, re-fetch and the backend should handle renumbering
        // Or handle it client-side:
        await fetchTables()
        
      } catch (error) {
        console.error("Error deleting table:", error)
      }
    }
  }

  const handleReserveTable = async (table) => {
    // REQUIREMENT: Tables should be booked based on number of persons
    if (!table.isReserved) {
      const numberOfPersons = prompt(`How many persons? (Table capacity: ${table.capacity})`)
      
      if (numberOfPersons === null) return // User cancelled
      
      const persons = parseInt(numberOfPersons)
      
      if (isNaN(persons) || persons < 1) {
        alert("Please enter a valid number of persons!")
        return
      }
      
      if (persons > table.capacity) {
        alert(`This table can only accommodate ${table.capacity} persons. Please choose a larger table!`)
        return
      }
    }
    
    try {
      if (table.isReserved) {
        await apiClient.unreserveTable(table._id)
      } else {
        await apiClient.reserveTable(table._id)
      }
      fetchTables()
    } catch (error) {
      console.error("Error updating table:", error)
    }
  }

  if (loading) {
    return <div className="loading">Loading tables...</div>
  }

  return (
    <div className="tables-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Tables</h1>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Total: {tables.length}/30 tables
        </div>
      </div>

      <div className="tables-grid">
        {tables.map((table) => (
          <div key={table._id} className={`table-card ${table.isReserved ? "reserved" : "available"}`}>
            <div className="table-header">
              <h3>{table.name || 'Table'}</h3>
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteTable(table)} 
                title={table.isReserved ? "Cannot delete reserved table" : "Delete table"}
                style={{ 
                  opacity: table.isReserved ? 0.5 : 1,
                  cursor: table.isReserved ? 'not-allowed' : 'pointer'
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="table-number">{table.tableNumber}</div>
            <div className="table-capacity">
              <Users size={14} />
              <span>{table.capacity < 10 ? '0' + table.capacity : table.capacity}</span>
            </div>
            <button
              className={`reserve-btn ${table.isReserved ? "reserved" : ""}`}
              onClick={() => handleReserveTable(table)}
            >
              {table.isReserved ? "Reserved" : "Available"}
            </button>
          </div>
        ))}

        {tables.length < 30 && (
          showAddForm ? (
            <div className="table-card add-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                <input
                  type="text"
                  placeholder="Table name (optional)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <div className="form-group">
                  <label>Capacity (persons)</label>
                  <select
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  >
                    {/* REQUIREMENT: Available table sizes: 2, 4, 6, 8 */}
                    <option value={2}>2 persons</option>
                    <option value={4}>4 persons</option>
                    <option value={6}>6 persons</option>
                    <option value={8}>8 persons</option>
                  </select>
                </div>
                <button 
                  type="button" 
                  className="create-btn"
                  onClick={handleAddTable}
                >
                  Create
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="add-table-btn" onClick={() => setShowAddForm(true)}>
              <Plus size={32} />
            </button>
          )
        )}
      </div>

      {/* Requirements Info */}
      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        background: '#f9fafb', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          Table Management Rules:
        </h3>
        <ul style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
          <li><strong>Maximum 30 tables</strong> allowed</li>
          <li><strong>Reserved tables cannot be deleted</strong> (unreserve first)</li>
          <li><strong>Tables are booked based on number of persons</strong> (capacity check)</li>
          <li><strong>Deleting a table reshuffles numbering</strong> (always 1, 2, 3...)</li>
          <li><strong>Available capacities:</strong> 2, 4, 6, or 8 persons only</li>
          <li><strong>Table names are optional</strong></li>
        </ul>
      </div>
    </div>
  )
}

export default TablesPage
