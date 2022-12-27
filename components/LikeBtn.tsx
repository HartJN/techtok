import React, { useEffect, useState } from 'react'
import { MdFavorite } from 'react-icons/md'
import { NextPage } from 'next'

import useAuthStore from '../store/authStore'

interface IProps {
  likes: any
  flex: string
  handleLike: () => void
  handleDislike: () => void
}

const LikeButton: NextPage<IProps> = ({
  likes,
  flex,
  handleLike,
  handleDislike,
}) => {
  const [alreadyLiked, setAlreadyLiked] = useState(false)
  const { userProfile }: any = useAuthStore()
  let filterLikes = likes?.filter((item: any) => item._ref === userProfile?._id)

  useEffect(() => {
    if (filterLikes?.length > 0) {
      setAlreadyLiked(true)
    } else {
      setAlreadyLiked(false)
    }
  }, [filterLikes, likes])

  return (
    <div className={`${flex} like-button_container`}>
      <div className="like-button_icon-container">
        {alreadyLiked ? (
          <div
            className="like-button_icon like-button_icon--liked"
            onClick={handleDislike}
          >
            <MdFavorite className="like-button_icon-text" />
          </div>
        ) : (
          <div className="like-button_icon" onClick={handleLike}>
            <MdFavorite className="like-button_icon-text" />
          </div>
        )}
      </div>
      <p className="like-button_text">{likes?.length || 0}</p>
    </div>
  )
}

export default LikeButton
