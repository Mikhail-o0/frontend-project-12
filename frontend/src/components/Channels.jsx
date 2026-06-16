import ChannelDropdown from './ChannelDropdown'

const Channels = ({ 
  channels, 
  activeChannelId, 
  onSelectChannel, 
  onAddChannel,
  onRenameChannel,
  onDeleteChannel
}) => {
  if (!channels) {
    return <div className="p-3">Загрузка каналов...</div>
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5 className="m-0">Каналы</h5>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={onAddChannel}
          aria-label="Добавить канал"
        >
          +
        </button>
      </div>
      <ul className="list-group list-group-flush flex-grow-1 overflow-auto">
        {channels.map((channel) => (
          <li
            key={channel.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              activeChannelId === channel.id ? 'active' : ''
            }`}
            onClick={() => onSelectChannel(channel.id)}
            style={{ cursor: 'pointer' }}
          >
            <span className="text-truncate flex-grow-1">
              # {channel.name}
            </span>
            {channel.removable && (
              <ChannelDropdown
                channel={channel}
                onRename={onRenameChannel}
                onDelete={onDeleteChannel}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Channels