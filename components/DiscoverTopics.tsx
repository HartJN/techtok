import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { topics } from '../utils/constants'

import styles from '../styles/_discoverTopics.module.scss'

const Discover = () => {
  const router = useRouter()
  const { topic } = router.query


  return (
    <div className={styles.container}>
      <p className={styles.heading}>Popular Topics</p>
      <div className={styles.topics}>
        {topics.map(item => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div
              className={
                topic === item.name
                  ? styles.activeTopicStyle
                  : styles.topicStyle
              }
            >
              <span className={styles.topicIcon}>{item.icon}</span>
              <span className={styles.sidebarHeading}>{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Discover
