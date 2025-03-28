// pages/ProductDetailPage.js
import React from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, getSizes } from '../services/api'
import { CartContext } from '../contexts/CartContext'

// Текст et ком en russe
export default function ProductDetailPage() {
  // Достаем product id из URL
  const { id } = useParams()

  // Состояния
  const [product, setProduct] = React.useState(null)
  const [allSizes, setAllSizes] = React.useState([])
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(0)
  const [selectedSizeId, setSelectedSizeId] = React.useState(null)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  // Достаем addToCart из контекста корзины
  const { addToCart } = React.useContext(CartContext)

  // Загружаем данные о продукте и о всех размерах
  React.useEffect(() => {
    let isMounted = true

    // Запрашиваем продукт
    getProduct(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data)
        }
      })
      .catch(() => {
        // Обработка ошибок (опционально)
      })

    // Запрашиваем все размеры
    getSizes()
      .then((sizeData) => {
        if (isMounted) {
          setAllSizes(sizeData)
        }
      })
      .catch(() => {
        // Обработка ошибок (опционально)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  // Если пока нет данных о продукте
  if (!product) {
    return <div style={{ padding: '1rem' }}>Загрузка...</div>
  }

  // Получаем текущий цвет
  const currentColor = product.colors[selectedColorIndex] || {}

  // Функция переключения предыдущей картинки
  const handlePrevImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentColor.images.length - 1 : prev - 1
    )
  }

  // Функция переключения следующей картинки
  const handleNextImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === currentColor.images.length - 1 ? 0 : prev + 1
    )
  }

  // Функция добавления товара в корзину
  const handleAddToCart = () => {
    if (!currentColor?.id || !selectedSizeId) {
      // В реальном проекте мы могли бы отобразить сообщение об ошибке или alerte
      return
    }

    // Формируем объект для корзины
    const itemToAdd = {
      productId: product.id,
      colorId: currentColor.id,
      sizeId: selectedSizeId,
      productName: product.name,
      colorName: currentColor.name,
      price: currentColor.price,
    }

    addToCart(itemToAdd)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{product.name}</h2>

      {/* Блок выбора цвета */}
      <div style={{ marginBottom: '1rem' }}>
        <h4>Выбрать цвет</h4>
        {product.colors.map((color, index) => (
          <button
            key={color.id}
            onClick={() => {
              setSelectedColorIndex(index)
              setCurrentImageIndex(0) // Сбрасываем индексацию картинки при смене цвета
            }}
            style={{
              fontWeight: index === selectedColorIndex ? 'bold' : 'normal',
              marginRight: '0.5rem',
            }}
          >
            {color.name}
          </button>
        ))}
      </div>

      {/* Блок просмотра изображений */}
      <div style={{ marginBottom: '1rem' }}>
        <div>
          {currentColor.images && currentColor.images.length > 0 ? (
            <img
              src={currentColor.images[currentImageIndex]}
              alt={currentColor.name}
              style={{ maxWidth: 200, display: 'block', marginBottom: '0.5rem' }}
            />
          ) : (
            <p>Нет изображений для этого цвета</p>
          )}
        </div>
        {currentColor.images && currentColor.images.length > 1 && (
          <div>
            <button onClick={handlePrevImage} style={{ marginRight: '0.5rem' }}>
              Предыдущая
            </button>
            <button onClick={handleNextImage}>Следующая</button>
          </div>
        )}
      </div>

      {/* Цена и описание */}
      <p>
        Цена: <strong>{currentColor.price}</strong>
      </p>
      <p>{currentColor.description}</p>

      {/* Блок выбора размера */}
      <div style={{ marginBottom: '1rem' }}>
        <h4>Выбрать размер</h4>
        {allSizes.map((size) => {
          // Проверяем, доступен ли size
          const isAvailable = currentColor.sizes?.includes(size.id)
          return (
            <button
              key={size.id}
              onClick={() => {
                if (isAvailable) {
                  setSelectedSizeId(size.id)
                }
              }}
              disabled={!isAvailable}
              style={{
                fontWeight: selectedSizeId === size.id ? 'bold' : 'normal',
                marginRight: '0.5rem',
                opacity: isAvailable ? 1 : 0.5,
              }}
            >
              {size.label}
            </button>
          )
        })}
      </div>

      {/* Кнопка добавления в корзину */}
      <button onClick={handleAddToCart}>Добавить в корзину</button>
    </div>
  )
}
