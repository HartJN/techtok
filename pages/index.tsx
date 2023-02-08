import React from 'react'
import axios from 'axios'

import Videos from '../components/Videos'
import { BASE_URL } from '../utils'
import { Video } from '../types'
import NoResults from '../components/EmptyResults'
import styles from '../styles/_home.module.scss'

interface IProps {
  videos: Video[]
}

const Home = ({ videos }: IProps) => {
  return (
    <div className={styles.home}>
      {videos.length ? (
        videos?.map((video: Video) => (
          <Videos post={video} isShowingOnHome key={video._id} />
        ))
      ) : (
        <NoResults text={`No Videos`} />
      )}
    </div>
  )
}

export default Home

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string }
}) => {
  let response = await axios.get(`${BASE_URL}/api/post`)

  if (topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`)
  }

  return {
    props: { videos: response.data },
  }
}
