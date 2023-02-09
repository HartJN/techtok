import React, { useEffect } from 'react'
import Image from 'next/image'
import { NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/_SuggestedAccounts.module.scss'

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
    <div className={styles.container}>
      <p className={styles.sidebarHeading}>Suggested accounts</p>

      {users?.slice(0, 6).map((user: IUser) => (
        <Link href={`/profile/${user._id}`} key={user._id}>
          <div className={styles.wrapper}>
            <div className={styles.image}>
              <Image
                width={34}
                height={34}
                className={styles.roundedFull}
                src={user.image}
                alt="user-profile"
                layout="responsive"
              />
            </div>
            <div className={styles.info}>
              <p className={styles.sidebarHeadingSu}>
                {user.userName.replace(/\s+/g, '')}{' '}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
export default SuggestedAccounts
