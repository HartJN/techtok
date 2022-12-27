import React, { useEffect, useState } from 'react'
import { SanityAssetDocument } from '@sanity/client'
import { useRouter } from 'next/router'
import axios from 'axios'

import useAuthStore from '../store/authStore'
import { BASE_URL } from '../utils'
import { client } from '../utils/client'
import { topics } from '../utils/constants'

const Upload = () => {
  const [caption, setCaption] = useState('')
  const [topic, setTopic] = useState<String>(topics[0].name)
  const [loading, setLoading] = useState<Boolean>(false)
  const [savingPost, setSavingPost] = useState<Boolean>(false)
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >()
  const [wrongFileType, setWrongFileType] = useState<Boolean>(false)

  const userProfile: any = useAuthStore(state => state.userProfile)
  const router = useRouter()

  useEffect(() => {
    if (!userProfile) router.push('/')
  }, [userProfile, router])

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0]
    const fileTypes = ['video/mp4', 'video/webm', 'video/ogg']

    // uploading asset to sanity
    if (fileTypes.includes(selectedFile.type)) {
      setWrongFileType(false)
      setLoading(true)

      client.assets
        .upload('file', selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then(data => {
          setVideoAsset(data)
          setLoading(false)
        })
    } else {
      setLoading(false)
      setWrongFileType(true)
    }
  }

  const handlePost = async () => {
    if (caption && videoAsset?._id && topic) {
      setSavingPost(true)

      const doc = {
        _type: 'post',
        caption,
        video: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: userProfile?._id,
        },
        topic,
      }

      await axios.post(`${BASE_URL}/api/post`, doc)

      router.push('/')
    }
  }

  const handleDiscard = () => {
    setSavingPost(false)
    setVideoAsset(undefined)
    setCaption('')
    setTopic('')
  }

  return (
    <div className="upload-container">
      <div className="upload-wrapper">
        <p className="upload-upload-title">Upload Video</p>

        <div className="upload-upload-border">
          {loading ? (
            <p className="upload-upload-loading">Uploading...</p>
          ) : (
            <>
              {!videoAsset ? (
                <label className="upload-upload-label">
                  <div className="upload-upload-file-type">
                    <div className="upload-upload-file-type-title">
                      <p className="upload-upload-file-type-p1">
                        Select video to upload
                      </p>
                    </div>

                    <p className="upload-upload-file-type--p3">Select file</p>
                    <label className="upload-form">
                      Browse..
                      <input
                        type="file"
                        name="upload-video"
                        onChange={e => uploadVideo(e)}
                        className="upload-upload-input"
                      />
                    </label>
                  </div>
                </label>
              ) : (
                <div className="upload-uploaded-video">
                  <video
                    className="upload-uploaded-video--video"
                    controls
                    loop
                    src={videoAsset?.url}
                  />
                  <div className="upload-uploaded-video--stats">
                    <p className="upload-uploaded-video--stats--filename">
                      {videoAsset.originalFilename}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {wrongFileType && (
          <p className="upload-upload-wrong">
            Please select an video file (mp4 or webm or ogg)
          </p>
        )}
      </div>
      <div className="upload-upload-form">
        <label className="upload-upload-form--label">Caption</label>
        <input
          type="text"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          className="upload-upload-form--input"
        />
        <label className="upload-upload-form--label">Choose a topic</label>
        <select
          onChange={e => {
            setTopic(e.target.value)
          }}
          className="upload-upload-form--select"
        >
          {topics.map(item => (
            <option
              key={item.name}
              className="upload-upload-form--option"
              value={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
        <div className="upload-upload-form--buttons">
          <button
            disabled={videoAsset?.url ? false : true}
            onClick={handlePost}
            type="button"
            className="upload-upload-form--button--post"
          >
            {savingPost ? 'Posting...' : 'Post'}
          </button>
          <button
            onClick={handleDiscard}
            type="button"
            className="upload-upload-form--button--discard"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Upload
