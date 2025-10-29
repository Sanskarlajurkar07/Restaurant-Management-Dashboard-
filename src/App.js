import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import MenuPage from "./pages/MenuPage"
import OrdersPage from "./pages/OrdersPage"
import TablesPage from "./pages/TablesPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import "./App.css"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="app-container">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<AnalyticsPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/tables" element={<TablesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
