// pages/ProductListPage.js
import React from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../services/api'

export default function ProductListPage() {
  // Состояние для хранения списка товаров
  const [products, setProducts] = React.useState([])

  // При монтировании загружаем товары из API
  React.useEffect(() => {
    let isMounted = true

    getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data)
        }
      })
      .catch(() => {
        // Обрабатываем ошибки, если нужно
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Список товаров</h2>

      {/* Контейнер в Flex-режиме */}
      <div
        style={{
          display: 'flex',        // Включаем Flex Layout
          flexWrap: 'wrap',       // Разрешаем перенос на новую строку, если не хватает места
          gap: '1rem',            // Задаём отступы между элементами
        }}
      >
        {products.map((product) => {
          const firstColor = product.colors[0]
          const firstImage = firstColor?.images?.[0]

          return (
            // Каждая карточка товара
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                width: '200px',      // Фиксированная ширина (можно использовать minWidth)
                boxSizing: 'border-box',
              }}
            >
              {/* Ссылка охватывает заголовок и картинку, так что клик по любому элементу ведёт на детальную страницу */}
              <Link
                to={`/product/${product.id}`}
                style={{
                  textDecoration: 'none', // Убираем подчёркивание ссылок
                  color: 'inherit',       // Сохраняем цвет текста
                }}
              >
                <h3>{product.name}</h3>
                {firstImage && (
                  <img
                    src={firstImage}
                    alt={firstColor.name}
                    style={{
                      width: '100%', // Адаптивная ширина для картинки
                      height: 'auto',
                    }}
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
