import React from 'react'
import { MdOutlineVideocamOff } from 'react-icons/md'

interface IProps {
  text: string
}

const NoResults = ({ text }: IProps) => {
  return (
    <div className="no-results">
      <p className="no-results__icon">
        <MdOutlineVideocamOff />
      </p>
      <p className="no-results__text">{text}</p>
    </div>
  )
}

export default NoResults
