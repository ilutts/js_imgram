import React from 'react'
import { Link } from 'react-router-dom'

import './App.css'

import PageContainer from '../containers/PageContainer'
import UserContainer from '../containers/UserContainer'

function App() {
  return (
    <div className="app">
      <header className="header">
        <Link to="/">
          <h1 className="logo">IMGram</h1>
        </Link>
        <UserContainer />
      </header>
      <main className="main">
        <PageContainer />
      </main>
    </div>
  )
}

export default App
