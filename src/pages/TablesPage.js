"use client"

import { useState, useEffect } from "react"
import { Trash2, Plus, Users } from "lucide-react"
import { apiClient } from "../api/client"
import "./TablesPage.css"

function TablesPage() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", capacity: 3 })

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
    try {
      await apiClient.createTable(formData)
      setFormData({ name: "", capacity: 3 })
      setShowAddForm(false)
      fetchTables()
    } catch (error) {
      console.error("Error adding table:", error)
    }
  }

  const handleDeleteTable = async (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      try {
        await apiClient.deleteTable(id)
        fetchTables()
      } catch (error) {
        console.error("Error deleting table:", error)
      }
    }
  }

  const handleReserveTable = async (id, isReserved) => {
    try {
      if (isReserved) {
        await apiClient.unreserveTable(id)
      } else {
        await apiClient.reserveTable(id)
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
      <h1>Tables</h1>
      <div className="tables-grid">
        {tables.map((table) => (
          <div key={table._id} className={`table-card ${table.isReserved ? "reserved" : "available"}`}>
            <div className="table-header">
              <h3>Table</h3>
              <button className="delete-btn" onClick={() => handleDeleteTable(table._id)} title="Delete table">
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
              onClick={() => handleReserveTable(table._id, table.isReserved)}
            >
              {table.isReserved ? "Reserved" : "Available"}
            </button>
          </div>
        ))}

        {showAddForm ? (
          <div className="table-card add-form">
            <form onSubmit={handleAddTable}>
              <input
                type="text"
                placeholder="Table name (optional)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="form-group">
                <label>Chairs</label>
                <select
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                >
                  {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="create-btn">
                Create
              </button>
              <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <button className="add-table-btn" onClick={() => setShowAddForm(true)}>
            <Plus size={32} />
          </button>
        )}
      </div>
    </div>
  )
}

export default TablesPage
