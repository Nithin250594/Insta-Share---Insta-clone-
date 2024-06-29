import {useHistory} from 'react-router-dom'
import './index.css'

const NotFound = () => {
  const history = useHistory()

  const onClickHomePage = () => {
    history.replace('/')
  }

  return (
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dg14m0ern/image/upload/v1719640924/Group_m1je8t.png"
        alt="page not found"
        className="not-found-image"
      />
      <h1 className="page-not-found-h1">Page Not Found</h1>
      <p className="page-not-found-p">
        we are sorry, the page you requested could not be found.Please go back
        to the homepage.
      </p>
      <button
        type="button"
        className="home-page-button"
        onClick={onClickHomePage}
      >
        Home Page
      </button>
    </div>
  )
}

export default NotFound
