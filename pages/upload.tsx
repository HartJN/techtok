import React, { useEffect, useState } from 'react'
import { SanityAssetDocument } from '@sanity/client'
import { useRouter } from 'next/router'
import axios from 'axios'

import useAuthStore from '../store/authStore'
import { BASE_URL } from '../utils'
import { client } from '../utils/client'
import { topics } from '../utils/constants'
import styles from '../styles/_upload.module.scss'

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.title}>Upload Video</p>

        <div className={styles.border}>
          {loading ? (
            <p className={styles.loading}>Uploading...</p>
          ) : (
            <>
              {!videoAsset ? (
                <label className={styles.label}>
                  <div className={styles.fileType}>
                    <div className={styles.fileTypeTitle}>
                      <p className={styles.fileTypeP1}>
                        Select video to upload
                      </p>
                    </div>

                    <p className={styles.fileTypeP3}>Select file</p>
                    <label className={styles.form}>
                      Browse..
                      <input
                        type="file"
                        name="upload-video"
                        onChange={e => uploadVideo(e)}
                        className={styles.input}
                      />
                    </label>
                  </div>
                </label>
              ) : (
                <div className={styles.uploadedVideo}>
                  <video
                    className={styles.uploadedVideoVideo}
                    controls
                    loop
                    src={videoAsset?.url}
                  />
                  <div className={styles.uploadedVideoStats}>
                    <p className={styles.uploadedVideoFilename}>
                      {videoAsset.originalFilename}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {wrongFileType && (
          <p className={styles.wrong}>
            Please select an video file (mp4 or webm or ogg)
          </p>
        )}
      </div>
      <div className={styles.form}>
        <label className={styles.label}>Caption</label>
        <input
          type="text"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          className={styles.input}
        />
        <label className={styles.label}>Choose a topic</label>
        <select
          onChange={e => {
            setTopic(e.target.value)
          }}
          className={styles.select}
        >
          {topics.map(item => (
            <option key={item.name} className={styles.option} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <div className={styles.buttons}>
          <button
            disabled={videoAsset?.url ? false : true}
            onClick={handlePost}
            type="button"
            className={styles.postButton}
          >
            {savingPost ? 'Posting...' : 'Post'}
          </button>
          <button
            onClick={handleDiscard}
            type="button"
            className={styles.discardButton}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Upload
