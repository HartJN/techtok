import React from 'react'
import { MdOutlineVideocamOff } from 'react-icons/md'
import styles from '../styles/_noResults.module.scss'
interface Props {
  text: string
}

const NoResults = ({ text }: Props) => {
  return (
    <div className={styles.noResults}>
      <p className={styles.icon}>
        <MdOutlineVideocamOff />
      </p>
      <p className={styles.text}>{text}</p>
    </div>
  )
}

export default NoResults
