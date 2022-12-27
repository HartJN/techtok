import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LogoutIcon from '@mui/icons-material/Logout'
import { BiSearch } from 'react-icons/bi'
import { IoMdAdd } from 'react-icons/io'
import { GoogleLogin, googleLogout } from '@react-oauth/google'

import useAuthStore from '../store/authStore'
import { IUser } from '../types'
import { createOrGetUser } from '../utils'
import Logo from '../utils/user.png'

const Navbar = () => {
  const [user, setUser] = useState<IUser | null>()
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
    <div className="navbar-container">
      <div className="navbar-left">
        <Link href="/">
          <div className="navbar-logo">
            <Image
              className="cursor-pointer"
              src={Logo}
              alt="logo"
              layout="responsive"
            />
          </div>
        </Link>
      </div>
      <div className="navbar-middle">
        <div className="navbar-middle-container">
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="navbar-search-input"
              placeholder="Search accounts and videos"
            />
            <button onClick={handleSearch} className="navbar-search-button">
              <BiSearch />
            </button>
          </form>
        </div>
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="navbar-user">
            <Link href="/upload">
              <button className="navbar-upload-button">
                <IoMdAdd className="navbar-upload-button-icon" />
                <span className="navbar-upload-button-text">Upload</span>
              </button>
            </Link>
            {user.image && (
              <Link href={`/profile/${user._id}`}>
                <div>
                  <Image
                    className="navbar-user-image"
                    src={user.image}
                    alt="user"
                    width={40}
                    height={40}
                  />
                </div>
              </Link>
            )}
            <button
              type="button"
              className="navbar-logout-button"
              onClick={() => {
                googleLogout()
                removeUser()
              }}
            >
              <LogoutIcon className="navbar-logout-svg" />
            </button>
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
