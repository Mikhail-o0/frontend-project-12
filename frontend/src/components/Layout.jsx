import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <main className="flex-grow-1" style={{ overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}

export default Layout