import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ChannelDropdown = ({ channel, onRename, onDelete }) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false)
      }
    }

    if (show) {
      // Увеличиваем задержку до 100ms для надёжности
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [show])

  const handleToggle = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setShow(!show)
  }

  const handleRename = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onRename(channel)
    setShow(false)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete(channel)
    setShow(false)
  }

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={handleToggle}
        aria-label={t('dropdown.ariaLabel')}
        title={t('dropdown.ariaLabel')}
      >
        ⋮
      </button>
      
      {show && (
        <div 
          className="dropdown-menu show position-absolute"
          style={{ right: 0, top: '100%', zIndex: 1000 }}
        >
          <button
            type="button"
            className="dropdown-item text-danger"
            onClick={handleDelete}
          >
            {t('dropdown.delete')}
          </button>
          <button
            type="button"
            className="dropdown-item"
            onClick={handleRename}
          >
            {t('dropdown.rename')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ChannelDropdown