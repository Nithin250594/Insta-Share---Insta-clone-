import {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoIosWarning} from 'react-icons/io'
import NavBar from '../NavBar'
import SearchContext from '../../context/SearchContext'

import PostCard from '../PostCard'

import './index.css'

const apiSearchPosts = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  networkFailure: 'NETWORK ISSUE',
}

const SearchedPosts = () => {
  const {searchInput} = useContext(SearchContext)
  const [searchPostApiStatus, setSearchPostApiStatus] = useState(
    apiSearchPosts.initial,
  )
  const [searchData, setSearchData] = useState([])

  const [retryStatus, setRetryStatus] = useState(false)

  const jwtToken = Cookies.get('jwtToken')

  const getSearchList = postsDetails => {
    const postDataList = postsDetails.map(eachPost => ({
      postId: eachPost.post_id,
      userId: eachPost.user_id,
      userName: eachPost.user_name,
      profilePic: eachPost.profile_pic,
      postDetails: {
        imageUrl: eachPost.post_details.image_url,
        caption: eachPost.post_details.caption,
      },
      likesCount: eachPost.likes_count,
      comments: eachPost.comments.map(eachComment => ({
        userName: eachComment.user_name,
        userId: eachComment.user_id,
        comment: eachComment.comment,
      })),
      createdAt: eachPost.created_at,
    }))

    setSearchData(postDataList)
  }

  useEffect(() => {
    setSearchPostApiStatus(apiSearchPosts.inProgress)
    const searchPostsAPI = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const getSearchResults = async () => {
      try {
        const response = await fetch(searchPostsAPI, options)
        const data = await response.json()

        if (response.ok) {
          getSearchList(data.posts)
          setSearchPostApiStatus(apiSearchPosts.success)
        } else {
          setSearchPostApiStatus(apiSearchPosts.failure)
        }
      } catch (error) {
        console.error('Error while fetching search API:', error)
        setSearchPostApiStatus(apiSearchPosts.networkFailure)
      }
    }

    getSearchResults()
  }, [jwtToken, searchInput, retryStatus])

  const loadingPage = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const searchSuccessPage = () => (
    <>
      {searchData.length > 0 ? (
        <>
          <h1 className="searched-results-title">Searched Results </h1>
          <ul className="search-list-container">
            {searchData.map(eachPost => (
              <PostCard key={eachPost.postId} postInfo={eachPost} />
            ))}
          </ul>
        </>
      ) : (
        <div className="error-view-container">
          <img
            src="https://res.cloudinary.com/dg14m0ern/image/upload/v1719749366/Group_1_dw4ogc.png"
            alt="Search Not Found"
            className="search-not-imagee"
          />
          <h1 className="search-again-heading">Search Not Found</h1>
          <p className="search-again-text">
            Try different keyword or search again
          </p>
        </div>
      )}
    </>
  )

  const onClickRetry = () => {
    setRetryStatus(prev => !prev)
  }

  const searchFailurePage = () => (
    <div className="error-view-container">
      <IoIosWarning className="alert-icon" />
      <h1 className="retry-text">Something went wrong. Please try again</h1>
      <button type="button" className="retry-button" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )

  const searchNetworkFailure = () => (
    <div className="error-view-container">
      <img
        src="https://res.cloudinary.com/dg14m0ern/image/upload/v1719642236/Group_7522_jwwoel.png"
        alt="network failure"
        className="network-failure-image"
      />
      <h1 className="retry-text">Something went wrong. Please try again</h1>
      <button type="button" className="retry-button" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )

  const switchSearchRender = () => {
    switch (searchPostApiStatus) {
      case apiSearchPosts.inProgress:
        return loadingPage()
      case apiSearchPosts.success:
        return searchSuccessPage()
      case apiSearchPosts.failure:
        return searchFailurePage()
      case apiSearchPosts.networkFailure:
        return searchNetworkFailure()
      default:
        return null
    }
  }

  return (
    <>
      <NavBar />
      <div className="home-bg">{switchSearchRender()}</div>
    </>
  )
}

export default SearchedPosts
