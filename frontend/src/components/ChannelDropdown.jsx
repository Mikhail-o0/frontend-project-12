import { useState, useRef, useEffect } from 'react'

const ChannelDropdown = ({ channel, onRename, onDelete }) => {
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
        className="btn btn-sm btn-outline-secondary"
        onClick={(e) => {
          e.stopPropagation()
          setShow(!show)
        }}
        aria-label="Управление каналом"
      >
        ⋮
      </button>
      
      {show && (
        <div 
          className="dropdown-menu show position-absolute"
          style={{ right: 0, top: '100%', zIndex: 1000 }}
        >
          <button
            className="dropdown-item"
            onClick={(e) => {
              e.stopPropagation()
              onRename(channel)
              setShow(false)
            }}
          >
            Переименовать
          </button>
          <button
            className="dropdown-item text-danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(channel)
              setShow(false)
            }}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  )
}

export default ChannelDropdown