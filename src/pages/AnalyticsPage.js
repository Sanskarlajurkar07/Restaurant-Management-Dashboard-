"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ChefHat, IndianRupee, ClipboardList, Users } from "lucide-react"
import { apiClient } from "../api/client"
import "./AnalyticsPage.css"

function AnalyticsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [ordersSummary, setOrdersSummary] = useState(null)
  const [graphData, setGraphData] = useState(null)
  const [chefs, setChefs] = useState([])
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderFilter, setOrderFilter] = useState("daily")
  const [revenueFilter, setRevenueFilter] = useState("daily")

  useEffect(() => {
    fetchAnalytics()
  }, [orderFilter, revenueFilter])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [dashboardData, summaryData, graphDataResponse, chefsData, tablesData] = await Promise.all([
        apiClient.getDashboard(),
        apiClient.getOrdersSummary(orderFilter),
        apiClient.getGraphData(revenueFilter),
        apiClient.getChefs(),
        apiClient.getTables(),
      ])
      setDashboard(dashboardData.data || dashboardData)
      const summary = summaryData.data || summaryData
      setOrdersSummary(Array.isArray(summary) ? summary : null)
      
      // Process graph data - convert label to name for the chart
      const rawGraphData = graphDataResponse.data || graphDataResponse
      const processedGraphData = rawGraphData?.graphData?.map(item => ({
        name: item.label,
        revenue: item.revenue,
        orders: item.orders
      })) || null
      setGraphData(processedGraphData)
      
      setChefs(chefsData.data || chefsData || [])
      setTables(tablesData.data || tablesData || [])
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading analytics...</div>
  }

  const COLORS = ["#FF6B6B", "#4ECDC4", "#95E1D3"]

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      <div className="filter-input">
        <input type="text" placeholder="Filter..." style={{padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '8px', width: '200px', fontSize: '13px'}} />
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon chef">
            <ChefHat size={40} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{chefs.length}</div>
            <div className="stat-label">TOTAL CHEF</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <IndianRupee size={40} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{dashboard?.totalRevenue || 0}</div>
            <div className="stat-label">TOTAL REVENUE</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">
            <ClipboardList size={40} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{dashboard?.totalOrders || 0}</div>
            <div className="stat-label">TOTAL ORDERS</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon clients">
            <Users size={40} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{dashboard?.totalClients || 0}</div>
            <div className="stat-label">TOTAL CLIENTS</div>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-panel order-summary">
          <div className="chart-header">
            <div>
              <h3>Order Summary</h3>
              <p className="chart-subtitle">hijokplmgntop[gtgkoikokyhikoy[phokphnoy</p>
            </div>
            <select className="filter-dropdown" value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="order-summary-numbers">
            <div className="summary-box">
              <div className="summary-number">09</div>
              <div className="summary-label">Served</div>
            </div>
            <div className="summary-box">
              <div className="summary-number">05</div>
              <div className="summary-label">Dine In</div>
            </div>
            <div className="summary-box">
              <div className="summary-number">06</div>
              <div className="summary-label">Take Away</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={ordersSummary || [{name: 'Served', value: 41}, {name: 'Dine In', value: 39}, {name: 'Take Away', value: 21}]}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {(ordersSummary || [{name: 'Served', value: 41}, {name: 'Dine In', value: 39}, {name: 'Take Away', value: 21}]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {(ordersSummary || [{name: 'Served', value: 41}, {name: 'Dine In', value: 39}, {name: 'Take Away', value: 21}]).map((item, idx) => (
              <div key={idx} className="legend-item">
                <div className="legend-label">
                  <span className="legend-dot" style={{background: COLORS[idx % COLORS.length]}}></span>
                  <span>{item.name}</span>
                </div>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-panel revenue-panel">
          <div className="chart-header">
            <div>
              <h3>Revenue</h3>
              <p className="chart-subtitle">hijokplmgntop[gtgkoikokyhikoy[phokphnoy</p>
            </div>
            <select className="filter-dropdown" value={revenueFilter} onChange={(e) => setRevenueFilter(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graphData || [{name: 'Mon', revenue: 2000}, {name: 'Tue', revenue: 3500}, {name: 'Wed', revenue: 4200}, {name: 'Thur', revenue: 3800}, {name: 'Fr', revenue: 5000}, {name: 'Sat', revenue: 6500}, {name: 'Sun', revenue: 4500}]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-panel">
          <h3>Tables</h3>
          <div className="table-status">
            <div className="status-item">
              <span className="status-dot reserved"></span>
              <span>Reserved</span>
            </div>
            <div className="status-item">
              <span className="status-dot available"></span>
              <span>Available</span>
            </div>
          </div>
          <div className="table-grid-mini">
            {tables.map((table, idx) => (
              <div key={table._id || idx} className={`table-mini ${table.isReserved ? "reserved" : "available"}`}>
                <span className="table-label">Table</span>
                <span className="table-number">{String(table.tableNumber).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chef-stats">
        <table>
          <thead>
            <tr>
              <th>Chef Name</th>
              <th>Order Taken</th>
            </tr>
          </thead>
          <tbody>
            {chefs.length > 0 ? (
              chefs.map((chef, idx) => (
                <tr key={chef._id || idx}>
                  <td>{chef.name}</td>
                  <td>{chef.assignedOrders?.length || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{textAlign: 'center', color: '#999'}}>No chefs available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AnalyticsPage
