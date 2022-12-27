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
import { IUser, Video } from '../../types'

const Search = ({ videos }: { videos: Video[] }) => {
  const [isAccounts, setIsAccounts] = useState(false)
  const { allUsers }: { allUsers: IUser[] } = useAuthStore()

  const router = useRouter()
  const { searchTerm }: any = router.query

  const accounts = isAccounts ? 'search-tabs-accounts--active' : ''
  const isVideos = !isAccounts ? 'search-tabs-videos--active' : ''
  const searchedAccounts = allUsers?.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm)
  )

  return (
    <div className="search-container">
      <div className="search-tabs">
        <p
          onClick={() => setIsAccounts(true)}
          className={`search-tabs-accounts ${accounts}`}
        >
          Accounts
        </p>
        <p
          className={`search-tabs-videos ${isVideos}`}
          onClick={() => setIsAccounts(false)}
        >
          Videos
        </p>
      </div>
      {isAccounts ? (
        <div className="search-accounts">
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, idx: number) => (
              <Link key={idx} href={`/profile/${user._id}`}>
                <div className="search-accounts-item">
                  <Image
                    width={50}
                    height={50}
                    className="accounts-img"
                    alt="user-profile"
                    src={user.image}
                  />

                  <p className="accounts-name">
                    {user.userName} <GoVerified className="accounts-verified" />
                  </p>
                  <p className="accounts-username">{user.userName}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="search-results-msg">
              {' '}
              <EmptyResults text={`No Account Results for ${searchTerm}`} />
            </div>
          )}
        </div>
      ) : (
        <div className="search-videos">
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
