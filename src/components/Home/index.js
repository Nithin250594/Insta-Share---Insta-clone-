import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import {IoIosWarning} from 'react-icons/io'

// import SearchContext from '../../context/SearchContext'

import NavBar from '../NavBar'
import PostCard from '../PostCard'

import './index.css'

const apiStatusStories = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiStatusPosts = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  networkFailure: 'NETWORK ISSUE',
}

const Home = () => {
  const [storyApiStatus, setStoryApiStatus] = useState(apiStatusStories.initial)
  const [postApiStatus, setPostApiStatus] = useState(apiStatusPosts.initial)
  const [storiesList, setStoriesList] = useState([])
  const [postsList, setPostsList] = useState([])

  const [retryStatus, setRetryStatus] = useState(false)
  const jwtToken = Cookies.get('jwtToken')

  const getStoriesList = storiesDetails => {
    const storiesDataList = storiesDetails.map(eachStory => ({
      userId: eachStory.user_id,
      userName: eachStory.user_name,
      storyUrl: eachStory.story_url,
    }))
    setStoriesList(storiesDataList)
  }

  const getPostsList = postsDetails => {
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

    setPostsList(postDataList)
  }

  useEffect(() => {
    setStoryApiStatus(apiStatusStories.inProgress)
    setPostApiStatus(apiStatusPosts.inProgress)
    const storiesApi = 'https://apis.ccbp.in/insta-share/stories'
    const storyOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const postsApi = 'https://apis.ccbp.in/insta-share/posts'
    const postOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const getStories = async () => {
      try {
        const storiesResponse = await fetch(storiesApi, storyOptions)
        const storiesData = await storiesResponse.json()
        if (storiesResponse.ok) {
          getStoriesList(storiesData.users_stories)
          setStoryApiStatus(apiStatusStories.success)
        }
      } catch (error) {
        console.error('Error during get stories API Call :', error)
        setStoryApiStatus(apiStatusStories.failure)
      }
    }

    const getPosts = async () => {
      try {
        const postsResponse = await fetch(postsApi, postOptions)
        const postsData = await postsResponse.json()
        if (postsResponse.ok) {
          getPostsList(postsData.posts)
          setPostApiStatus(apiStatusPosts.success)
        } else {
          setPostApiStatus(apiStatusPosts.failure)
        }
      } catch (error) {
        console.error('Error during get Posts API Call :', error)
        setPostApiStatus(apiStatusPosts.networkFailure)
      }
    }

    getStories()
    getPosts()
  }, [jwtToken, retryStatus])

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const loadingPage = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const storySuccessPage = () => (
    <div className="main-container">
      <div className="slick-container">
        <Slider {...settings}>
          {storiesList.map(eachStory => {
            const {userId, userName, storyUrl} = eachStory
            return (
              <Link
                to={`/users/${userId}`}
                className="slick-item user-story"
                key={userId}
              >
                <img className="logo-image" src={storyUrl} alt="user story" />
                <p className="user-name">{userName}</p>
              </Link>
            )
          })}
        </Slider>
      </div>
    </div>
  )

  const postSuccessPage = () => (
    <ul className="post-list-container">
      {postsList.map(eachPost => (
        <PostCard key={eachPost.postId} postInfo={eachPost} />
      ))}
    </ul>
  )

  const onClickRetry = () => {
    setRetryStatus(prev => !prev)
  }

  const postFailurePage = () => (
    <div className="error-view-container">
      <IoIosWarning className="alert-icon" />
      <h1 className="retry-text">Something went wrong. Please try again</h1>
      <button type="button" className="retry-button" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )

  const postNetworkFailure = () => (
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

  const switchStoryRender = () => {
    switch (storyApiStatus) {
      case apiStatusStories.inProgress:
        return loadingPage()
      case apiStatusStories.success:
        return storySuccessPage()
      default:
        return null
    }
  }

  const switchPostRender = () => {
    switch (postApiStatus) {
      case apiStatusPosts.inProgress:
        return loadingPage()
      case apiStatusPosts.success:
        return postSuccessPage()
      case apiStatusPosts.failure:
        return postFailurePage()
      case apiStatusPosts.networkFailure:
        return postNetworkFailure()
      default:
        return null
    }
  }

  return (
    <>
      <NavBar />
      <div className="home-bg">
        {switchStoryRender()} {switchPostRender()}
      </div>
    </>
  )
}

export default Home
