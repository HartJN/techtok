import React, { useEffect, useState } from 'react'
import { MdFavorite } from 'react-icons/md'
import { NextPage } from 'next'
import styles from '../styles/_likeBtn.module.scss'

import useAuthStore from '../store/authStore'

interface Props {
  likes: any
  flex: string
  handleLike: () => void
  handleDislike: () => void
}

const LikeButton: NextPage<Props> = ({
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
    <div className={`${flex} ${styles.container}`}>
      <div className={styles.iconWrapper}>
        {alreadyLiked ? (
          <div
            className={`${styles.icon} ${styles.iconLiked}`}
            onClick={handleDislike}
          >
            <MdFavorite className={styles.likeBtnText} />
          </div>
        ) : (
          <div className={styles.icon} onClick={handleLike}>
            <MdFavorite className={styles.likeBtnText} />
          </div>
        )}
      </div>
      <p className={styles.likeText}>{likes?.length || 0}</p>
    </div>
  )
}

export default LikeButton
