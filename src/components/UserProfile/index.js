import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {IoIosWarning} from 'react-icons/io'
import {GrGrid} from 'react-icons/gr'
import Cookies from 'js-cookie'
import NavBar from '../NavBar'

import './index.css'

const userProfileApiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  networkFailure: 'NETWORK ISSUE',
}

const UserProfile = () => {
  const [userApiStatus, setUserApiStatus] = useState(
    userProfileApiStatus.initial,
  )
  const [userProfile, setUserProfile] = useState()

  const [retryStatus, setRetryStatus] = useState(false)
  const params = useParams()
  const {id} = params

  const jwtToken = Cookies.get('jwtToken')

  const updateUserData = userDetails => {
    const updatedUserDetails = {
      followersCount: userDetails.followers_count,
      followingCount: userDetails.following_count,
      id: userDetails.id,
      posts: userDetails.posts.map(eachPost => ({
        id: eachPost.id,
        image: eachPost.image,
      })),
      postsCount: userDetails.posts_count,
      profilePic: userDetails.profile_pic,
      stories: userDetails.stories.map(eachStory => ({
        id: eachStory.id,
        image: eachStory.image,
      })),
      userBio: userDetails.user_bio,
      userId: userDetails.user_id,
      userName: userDetails.user_name,
    }

    setUserProfile(updatedUserDetails)
  }

  useEffect(() => {
    setUserApiStatus(userProfileApiStatus.inProgress)
    const userProfileAPI = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(userProfileAPI, options)
        const data = await response.json()
        if (response.ok) {
          updateUserData(data.user_details)
          setUserApiStatus(userProfileApiStatus.success)
        } else {
          setUserApiStatus(userProfileApiStatus.failure)
        }
      } catch (error) {
        console.error('Error while fetch User Profile API:', error)
        setUserApiStatus(userProfileApiStatus.networkFailure)
      }
    }

    fetchUserData()
  }, [jwtToken, id, retryStatus])

  const loadingPage = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const userProfileSuccess = () => (
    <>
      <div className="my-profile-details-section">
        <img
          src={userProfile.profilePic}
          alt="user profile"
          className="my-profile-pic"
        />
        <div className="my-profile-text-section">
          <h1 className="my-profile-user-name">{userProfile.userName}</h1>
          <div className="my-profile-post-followers-count-sec">
            <p className="my-profile-posts-count">
              <span className="span-count">{userProfile.postsCount} </span>
              posts
            </p>
            <p className="my-profile-posts-count">
              <span className="span-count">{userProfile.followersCount} </span>
              followers
            </p>
            <p className="my-profile-posts-count">
              <span className="span-count">{userProfile.followingCount} </span>
              following
            </p>
          </div>
          <p className="p-user-name">{userProfile.userName}</p>
          <p className="user-bio">{userProfile.userBio}</p>
        </div>
      </div>
      <ul className="my-profile-stories-list">
        {userProfile.stories.map(eachStory => (
          <li key={eachStory.id} className="story-card">
            <img
              src={eachStory.image}
              alt="user story"
              className="my-profile-story-image"
            />
          </li>
        ))}
      </ul>
      <hr className="separator" />
      <div className="my-posts-grid-title">
        <GrGrid className="grid-icon" />
        <h1 className="my-post-text">Posts</h1>
      </div>
      <ul className="my-profile-post-list">
        {userProfile.posts.map(eachPost => (
          <li key={eachPost.id} className="my-profile-post-card">
            <img
              src={eachPost.image}
              alt="user post"
              className="my-profile-post-image"
            />
          </li>
        ))}
      </ul>
    </>
  )

  const onClickRetry = () => {
    setRetryStatus(prev => !prev)
  }

  const userProfileFailure = () => (
    <div className="error-view-container">
      <IoIosWarning className="alert-icon" />
      <h1 className="retry-text">Something went wrong. Please try again</h1>
      <button type="button" className="retry-button" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )

  const userProfileNetworkFailure = () => {
    ;<div className="error-view-container">
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
  }

  const switchUserProfileRender = () => {
    switch (userApiStatus) {
      case userProfileApiStatus.inProgress:
        return loadingPage()
      case userProfileApiStatus.success:
        return userProfileSuccess()
      case userProfileApiStatus.failure:
        return userProfileFailure()
      case userProfileApiStatus.networkFailure:
        return userProfileNetworkFailure()
      default:
        return null
    }
  }

  return (
    <>
      <NavBar />
      <div className="my-profile-container">{switchUserProfileRender()}</div>
    </>
  )
}

export default UserProfile
