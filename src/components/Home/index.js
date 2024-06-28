import {useEffect, useState} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import NavBar from '../NavBar'
import PostCard from '../PostCard'

import './index.css'

const Home = () => {
  const [storiesList, setStoriesList] = useState([])
  const [postsList, setPostsList] = useState([])
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
        }
      } catch (error) {
        console.error('Error during get stories API Call :', error)
      }
    }

    const getPosts = async () => {
      try {
        const postsResponse = await fetch(postsApi, postOptions)
        const postsData = await postsResponse.json()
        if (postsResponse.ok) {
          getPostsList(postsData.posts)
        }
      } catch (error) {
        console.error('Error during get Posts API Call :', error)
      }
    }

    getStories()
    getPosts()
  }, [jwtToken])

  console.log(storiesList)

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

  console.log(postsList)

  return (
    <>
      <NavBar />
      <div className="home-bg">
        <div className="main-container">
          <div className="slick-container">
            <Slider {...settings}>
              {storiesList.map(eachStory => {
                const {userId, userName, storyUrl} = eachStory
                return (
                  <div className="slick-item" key={userId}>
                    <img
                      className="logo-image"
                      src={storyUrl}
                      alt="company logo"
                    />
                    <p className="user-name">{userName}</p>
                  </div>
                )
              })}
            </Slider>
          </div>
        </div>
        <ul className="post-list-container">
          {postsList.map(eachPost => (
            <PostCard key={eachPost.postId} postInfo={eachPost} />
          ))}
        </ul>
      </div>
    </>
  )
}

export default Home
