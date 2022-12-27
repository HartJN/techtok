import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { GoVerified } from 'react-icons/go'
import axios from 'axios'

import Videos from '../../components/Videos'
import NoResults from '../../components/EmptyResults'
import { IUser, Video } from '../../types'
import { BASE_URL } from '../../utils'

interface IProps {
  data: {
    user: IUser
    userVideos: Video[]
    userLikedVideos: Video[]
  }
}

const Profile = ({ data }: IProps) => {
  const [showUserVideos, setShowUserVideos] = useState<Boolean>(true)
  const [videosList, setVideosList] = useState<Video[]>([])

  const { user, userVideos, userLikedVideos } = data
  const videos = showUserVideos ? 'video-category' : 'un-video-category'
  const liked = !showUserVideos
    ? 'liked-video-category'
    : 'unliked-video-category'

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
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-image">
          <Image
            width={120}
            height={120}
            layout="responsive"
            className="rounded-full"
            src={user.image}
            alt="user-profile"
          />
        </div>
        <div className="profile-header-info">
          <div className="profile-header-user-name">
            <span>{user.userName.replace(/\s+/g, '')} </span>
            <GoVerified className="verified-icon"> </GoVerified>
          </div>
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-content-header">
          <p
            className={`profile-content-header-title ${videos}`}
            onClick={() => setShowUserVideos(true)}
          >
            Videos
          </p>
          <p
            className={`profile-content-header-title ${liked}`}
            onClick={() => setShowUserVideos(false)}
          >
            Liked
          </p>
        </div>
        <div className="profile-content-list">
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
