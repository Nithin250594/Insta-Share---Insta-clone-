import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoIosWarning} from 'react-icons/io'
import {GrGrid} from 'react-icons/gr'
import NavBar from '../NavBar'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  networkFailure: 'NETWORK ISSUE',
}

const MyProfile = () => {
  const [myProfileData, setMyProfileData] = useState([])
  const [myProfileStatus, setMyProfileStatus] = useState(apiStatus.initial)

  const [retryStatus, setRetryStatus] = useState(false)

  const getProfileData = profileData => {
    const myProfile = {
      followersCount: profileData.followers_count,
      followingCount: profileData.following_count,
      id: profileData.id,
      posts: profileData.posts.map(eachPost => ({
        id: eachPost.id,
        image: eachPost.image,
      })),
      postsCount: profileData.posts_count,
      profilePic: profileData.profile_pic,
      stories: profileData.stories.map(eachStory => ({
        id: eachStory.id,
        image: eachStory.image,
      })),
      userBio: profileData.user_bio,
      userId: profileData.user_id,
      userName: profileData.user_name,
    }

    setMyProfileData(myProfile)
  }

  const jwtToken = Cookies.get(`jwtToken`)

  useEffect(() => {
    setMyProfileStatus(apiStatus.inProgress)
    const myProfileAPI = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(myProfileAPI, options)
        const data = await response.json()
        if (response.ok) {
          getProfileData(data.profile)
          setMyProfileStatus(apiStatus.success)
        } else {
          setMyProfileStatus(apiStatus.failure)
        }
      } catch (error) {
        console.error('Error during get my profile API Call :', error)
        setMyProfileStatus(apiStatus.networkFailure)
      }
    }

    fetchProfileData()
  }, [jwtToken, retryStatus])

  console.log(myProfileData)

  const loadingPage = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const myProfileSuccess = () => (
    <>
      <div className="my-profile-details-section">
        <img
          src={myProfileData.profilePic}
          alt="my profile"
          className="my-profile-pic"
        />
        <div className="my-profile-text-section">
          <h1 className="my-profile-user-name">{myProfileData.userName}</h1>
          <div className="my-profile-post-followers-count-sec">
            <p className="my-profile-posts-count">
              <span className="span-count">{myProfileData.postsCount} </span>
              posts
            </p>
            <p className="my-profile-posts-count">
              <span className="span-count">
                {myProfileData.followersCount}{' '}
              </span>
              followers
            </p>
            <p className="my-profile-posts-count">
              <span className="span-count">
                {myProfileData.followingCount}{' '}
              </span>
              following
            </p>
          </div>
          <p className="p-user-name">{myProfileData.userName}</p>
          <p className="user-bio">{myProfileData.userBio}</p>
        </div>
      </div>
      <ul className="my-profile-stories-list">
        {myProfileData.stories.map(eachStory => (
          <li key={eachStory.id} className="story-card">
            <img
              src={eachStory.image}
              alt="my story"
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
        {myProfileData.posts.map(eachPost => (
          <li key={eachPost.id} className="my-profile-post-card">
            <img
              src={eachPost.image}
              alt="my post"
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

  const profileFailurePage = () => (
    <div className="error-view-container">
      <IoIosWarning className="alert-icon" />
      <h1 className="retry-text">Something went wrong. Please try again</h1>
      <button type="button" className="retry-button" onClick={onClickRetry}>
        Try Again
      </button>
    </div>
  )

  const profileNetworkFailure = () => (
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

  const switchProfileRender = () => {
    switch (myProfileStatus) {
      case apiStatus.inProgress:
        return loadingPage()
      case apiStatus.success:
        return myProfileSuccess()
      case apiStatus.failure:
        return profileFailurePage()
      case apiStatus.networkFailure:
        return profileNetworkFailure()
      default:
        return null
    }
  }

  return (
    <>
      <NavBar />
      <div className="my-profile-container">{switchProfileRender()}</div>
    </>
  )
}

export default MyProfile
