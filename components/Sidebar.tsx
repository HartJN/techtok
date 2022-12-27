import React, { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AiFillHome } from 'react-icons/ai'

import SuggestedAccounts from './SuggestedAccounts'
import DiscoverTopics from './DiscoverTopics'

import useAuthStore from '../store/authStore'
const Sidebar: NextPage = () => {
  const [showSidebar, setShowSidebar] = useState<Boolean>(true)
  const { pathname } = useRouter()
  const { fetchAllUsers, allUsers }: any = useAuthStore()

  return (
    <>
      {showSidebar && (
        <div className="sidebar-navigation">
          <div className="sidebar-home">
            <Link href="/">
              <div className={pathname === '/' ? 'activeLink' : 'normalLink'}>
                <p>
                  <AiFillHome />
                </p>
                <span className="sidebar-heading">Home</span>
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
