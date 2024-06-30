import {useState, useContext} from 'react'
import Cookies from 'js-cookie'
import {Link, useHistory} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {IoMdMenu, IoMdCloseCircle} from 'react-icons/io'
import SearchContext from '../../context/SearchContext'

import './index.css'

const NavBar = () => {
  const [searchInput, setSearchInput] = useState('')
  const {updatedSearchInput} = useContext(SearchContext)
  const [hamburgerIcon, setHamburgerIcon] = useState(false)
  const [mobileSearchBar, setMobileSearchBar] = useState(false)

  const history = useHistory()

  const onClickLogout = () => {
    Cookies.remove('jwtToken')
    history.replace('/login')
  }

  const onClickMenu = () => {
    setHamburgerIcon(prevState => !prevState)
    setMobileSearchBar(false)
  }

  const onClickSearch = () => {
    setMobileSearchBar(prev => !prev)
    setHamburgerIcon(prevState => !prevState)
  }

  const onChangeSearchInput = event => {
    setSearchInput(event.target.value)
  }

  const onClickSearchIcon = () => {
    updatedSearchInput(searchInput)
    if (searchInput !== '') {
      history.replace('/search-results')
    }
  }

  const onClickEnter = event => {
    if (event.key === 'Enter') {
      updatedSearchInput(searchInput)
      if (searchInput !== '') {
        history.replace('/search-results')
      }
    }
  }

  //   console.log(searchInput)

  return (
    <>
      <nav className="insta-nav-bar">
        <Link to="/" className="logo-section">
          <img
            src="https://res.cloudinary.com/dg14m0ern/image/upload/v1718973234/Standard_Collection_8_ikvoci.png"
            alt="logo"
            className="nav-logo"
          />
          <h1 className="logo-title">Insta Share</h1>
        </Link>
        <div className="insta-links">
          <div className="search-container">
            <input
              type="search"
              placeholder="Search Caption"
              className="search-box"
              value={searchInput}
              onChange={onChangeSearchInput}
              onKeyDown={onClickEnter}
            />
            <div className="search-icon-box">
              <FaSearch
                className="search-logo-icon"
                testid="searchIcon"
                onClick={onClickSearchIcon}
              />
            </div>
          </div>

          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/my-profile" className="nav-link">
            Profile
          </Link>
          <button type="button" className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
        </div>

        <IoMdMenu className="hamburger-icon" onClick={onClickMenu} />
      </nav>
      <div className="mobile-nav-section">
        {hamburgerIcon && (
          <div className="mobile-insta-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <button
              type="button"
              className="search-button"
              onClick={onClickSearch}
            >
              Search
            </button>
            <Link to="/my-profile" className="nav-link">
              Profile
            </Link>
            <button
              type="button"
              className="logout-btn"
              onClick={onClickLogout}
            >
              Logout
            </button>
            <IoMdCloseCircle className="close-icon" onClick={onClickMenu} />
          </div>
        )}
        {mobileSearchBar && (
          <div className="mobile-search-container">
            <input
              type="search"
              placeholder="Search Caption"
              className="search-box"
              value={searchInput}
              onChange={onChangeSearchInput}
              onKeyDown={onClickEnter}
            />
            <div className="search-icon-box">
              <FaSearch
                className="search-logo-icon"
                testid="searchIcon"
                onClick={onClickSearchIcon}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NavBar
