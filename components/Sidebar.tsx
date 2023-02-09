import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AiFillHome } from 'react-icons/ai'

import SuggestedAccounts from './SuggestedAccounts'
import DiscoverTopics from './DiscoverTopics'
import styles from '../styles/_sidebar.module.scss'

import useAuthStore from '../store/authStore'
const Sidebar: NextPage = () => {
  const [showSidebar, setShowSidebar] = useState<Boolean>(true)
  const { pathname } = useRouter()

  const { fetchAllUsers, allUsers }: any = useAuthStore()

  return (
    <>
      {showSidebar && (
        <div className={styles.sidebar}>
          <div className={styles.home}>
            <Link href="/">
              <div
                className={
                  pathname === '/' ? styles.activeLink : styles.normalLink
                }
              >
                <AiFillHome className={styles.homeSvg} />
                <span className={styles.heading}>Home</span>
              </div>
            </Link>
          </div>

          <DiscoverTopics />

          <SuggestedAccounts
            fetchAllUsers={fetchAllUsers}
            allUsers={allUsers}
          />
        </div>
      )}
    </>
  )
}

export default Sidebar
