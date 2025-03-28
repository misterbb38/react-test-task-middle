// pages/ProductListPage.js
import React from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/api'

export default function ProductListPage() {
  // Состояние для хранения списка товаров
  const [products, setProducts] = React.useState([])

  // При монтировании загружаем товары
  React.useEffect(() => {
    let isMounted = true

    getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data)
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="product-list-page">
      <h2 className="product-list-title">Список товаров</h2>

      <div className="product-list-container">
        {products.map((product) => {
          const firstColor = product.colors[0]
          const firstImage = firstColor?.images?.[0]

          return (
            <div className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`} className="product-card-link">
                <h3 className="product-card-title">{product.name}</h3>
                {firstImage && (
                  <img
                    src={firstImage}
                    alt={firstColor.name}
                    className="product-image"
                  />
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
