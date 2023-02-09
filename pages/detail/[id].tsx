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

import styles from '../../styles/_details.module.scss'

interface Props {
  postDetails: Video
}

const Detail = ({ postDetails }: Props) => {
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
        <div className={styles.detailsContainer}>
          <div className={styles.detailsOverlayClose}>
            <p className={styles.backBtn} onClick={() => router.back()}>
              Back
            </p>
          </div>
          <div className={styles.header}>
            <div className={styles.userInfo}>
              <Link href={`/profile/${post.postedBy._id}`}>
                <div className={styles.userProfile}>
                  <Image
                    width={60}
                    height={60}
                    alt="user-profile"
                    className={styles.userProfileImg}
                    src={post.postedBy.image}
                  />
                  <div className={styles.userProfileInfo}>
                    <div className={styles.userProfileInfoName}>
                      {post.postedBy.userName.replace(/\s+/g, '')}
                      <GoVerified
                        className={styles.userProfileInfoNameVerified}
                      />
                    </div>
                    <div className={styles.caption}>
                      <p className={styles.captionText}>{post.caption}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.videoContainer}>
            <div className={styles.videoOverlay}>
              <video
                ref={videoRef}
                onClick={onVideoClick}
                loop
                src={post?.video?.asset.url}
                className={styles.video}
              ></video>
              <div className={styles.videoControls}>
                {!isPlaying ? (
                  <button onClick={onVideoClick}>
                    <BsFillPlayFill className={styles.videoPlayIcon} />
                  </button>
                ) : (
                  <button onClick={onVideoClick}>
                    <BsFillPauseFill className={styles.videoPlayIcon} />
                  </button>
                )}

                {isVideoMuted ? (
                  <button onClick={() => setIsVideoMuted(false)}>
                    <HiVolumeOff className={styles.videoVolumeIcon} />
                  </button>
                ) : (
                  <button onClick={() => setIsVideoMuted(true)}>
                    <HiVolumeUp className={styles.videoVolumeIcon} />
                  </button>
                )}
              </div>
            </div>
            <div className={styles.info}>
              <Comments
                comment={comment}
                setComment={setComment}
                addComment={addComment}
                comments={post.comments}
                isPostingComment={isPostingComment}
              />
              <div className={styles.likes}>
                {userProfile && (
                  <LikeButton
                    likes={post.likes}
                    flex="flex"
                    handleLike={() => handleLike(true)}
                    handleDislike={() => handleLike(false)}
                  />
                )}
              </div>
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
