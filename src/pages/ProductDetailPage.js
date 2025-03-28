// pages/ProductDetailPage.js
import React from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, getSizes } from '../services/api'
import { CartContext } from '../contexts/CartContext'

export default function ProductDetailPage() {
  // Достаем id из URL
  const { id } = useParams()

  // Состояния
  const [product, setProduct] = React.useState(null)
  const [allSizes, setAllSizes] = React.useState([])
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(0)
  const [selectedSizeId, setSelectedSizeId] = React.useState(null)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  // Подключаемся к контексту корзины
  const { addToCart } = React.useContext(CartContext)

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

    return () => {
      isMounted = false
    }
  }, [id])

  if (!product) {
    return <div className="loading-container">Загрузка...</div>
  }

  // Текущий цвет
  const currentColor = product.colors[selectedColorIndex] || {}

  // Предыдущая картинка
  const handlePrevImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentColor.images.length - 1 : prev - 1
    )
  }

  // Следующая картинка
  const handleNextImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === currentColor.images.length - 1 ? 0 : prev + 1
    )
  }

  // Добавить в корзину
  const handleAddToCart = () => {
    if (!currentColor?.id || !selectedSizeId) {
      return
    }

    const firstImage = currentColor.images?.[0]
    const itemToAdd = {
      productId: product.id,
      colorId: currentColor.id,
      sizeId: selectedSizeId,
      productName: product.name,
      colorName: currentColor.name,
      price: currentColor.price,
      image: firstImage,
    }
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
            className={
              index === selectedColorIndex ? 'color-btn active' : 'color-btn'
            }
            key={color.id}
            onClick={() => {
              setSelectedColorIndex(index)
              setCurrentImageIndex(0)
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
          const isAvailable = currentColor.sizes?.includes(size.id)
          return (
            <button
              className={
                isAvailable
                  ? size.id === selectedSizeId
                    ? 'size-btn active'
                    : 'size-btn'
                  : 'size-btn disabled'
              }
              key={size.id}
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

      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Добавить в корзину
      </button>
    </div>
  )
}
