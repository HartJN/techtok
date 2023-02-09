import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GoVerified } from 'react-icons/go'
import Link from 'next/link'
import axios from 'axios'

import EmptyResults from '../../components/EmptyResults'
import Videos from '../../components/Videos'
import useAuthStore from '../../store/authStore'
import { BASE_URL } from '../../utils'
import { User, Video } from '../../types'

import styles from '../../styles/_search.module.scss'

const Search = ({ videos }: { videos: Video[] }) => {
  const [isAccounts, setIsAccounts] = useState(false)
  const { allUsers }: { allUsers: User[] } = useAuthStore()

  const router = useRouter()
  const { searchTerm }: any = router.query

  const accounts = isAccounts ? styles.tabsAccountsActive : ''
  const isVideos = !isAccounts ? styles.tabsVideosActive : ''
  const searchedAccounts = allUsers?.filter((user: User) =>
    user.userName.toLowerCase().includes(searchTerm)
  )

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <p
          onClick={() => setIsAccounts(true)}
          className={`${styles.tabsAccounts} ${accounts}`}
        >
          Accounts
        </p>
        <p
          className={`${styles.tabsVideos} ${isVideos}`}
          onClick={() => setIsAccounts(false)}
        >
          Videos
        </p>
      </div>
      {isAccounts ? (
        <div className={styles.accounts}>
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: User, idx: number) => (
              <Link key={idx} href={`/profile/${user._id}`}>
                <div className={styles.accountsItem}>
                  <Image
                    width={50}
                    height={50}
                    className={styles.img}
                    alt="user-profile"
                    src={user.image}
                  />

                  <p className={styles.name}>
                    {user.userName} <GoVerified className={styles.verified} />
                  </p>
                  {/* <p className={styles.username}>{user.userName}</p> */}
                </div>
              </Link>
            ))
          ) : (
            <div className={styles.resultsMsg}>
              {' '}
              <EmptyResults text={`No Account Results for ${searchTerm}`} />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.videos}>
          {videos.length ? (
            videos.map((post: Video, idx: number) => (
              <Videos post={post} key={idx} />
            ))
          ) : (
            <EmptyResults text={`No Video Results for ${searchTerm}`} />
          )}
        </div>
      )}
    </div>
  )
}

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string }
}) => {
  const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

  return {
    props: { videos: res.data },
  }
}

export default Search
