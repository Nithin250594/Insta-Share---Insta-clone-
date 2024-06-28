import {useState} from 'react'
import {BsHeart, BsChat} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {IoMdShare} from 'react-icons/io'
import './index.css'

const PostCard = props => {
  const [isLiked, setLikedStatus] = useState(false)
  const {postInfo} = props
  const {
    postId,
    userId,
    userName,
    profilePic,
    postDetails,
    likesCount,
    createdAt,
  } = postInfo
  const {imageUrl, caption} = postDetails

  const onClickLike = () => {
    setLikedStatus(prev => !prev)
  }

  return (
    <li className="post-card" key={postId}>
      <div className="profile-section">
        <img
          src={profilePic}
          alt="post author profile"
          className="profile-pic"
        />
        <p className="profile-user-name">{userName}</p>
      </div>
      <img src={imageUrl} alt="post" className="post-image" />
      <div className="like-chat-share-section">
        {isLiked ? (
          <button
            type="button"
            className="like-button"
            onClick={onClickLike}
            aria-label="unLikeIcon"
          >
            <FcLike className="fcLike-symbol" />
          </button>
        ) : (
          <button
            type="button"
            className="like-button"
            onClick={onClickLike}
            aria-label="likeIcon"
          >
            <BsHeart className="lcs-symbol" />
          </button>
        )}

        <BsChat className="lcs-symbol" />
        <IoMdShare className="lcs-symbol" />
      </div>
      <p className="likes-count">{likesCount} Likes</p>
      <p className="post-caption">{caption}</p>
      <p className="post-created">{createdAt}</p>
    </li>
  )
}

export default PostCard
