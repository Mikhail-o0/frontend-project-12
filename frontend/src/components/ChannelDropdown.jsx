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
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [show])

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={(e) => {
          e.stopPropagation()
          setShow(!show)
        }}
        aria-label={t('dropdown.ariaLabel')}
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
            className="dropdown-item"
            onClick={(e) => {
              e.stopPropagation()
              onRename(channel)
              setShow(false)
            }}
          >
            {t('dropdown.rename')}
          </button>
          <button
            type="button"
            className="dropdown-item text-danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(channel)
              setShow(false)
            }}
          >
            {t('dropdown.delete')}
          </button>
        </div>
      )}
    </div>
  )
}

export default ChannelDropdown