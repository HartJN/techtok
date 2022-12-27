import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { GoVerified } from 'react-icons/go'
import Image from 'next/image'
import Link from 'next/link'
import { BsFillPauseFill, BsFillPlayFill } from 'react-icons/bs'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'

import Comments from '../../components/Comments'
import { BASE_URL } from '../../utils'
import LikeButton from '../../components/LikeBtn'
import useAuthStore from '../../store/authStore'
import { Video } from '../../types'
import axios from 'axios'

interface IProps {
  postDetails: Video
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false)
  const [isPostingComment, setIsPostingComment] = useState<boolean>(false)
  const [comment, setComment] = useState<string>('')

  const [sideBar, setSideBar] = useState(
    document.querySelector('.sidebar-wrapper')
  )
  useEffect(() => {
    sideBar?.classList.add('hidden')
  }, [sideBar])

  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  const { userProfile }: any = useAuthStore()

  const onVideoClick = () => {
    if (isPlaying) {
      videoRef?.current?.pause()
      setIsPlaying(false)
    } else {
      videoRef?.current?.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (post && videoRef?.current) {
      videoRef.current.muted = isVideoMuted
    }
  }, [post, isVideoMuted])

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const res = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      })
      setPost({ ...post, likes: res.data.likes })
    }
  }

  const addComment = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (userProfile) {
      if (comment) {
        setIsPostingComment(true)
        const res = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
          userId: userProfile._id,
          comment,
        })

        setPost({ ...post, comments: res.data.comments })
        setComment('')
        setIsPostingComment(false)
      }
    }
  }

  return (
    <>
      {post && (
        <div className="details_container">
          <div className="details_video_overlay_close">
            <p className="details-back-btn" onClick={() => router.back()}>
              Back
            </p>
          </div>
          <div className="details-header">
            <div className="details_info_container-user">
              <Link href={`/profile/${post.postedBy._id}`}>
                <div className="details_info_container-user-profile">
                  <Image
                    width={60}
                    height={60}
                    alt="user-profile"
                    className="details_info_container-user-profile-img"
                    src={post.postedBy.image}
                  />
                  <div className="details_info_container-user-profile-info">
                    <div className="details_info_container-user-profile-info-name">
                      {post.postedBy.userName.replace(/\s+/g, '')}{' '}
                      <GoVerified className="details_info_container-user-profile-info-name-verified" />
                    </div>
                    {/* <p className="details_info_container-user-profile-info-username">
                          {' '}
                          {post.postedBy.userName}
                        </p> */}
                  </div>
                </div>
              </Link>
            </div>
            <div className="details_info_container-caption">
              <p className="details_info_container-caption-text">
                {post.caption}
              </p>
            </div>
          </div>
          <div className="details_video_container">
            <div className="details_video_overlay">
              <div className="details_video_overlay_video">
                <div className="details_video_overlay_video-wrapper">
                  <video
                    ref={videoRef}
                    onClick={onVideoClick}
                    loop
                    src={post?.video?.asset.url}
                    className="details_video_overlay_video-wrapper-vid"
                  ></video>
                  <div className="details_video_overlay_video-play">
                    {!isPlaying ? (
                      <button onClick={onVideoClick}>
                        <BsFillPlayFill className="details-video-play-icon" />
                      </button>
                    ) : (
                      <button onClick={onVideoClick}>
                        <BsFillPauseFill className="details-video-play-icon" />
                      </button>
                    )}
                  </div>
                  <div className="details_video_overlay_volume">
                    {isVideoMuted ? (
                      <button onClick={() => setIsVideoMuted(false)}>
                        <HiVolumeOff className="details-video-volume-icon" />
                      </button>
                    ) : (
                      <button onClick={() => setIsVideoMuted(true)}>
                        <HiVolumeUp className="details-video-volume-icon" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="details_info_container">
              <div className="details_info_container-likes">
                {userProfile && (
                  <LikeButton
                    likes={post.likes}
                    flex="flex"
                    handleLike={() => handleLike(true)}
                    handleDislike={() => handleLike(false)}
                  />
                )}
              </div>
              <Comments
                comment={comment}
                setComment={setComment}
                addComment={addComment}
                comments={post.comments}
                isPostingComment={isPostingComment}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const res = await axios.get(`${BASE_URL}/api/post/${id}`)

  return {
    props: { postDetails: res.data },
  }
}

export default Detail
