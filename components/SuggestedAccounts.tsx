import React, { useEffect } from 'react'
import Image from 'next/image'
import { NextPage } from 'next'
import Link from 'next/link'

import { IUser } from '../types'

interface IProps {
  fetchAllUsers: () => void
  allUsers: IUser[]
}

const SuggestedAccounts: NextPage<IProps> = ({ fetchAllUsers, allUsers }) => {
  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  const users = allUsers
    .sort(() => 0.5 - Math.random())
    .slice(0, allUsers.length)

  return (
    <div className="suggested-accounts-container">
      <p className="sidebar-heading">Suggested accounts</p>
      <div>
        {users?.slice(0, 6).map((user: IUser) => (
          <Link href={`/profile/${user._id}`} key={user._id}>
            <div className="suggested-accounts-wrapper">
              <div className="suggested-accounts-image">
                <Image
                  width={34}
                  height={34}
                  className="rounded-full"
                  src={user.image}
                  alt="user-profile"
                  layout="responsive"
                />
              </div>

              <div className="suggested-accounts-info">
                <p className="sidebar-heading-su">
                  {user.userName.replace(/\s+/g, '')}{' '}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SuggestedAccounts
