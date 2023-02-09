import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { GoVerified } from 'react-icons/go'
import axios from 'axios'

import Videos from '../../components/Videos'
import NoResults from '../../components/EmptyResults'
import { User, Video } from '../../types'
import { BASE_URL } from '../../utils'

import styles from '../../styles/_profile.module.scss'

interface Props {
  data: {
    user: User
    userVideos: Video[]
    userLikedVideos: Video[]
  }
}

const Profile = ({ data }: Props) => {
  const [showUserVideos, setShowUserVideos] = useState<Boolean>(true)
  const [videosList, setVideosList] = useState<Video[]>([])

  const { user, userVideos, userLikedVideos } = data

  const videos = showUserVideos ? styles.videoCategory : styles.unVideoCategory
  const liked = !showUserVideos
    ? styles.likedVideoCategory
    : styles.unlikedVideoCategory

  useEffect(() => {
    const fetchVideos = async () => {
      if (showUserVideos) {
        setVideosList(userVideos)
      } else {
        setVideosList(userLikedVideos)
      }
    }

    fetchVideos()
  }, [showUserVideos, userLikedVideos, userVideos])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerImage}>
          <Image
            width={120}
            height={120}
            layout="responsive"
            className={styles.roundedFull}
            src={user.image}
            alt="user-profile"
          />
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.headerUserName}>
            <span>{user.userName.replace(/\s+/g, '')} </span>
            <GoVerified className={styles.verifiedIcon}> </GoVerified>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <p
            className={`${styles.contentHeaderTitle} ${videos}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={`${styles.contentHeaderTitle} ${liked}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>
        <div className={styles.contentList}>
          {videosList.length > 0 ? (
            videosList.map((post: Video, idx: number) => (
              <Videos key={idx} post={post} />
            ))
          ) : (
            <NoResults
              text={`No ${showUserVideos ? '' : 'Liked'} Videos Yet`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async ({
  params: { userId },
}: {
  params: { userId: string }
}) => {
  const res = await axios.get(`${BASE_URL}/api/profile/${userId}`)

  return {
    props: { data: res.data },
  }
}
export default Profile
