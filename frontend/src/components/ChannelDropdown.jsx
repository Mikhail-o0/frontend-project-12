import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const ChannelDropdown = ({ channel, onRename, onDelete }) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!show) return

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [show])

  const handleToggle = (e) => {
    e.stopPropagation()
    setShow(!show)
  }

  const handleRename = (e) => {
    e.stopPropagation()
    onRename(channel)
    setShow(false)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(channel)
    setShow(false)
  }

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={handleToggle}
        title={t('dropdown.ariaLabel')}
      >
        {t('dropdown.ariaLabel')}
      </button>
      
      {show && (
        <div 
          className="dropdown-menu show position-absolute"
          style={{ right: 0, top: '100%', zIndex: 1000 }}
        >
          <button
            type="button"
            className="dropdown-item"
            onClick={handleRename}
          >
            {t('dropdown.rename')}
          </button>
          <button
            type="button"
            className="dropdown-item text-danger"
            onClick={handleDelete}
          >
            {t('dropdown.delete')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ChannelDropdown