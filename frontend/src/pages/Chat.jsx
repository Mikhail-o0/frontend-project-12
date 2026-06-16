import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetChannelsQuery } from '../api/channelsApi'
import Channels from '../components/Channels'
import Messages from '../components/Messages'
import AddChannelModal from '../components/Modals/AddChannelModal'
import RenameChannelModal from '../components/Modals/RenameChannelModal'
import DeleteChannelModal from '../components/Modals/DeleteChannelModal'

const Chat = () => {
  const { t } = useTranslation()
  const { data: channels, error: channelsError } = useGetChannelsQuery()
  const [activeChannelId, setActiveChannelId] = useState(null)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)

  useEffect(() => {
    if (channels && channels.length > 0 && !activeChannelId) {
      const generalChannel = channels.find(ch => ch.name === 'general')
      if (generalChannel) {
        setActiveChannelId(generalChannel.id)
      } else {
        setActiveChannelId(channels[0].id)
      }
    }
  }, [channels, activeChannelId])

  const activeChannel = channels?.find(ch => ch.id === activeChannelId)

  const handleRenameChannel = (channel) => {
    setSelectedChannel(channel)
    setShowRenameModal(true)
  }

  const handleDeleteChannel = (channel) => {
    setSelectedChannel(channel)
    setShowDeleteModal(true)
  }

  if (!channels || !activeChannelId) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: 'calc(100vh - 56px)' }}>
        {t('chat.loading')}
      </div>
    )
  }

  return (
    <div className="container-fluid d-flex flex-column" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="row flex-grow-1">
        <div className="col-md-3 col-lg-2 border-end p-0">
          <Channels 
            channels={channels}
            activeChannelId={activeChannelId}
            onSelectChannel={setActiveChannelId}
            onAddChannel={() => setShowAddModal(true)}
            onRenameChannel={handleRenameChannel}
            onDeleteChannel={handleDeleteChannel}
            error={channelsError}
          />
        </div>
        <div className="col-md-9 col-lg-10 p-0">
          <Messages 
            channelId={activeChannelId}
            channelName={activeChannel?.name || ''}
          />
        </div>
      </div>

      <AddChannelModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSelectChannel={setActiveChannelId}
      />

      <RenameChannelModal
        show={showRenameModal}
        onClose={() => {
          setShowRenameModal(false)
          setSelectedChannel(null)
        }}
        channelId={selectedChannel?.id}
        currentName={selectedChannel?.name}
      />

      <DeleteChannelModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedChannel(null)
        }}
        channelId={selectedChannel?.id}
        channelName={selectedChannel?.name}
      />
    </div>
  )
}
export default Chat