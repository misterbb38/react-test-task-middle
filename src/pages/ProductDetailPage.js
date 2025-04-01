// pages/ProductDetailPage.js
import React from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, getSizes } from '../services/api'
import { CartContext } from '../contexts/CartContext'

export default function ProductDetailPage() {
  // Récupération de l'ID produit depuis l'URL
  const { id } = useParams()

  // États
  const [product, setProduct] = React.useState(null)
  const [allSizes, setAllSizes] = React.useState([])
  const [selectedColorIndex, setSelectedColorIndex] = React.useState(0)
  const [selectedSizeId, setSelectedSizeId] = React.useState(null)
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)

  // Contexte du panier
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

  // Coloris courant
  const currentColor = product.colors[selectedColorIndex] || {}

  // Image précédente
  const handlePrevImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentColor.images.length - 1 : prev - 1
    )
  }

  // Image suivante
  const handleNextImage = () => {
    if (!currentColor.images) return
    setCurrentImageIndex((prev) =>
      prev === currentColor.images.length - 1 ? 0 : prev + 1
    )
  }

  // Ajout au panier
  const handleAddToCart = () => {
    // Pas de coloris sélectionné
    if (!currentColor?.id) {
      return
    }

    // Déterminer le label de la taille
    let sizeLabel = 'неант'
    if (selectedSizeId) {
      const foundSize = allSizes.find((s) => s.id === selectedSizeId)
      if (foundSize) {
        sizeLabel = foundSize.label
      }
    }

    const firstImage = currentColor.images?.[0]
    const itemToAdd = {
      productId: product.id,
      colorId: currentColor.id,
      sizeId: selectedSizeId || null, // null si pas de taille choisie
      sizeLabel,                     // "неант" ou label de la taille
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

      {/* Choix du coloris */}
      <div className="detail-color-choose">
        <h4>Выбрать цвет</h4>
        {product.colors.map((color, index) => (
          <button
            key={color.id}
            className={index === selectedColorIndex ? 'color-btn active' : 'color-btn'}
            onClick={() => {
              setSelectedColorIndex(index)
              setCurrentImageIndex(0)
              // Réinitialiser la taille lorsqu'on change de coloris
              setSelectedSizeId(null)
            }}
          >
            {color.name}
          </button>
        ))}
      </div>

      {/* Visuel principal */}
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

      {/* Prix et description */}
      <p className="detail-price">Цена: {currentColor.price}</p>
      <p className="detail-description">{currentColor.description}</p>

      {/* Choix de la taille */}
      <div className="detail-size-choose">
        <h4>Выбрать размер</h4>
        {allSizes.map((size) => {
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

      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Добавить в корзину
      </button>
    </div>
  )
}
