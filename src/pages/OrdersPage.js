import { useState, useEffect } from "react"
import { Utensils, Check, X } from "lucide-react"
import { apiClient } from "../api/client"
import "./OrdersPage.css"

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await apiClient.getOrders()
      setOrders(data.data || data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "processing"
      case "done":
        return "done"
      case "takeaway":
        return "takeaway"
      default:
        return "pending"
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      processing: "Dine In",
      done: "Done",
      takeaway: "Take Away",
      pending: "Pending",
    }
    return labels[status] || status
  }

  const getOngoingLabel = (status) => {
    if (status === 'processing') return 'Ongoing: 4 Min'
    if (status === 'done') return 'Served'
    if (status === 'takeaway') return 'Not Picked up'
    return 'Pending'
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus)
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await apiClient.deleteOrder(orderId)
        fetchOrders()
      } catch (error) {
        console.error("Error deleting order:", error)
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  return (
    <div className="orders-page">
      <h1>Order Line</h1>
      <div className="orders-grid">
        {orders.map((order) => (
          <div key={order._id} className={`order-card ${getStatusColor(order.status)}`}>
            <div className="order-header">
              <div className="order-info">
                <Utensils size={18} />
                <div>
                  <h3># {order.orderNumber}</h3>
                  <p>Table-{order.tableNumber < 10 ? '0' + order.tableNumber : order.tableNumber}</p>
                </div>
              </div>
              <span className="order-time">{new Date(order.createdAt).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}</span>
            </div>

            <div className="order-status">
              <span className="status-badge">{getStatusLabel(order.status)}</span>
              <span className="status-badge" style={{background: order.status === 'processing' ? '#ffcc80' : order.status === 'done' ? '#7fdb9f' : '#b0bec5'}}>{getOngoingLabel(order.status)}</span>
            </div>
            <div className="item-count" style={{marginBottom: '12px'}}>{order.items?.length || 0} Item</div>

            <div className="order-items">
              {order.items?.map((item, idx) => (
                <div key={idx} className="order-item">
                  <span>{item.quantity}x</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            <div className="order-actions">
              {order.status === "processing" && (
                <button className="action-btn processing-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Processing
                </button>
              )}
              {order.status === "done" && (
                <button className="action-btn order-done-btn">
                  <Check size={16} />
                  Order Done
                </button>
              )}
              {order.status === "takeaway" && (
                <button className="action-btn order-done-btn" onClick={() => handleStatusUpdate(order._id, "done")}>
                  <Check size={16} />
                  Order Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
