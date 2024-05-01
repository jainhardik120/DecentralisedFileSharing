import React from 'react'
import logo from '../drive-logo.svg'
import foxlogo from '../fox-logo.svg'

const Navbar = ({ address, connect, setactiveLink: helpOpened }) => {
  return (
    <nav>
      <input type="checkbox" id="sidebar-active" />
      <p className='addr-small'>
        <img className='logo' src={foxlogo} alt="" />
        {address ? address : (<button className='connect-btn' onClick={connect}>Connect Wallet</button>)}
      </p>
      <label htmlFor="sidebar-active" className='open-sidebar-button'>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
      </label>
      <label id="overlay" htmlFor="sidebar-active">
      </label>
      <div className="links-container">
        <label htmlFor="sidebar-active"
          className='close-sidebar-button'>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
        </label>
        <p className="home-link" onClick={() => { helpOpened(false) }}><img className='logo' src={logo} alt="" />DxDrive2.0</p>
        <p className='addr'>
          <img className='logo' src={foxlogo} alt="" />
          {address ? address : (<button className='connect-btn' onClick={connect}>Connect Wallet</button>)}
        </p>
        <a href="https://github.com/jainhardik120/Drive2.0" target='_blank' rel="noreferrer">Github</a>
        <a href="https://github.com/jainhardik120" target='_blank' rel="noreferrer">Social</a>
        <p className="help" onClick={() => { helpOpened(true) }}>Help</p>
      </div>
    </nav>
  )
}

export default Navbar
