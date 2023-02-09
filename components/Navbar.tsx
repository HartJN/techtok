import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LogoutIcon from '@mui/icons-material/Logout'
import { BiSearch } from 'react-icons/bi'
import { IoMdAdd } from 'react-icons/io'
import { GoogleLogin, googleLogout } from '@react-oauth/google'

import useAuthStore from '../store/authStore'
import { User } from '../types'
import { createOrGetUser } from '../utils'
import Logo from '../utils/user.png'
import styles from '../styles/_navbar.module.scss'

const Navbar = () => {
  const [user, setUser] = useState<User | null>()
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const { userProfile, addUser, removeUser } = useAuthStore()

  useEffect(() => {
    setUser(userProfile)
  }, [userProfile])

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (searchValue) {
      router.push(`/search/${searchValue}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Link href="/">
          <div className={styles.logo}>
            <Image
              className={styles.pointer}
              src={Logo}
              alt="logo"
              layout="responsive"
            />
          </div>
        </Link>
      </div>
      <div className={styles.middle}>
        <div className={styles.middleContainer}>
          <form onSubmit={handleSearch} className={styles.search}>
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className={styles.searchInput}
              placeholder="Search accounts and videos"
            />
            <button onClick={handleSearch} className={styles.searchBtn}>
              <BiSearch />
            </button>
          </form>
        </div>
      </div>
      <div className={styles.right}>
        {user ? (
          <div className={styles.user}>
            <Link href="/upload">
              <button className={styles.uploadBtn}>
                <IoMdAdd className={styles.uploadIcon} />
                <span className={styles.uploadText}>Upload</span>
              </button>
            </Link>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={() => {
                googleLogout()
                removeUser()
              }}
            >
              <LogoutIcon className={styles.logoutSvg} />
            </button>
            {user.image && (
              <Link href={`/profile/${user._id}`}>
                <Image
                  className={styles.userImage}
                  src={user.image}
                  alt="user"
                  width={40}
                  height={40}
                />
              </Link>
            )}
          </div>
        ) : (
          <GoogleLogin
            onSuccess={response => createOrGetUser(response, addUser)}
            onError={() => console.log('Login Failed')}
          />
        )}
      </div>
    </div>
  )
}
export default Navbar
