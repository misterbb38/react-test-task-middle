// pages/ProductDetailPage.js
import React from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, getSizes } from '../services/api'
import { CartContext } from '../contexts/CartContext'

export default function ProductDetailPage() {
  // Получаем ID товара из URL
  const { id } = useParams()

  // Локальные состояния
  const [product, setProduct] = React.useState(null)           // Состояние для объекта товара
  const [allSizes, setAllSizes] = React.useState([])           // Состояние для списка всех возможных размеров
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(0) // Индекс выбранного цвета
  const [selectedSizeId, setSelectedSizeId] = React.useState(null)      // ID выбранного размера
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)    // Индекс текущего изображения

  // Подключаемся к контексту корзины
  const { addToCart } = React.useContext(CartContext)

  // Загружаем данные о товаре и списка размеров
  React.useEffect(() => {
    let isMounted = true

    getProduct(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data)
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке товара:', error)
      })

    getSizes()
      .then((sizesData) => {
        if (isMounted) {
          setAllSizes(sizesData)
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке размеров:', error)
      })

    // Очищаем флаг isMounted при размонтировании
    return () => {
      isMounted = false
    }
  }, [id])

  // Если товар не загружен, показываем индикатор загрузки
  if (!product) {
    return <div className="loading-container">Загрузка...</div>
  }

  // Текущий (выбранный) цвет из массива цветов
  const currentColor = product.colors[selectedColorIndex] || {}

  // Обработчик для показа предыдущей картинки
  const handlePrevImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentColor.images.length - 1 : prev - 1
    )
  }

  // Обработчик для показа следующей картинки
  const handleNextImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === currentColor.images.length - 1 ? 0 : prev + 1
    )
  }

  // Обработчик для добавления товара в корзину
  const handleAddToCart = () => {
    // Если цвет не выбран (нет ID) — выходим
    if (!currentColor?.id) {
      return
    }

    // Определяем лейбл (название) размера
    let sizeLabel = 'неант'
    if (selectedSizeId) {
      const foundSize = allSizes.find((s) => s.id === selectedSizeId)
      if (foundSize) {
        sizeLabel = foundSize.label
      }
    }

    // Извлекаем первую картинку (если она есть)
    const firstImage = currentColor.images?.[0]

    // Формируем объект товара для добавления в корзину
    const itemToAdd = {
      productId: product.id,
      colorId: currentColor.id,
      sizeId: selectedSizeId || null, // Если размер не выбран, записываем null
      sizeLabel,                     // "неант" или реальное название размера
      productName: product.name,
      colorName: currentColor.name,
      price: currentColor.price,
      image: firstImage,
    }

    // Добавляем товар в корзину
    addToCart(itemToAdd)
  }

  return (
    <div className="detail-page">
      <h2 className="detail-title">{product.name}</h2>

      {/* Блок выбора цвета */}
      <div className="detail-color-choose">
        <h4>Выбрать цвет</h4>
        {product.colors.map((color, index) => (
          <button
            key={color.id}
            className={index === selectedColorIndex ? 'color-btn active' : 'color-btn'}
            onClick={() => {
              // При выборе нового цвета сбрасываем текущий индекс цвета, индекс картинки и выбранный размер
              setSelectedColorIndex(index)
              setCurrentImageIndex(0)
              setSelectedSizeId(null)
            }}
          >
            {color.name}
          </button>
        ))}
      </div>

      {/* Блок просмотра изображений */}
      <div className="detail-image-block">
        <div className="detail-image-wrapper">
          {currentColor.images && currentColor.images.length > 0 ? (
            <img
              src={currentColor.images[currentImageIndex]}
              alt={currentColor.name}
              className="detail-main-image"
            />
          ) : (
            <p className="no-image-text">Нет изображений для этого цвета</p>
          )}
        </div>

        {currentColor.images && currentColor.images.length > 1 && (
          <div className="image-buttons">
            <button onClick={handlePrevImage}>Предыдущая</button>
            <button onClick={handleNextImage}>Следующая</button>
          </div>
        )}
      </div>

      {/* Цена и описание */}
      <p className="detail-price">Цена: {currentColor.price}</p>
      <p className="detail-description">{currentColor.description}</p>

      {/* Блок выбора размера */}
      <div className="detail-size-choose">
        <h4>Выбрать размер</h4>
        {allSizes.map((size) => {
          // Проверяем, доступен ли текущий размер для выбранного цвета
          const isAvailable = currentColor.sizes?.includes(size.id)
          return (
            <button
              key={size.id}
              className={
                isAvailable
                  ? size.id === selectedSizeId
                    ? 'size-btn active'
                    : 'size-btn'
                  : 'size-btn disabled'
              }
              onClick={() => {
                if (isAvailable) {
                  setSelectedSizeId(size.id)
                }
              }}
              disabled={!isAvailable}
            >
              {size.label}
            </button>
          )
        })}
      </div>

      {/* Кнопка добавления в корзину */}
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Добавить в корзину
      </button>
    </div>
  )
}
