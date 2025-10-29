import { useState, useEffect } from "react"
import { Search, Star, Trash2, Plus } from "lucide-react"
import { apiClient } from "../api/client"
import AddMenuModal from "../components/AddMenuModal"
import "./MenuPage.css"

function MenuPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [selectedCategory, searchTerm])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [itemsData, categoriesData] = await Promise.all([apiClient.getAllMenu(), apiClient.getCategories()])
      setItems(itemsData.data || itemsData)
      setCategories(categoriesData.data || categoriesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await apiClient.deleteMenuItem(id)
        setItems(items.filter((item) => item._id !== id))
      } catch (error) {
        console.error("Error deleting item:", error)
      }
    }
  }

  const handleAddMenuItem = async (menuData) => {
    try {
      const result = await apiClient.createMenuItem(menuData)
      // Refresh the menu list
      await fetchData()
      setIsModalOpen(false)
      alert("Menu item added successfully!")
    } catch (error) {
      console.error("Error adding menu item:", error)
      alert("Failed to add menu item. Please try again.")
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-menu-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Menu Item
        </button>
      </div>

      <div className="category-filter">
        <button
          className={`category-btn ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className="menu-card">
              <div className="menu-image">
                {item.image ? <img src={item.image} alt={item.name} /> : 'Image'}
              </div>
              <div className="menu-content">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="menu-meta">
                  <span className="price">Price: {item.price}</span>
                  <span className="prep-time">Average Prep Time: {item.avgPrepTime} Mins</span>
                </div>
                <div className="menu-meta">
                  <span className="category-badge">{item.category || 'Burgers'}</span>
                  {item.inStock !== false && <span className="instock-badge">InStock: Yes</span>}
                </div>
                <div className="menu-footer">
                  <div className="rating">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span>Rating: {item.rating || 4.5}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddMenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddMenuItem}
      />
    </div>
  )
}

export default MenuPage
