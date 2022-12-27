import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { topics } from '../utils/constants'

const Discover = () => {
  const router = useRouter()
  const { topic } = router.query

  return (
    <div className="discover-container">
      <p className="sidebar-heading">Popular Topics</p>
      <div className="topics-container">
        {topics.map(item => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div
              className={
                topic === item.name ? 'activeTopicStyle' : 'topicStyle'
              }
            >
              <span className="discover_topic-icon">{item.icon}</span>
              <span className="sidebar-heading">{item.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Discover
