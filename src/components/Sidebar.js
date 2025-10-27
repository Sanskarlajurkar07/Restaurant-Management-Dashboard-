"use client"

import { Link, useLocation } from "react-router-dom"
import { LayoutGrid, Armchair, NotebookPen, BarChart3, Menu, X } from "lucide-react"
import "./Sidebar.css"

function Sidebar({ open, setOpen }) {
  const location = useLocation()

  const navItems = [
    { path: "/analytics", icon: LayoutGrid, label: "Analytics" },
    { path: "/tables", icon: Armchair, label: "Tables" },
    { path: "/orders", icon: NotebookPen, label: "Orders" },
    { path: "/", icon: BarChart3, label: "Menu" },
  ]

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">R</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <Icon size={24} />
                {open && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
