"use client"

import { useState, useEffect } from "react"
import { Search, ChefHat, DollarSign, ShoppingBag, Users } from "lucide-react"
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
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#666' }}>
        Loading analytics...
      </div>
    )
  }

  const COLORS = ['#374151', '#6B7280', '#9CA3AF']

  return (
    <div style={{ padding: '24px 24px 24px 32px', background: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div style={{ 
          flex: 1,
          maxWidth: '380px',
          background: 'white', 
          borderRadius: '10px', 
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          <Search size={18} color="#9CA3AF" />
          <input 
            type="text" 
            placeholder="Filter..." 
            style={{ 
              border: 'none', 
              outline: 'none', 
              flex: 1, 
              fontSize: '14px',
              background: 'transparent',
              color: '#374151',
              width: '100%'
            }} 
          />
        </div>
      </div>

      {/* Analytics Title */}
      <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1F2937', marginBottom: '24px' }}>Analytics</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChefHat size={28} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', lineHeight: '1' }}>{chefs.length || '04'}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL CHEF</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={28} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', lineHeight: '1' }}>{dashboard?.totalRevenue || '12K'}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL REVENU</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={28} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', lineHeight: '1' }}>{dashboard?.totalOrders || '20'}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL ORDERS</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={28} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#1F2937', lineHeight: '1' }}>{dashboard?.totalClients || '65'}</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL CLIENTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Order Summary */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>Orders Summary</h3>
              <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Track orders by service type</p>
            </div>
            <select 
              value={orderFilter} 
              onChange={(e) => setOrderFilter(e.target.value)}
              style={{ 
                padding: '6px 28px 6px 12px', 
                border: '1px solid #E5E7EB', 
                borderRadius: '6px', 
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #F0F0F0' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
                {String(ordersSummary?.find(o => o.name === 'Served')?.count || 0).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Served</div>
            </div>
            <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #F0F0F0' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
                {String(ordersSummary?.find(o => o.name === 'Dine In')?.count || 0).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Dine In</div>
            </div>
            <div style={{ flex: 1, background: '#F9FAFB', borderRadius: '8px', padding: '16px', textAlign: 'center', border: '1px solid #F0F0F0' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
                {String(ordersSummary?.find(o => o.name === 'Take Away')?.count || 0).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '500' }}>Take Away</div>
            </div>
          </div>

          {/* Pie Chart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            <div style={{ 
              width: '140px', 
              height: '140px', 
              borderRadius: '50%', 
              background: ordersSummary && ordersSummary.length === 3 
                ? `conic-gradient(${COLORS[0]} 0% ${ordersSummary[0].value}%, ${COLORS[1]} ${ordersSummary[0].value}% ${ordersSummary[0].value + ordersSummary[1].value}%, ${COLORS[2]} ${ordersSummary[0].value + ordersSummary[1].value}% 100%)`
                : 'conic-gradient(#374151 0% 41%, #6B7280 41% 80%, #9CA3AF 80% 100%)', 
              flexShrink: 0 
            }}></div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(ordersSummary || [{name: 'Served', value: 41, count: 9}, {name: 'Dine In', value: 39, count: 5}, {name: 'Take Away', value: 21, count: 6}]).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: COLORS[idx] }}></span>
                    <span style={{ color: '#666' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: '600', color: '#1F2937', fontSize: '13px' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>Revenue</h3>
              <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>Revenue trends over time</p>
            </div>
            <select 
              value={revenueFilter} 
              onChange={(e) => setRevenueFilter(e.target.value)}
              style={{ 
                padding: '6px 28px 6px 12px', 
                border: '1px solid #E5E7EB', 
                borderRadius: '6px', 
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>

          {/* Simple Line Chart */}
          <svg width="100%" height="250" style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1="0" y1={50 + i * 40} x2="100%" y2={50 + i * 40} stroke="#F0F0F0" strokeWidth="1" />
            ))}
            
            {graphData && graphData.length > 0 ? (
              <>
                {/* Line path */}
                <path
                  d={graphData.map((point, i) => {
                    const x = 30 + (i * (300 / (graphData.length - 1 || 1)));
                    const maxRevenue = Math.max(...graphData.map(d => d.revenue), 1);
                    const y = 200 - (point.revenue / maxRevenue) * 150;
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Dots */}
                {graphData.map((point, i) => {
                  const x = 30 + (i * (300 / (graphData.length - 1 || 1)));
                  const maxRevenue = Math.max(...graphData.map(d => d.revenue), 1);
                  const y = 200 - (point.revenue / maxRevenue) * 150;
                  return <circle key={i} cx={x} cy={y} r="4" fill="#3B82F6" />;
                })}
                
                {/* X-axis labels */}
                {graphData.map((point, i) => {
                  const x = 30 + (i * (300 / (graphData.length - 1 || 1)));
                  return <text key={i} x={x} y="230" fontSize="11" fill="#9CA3AF" textAnchor="middle">{point.name}</text>;
                })}
              </>
            ) : (
              <text x="50%" y="120" fontSize="14" fill="#9CA3AF" textAnchor="middle">No data available</text>
            )}
          </svg>
        </div>

        {/* Tables */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 16px 0' }}>Tables</h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }}></span>
              Reserved
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E5E7EB' }}></span>
              Available
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {tables.slice(0, 30).map((table) => (
              <div
                key={table._id}
                style={{
                  padding: '10px 8px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '1px solid',
                  borderColor: table.isReserved ? '#10B981' : '#E5E7EB',
                  background: table.isReserved ? '#10B981' : 'white',
                  color: table.isReserved ? 'white' : '#666',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: '500', opacity: 0.8 }}>Table</span>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>{String(table.tableNumber).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chef Stats Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#F9FAFB' }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#1F2937', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
                Chef Name
              </th>
              <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: '600', color: '#1F2937', fontSize: '14px', borderBottom: '1px solid #E5E7EB' }}>
                Order Taken
              </th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((chef, idx) => (
              <tr key={chef._id} style={{ borderBottom: idx < chefs.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '16px 20px', color: '#1F2937', fontSize: '14px' }}>{chef.name}</td>
                <td style={{ padding: '16px 20px', color: '#1F2937', fontSize: '14px' }}>
                  {String(chef.assignedOrders?.length || 0).padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AnalyticsPage