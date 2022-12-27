import React, { useEffect, useRef, useState } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { BsFillPlayFill, BsFillPauseFill } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'
import { BsPlay } from 'react-icons/bs'

import { Video } from './../types'

interface IProps {
  post: Video
  isShowingOnHome?: boolean
}

const VideoCard: NextPage<IProps> = ({
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
      <div className="not-home">
        <Link href={`/detail/${_id}`}>
          <p className="caption-text">{caption}</p>
        </Link>
        <Link href={`/detail/${_id}`}>
          <video loop src={video.asset.url} className="video-thumbnail"></video>
        </Link>
        <div className="likes-container">
          <p className="likes-text">
            <BsPlay className="play-icon" />
            {likes?.length || 0}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="video-card_container">
      <div className="video-card_header">
        <div className="video-card_header__avatar">
          <Link href={`/profile/${postedBy?._id}`}>
            <>
              <Image
                width={62}
                height={62}
                className=" video-card_header__avatar-img"
                src={postedBy?.image}
                alt="user-profile"
                layout="responsive"
              />
            </>
          </Link>

          <div className="video-details">
            <Link href={`/profile/${postedBy?._id}`}>
              <div className="video-card_header__info">
                <p className="video-card_header__info-name">
                  {postedBy.userName}{' '}
                  <GoVerified className="video-card_header__info-verified" />
                </p>
              </div>
            </Link>
            <Link href={`/detail/${_id}`}>
              <p className="video-card_header__caption">{caption}</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="video-card_body">
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="video-card_body__video"
        >
          <Link href={`/detail/${_id}`}>
            <video
              loop
              ref={videoRef}
              src={video.asset.url}
              className="video-card_body__video-video"
            ></video>
          </Link>

          {isHover && (
            <>
              <div className="video-card_body__video-controls">
                {!playing ? (
                  <button onClick={onVideoPress}>
                    <BsFillPlayFill className="video-card_body__video-controls-pause" />
                  </button>
                ) : (
                  <button onClick={onVideoPress}>
                    <BsFillPauseFill className="video-card_body__video-controls-play" />
                  </button>
                )}
              </div>
              <div className="video-card_body__video-controls-volume">
                {isVideoMuted ? (
                  <button onClick={() => setIsVideoMuted(false)}>
                    <HiVolumeOff className="video-card_body__video-controls-unmute" />
                  </button>
                ) : (
                  <button onClick={() => setIsVideoMuted(true)}>
                    <HiVolumeUp className="video-card_body__video-controls-mute" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoCard
