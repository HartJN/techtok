import React, { useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'
import { BsPlay } from 'react-icons/bs'
import styles from '../styles/_Videos.module.scss'

import { Video } from './../types'

interface Props {
  post: Video
  isShowingOnHome?: boolean
}

const VideoCard: NextPage<Props> = ({
  post: { caption, postedBy, video, _id, likes },
  isShowingOnHome,
}) => {
  const [playing, setPlaying] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause()
      setPlaying(false)
    } else {
      videoRef?.current?.play()
      setPlaying(true)
    }
  }

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted
    }
  }, [isVideoMuted])

  if (!isShowingOnHome) {
    return (
      <div className={styles.notHome}>
        <Link href={`/detail/${_id}`}>
          <p className={styles.caption}>{caption}</p>
        </Link>
        <Link href={`/detail/${_id}`}>
          <video
            loop
            src={video.asset.url}
            className={styles.thumbnail}
          ></video>
        </Link>
        <div className={styles.likesContainer}>
          <p className={styles.text}>
            <BsPlay className={styles.playIcon} />
            {likes?.length || 0}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerAvatar}>
          <Link href={`/profile/${postedBy?._id}`}>
            <Image
              width={62}
              height={62}
              className={styles.headerAvatarImg}
              src={postedBy?.image}
              alt="user-profile"
              layout="responsive"
            />
          </Link>

          <div className={styles.details}>
            <Link href={`/profile/${postedBy?._id}`}>
              <div className={styles.headerInfo}>
                <p className={styles.headerInfoName}>
                  {postedBy.userName}{' '}
                  <GoVerified className={styles.headerInfoVerified} />
                </p>
              </div>
            </Link>
            <Link href={`/detail/${_id}`}>
              <p className={styles.headerCaption}>{caption}</p>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className={styles.video}
        >
          <Link href={`/detail/${_id}`}>
            <video
              loop
              ref={videoRef}
              src={video.asset.url}
              className={styles.videoVideo}
            ></video>
          </Link>
          {isHover && (
            <>
              <div className={styles.videoControls}>
                {isVideoMuted ? (
                  <button onClick={() => setIsVideoMuted(false)}>
                    <HiVolumeOff className={styles.videoControlsUnmute} />
                  </button>
                ) : (
                  <button onClick={() => setIsVideoMuted(true)}>
                    <HiVolumeUp className={styles.videoControlsMute} />
                  </button>
                )}
                {/* </div> */}
                {!playing ? (
                  <button onClick={onVideoPress}>
                    <BsFillPlayFill className={styles.videoControlsPause} />
                  </button>
                ) : (
                  <button onClick={onVideoPress}>
                    <BsFillPauseFill className={styles.videoControlsPlay} />
                  </button>
                )}
                {/* </div> */}
                {/* <div className={styles.videoControlsVolume}> */}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCard
