import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'

import useAuthStore from '../store/authStore'
import NoResults from './EmptyResults'
import { IUser } from '../types'

interface IProps {
  isPostingComment: Boolean
  comment: string
  setComment: Dispatch<SetStateAction<string>>
  addComment: (e: React.FormEvent) => void
  comments: IComment[]
}

interface IComment {
  comment: string
  length?: number
  _key: string
  postedBy: { _ref?: string; _id?: string }
}

const Comments = ({
  comment,
  setComment,
  addComment,
  comments,
  isPostingComment,
}: IProps) => {
  const { allUsers, userProfile }: any = useAuthStore()

  return (
    <div className="comments-container">
      <div className="comments">
        {comments?.length > 0 ? (
          comments?.map((item: IComment, idx: number) => (
            <>
              {allUsers?.map(
                (user: IUser) =>
                  user._id === (item.postedBy._ref || item.postedBy._id) && (
                    <div className="comment" key={idx}>
                      <Link href={`/profile/${user._id}`}>
                        <div className="comment__user ">
                          <div className="comment__user__image">
                            <Image
                              width={48}
                              height={48}
                              className="comments_user-image"
                              src={user.image}
                              alt="user-profile"
                              layout="responsive"
                            />
                          </div>
                          <p className="comment__user__name">
                            {user.userName}{' '}
                            <GoVerified className="comment__user__name__verified" />
                          </p>
                        </div>
                      </Link>
                      <div>
                        <p className="comment__comment">{item.comment}</p>
                      </div>
                    </div>
                  )
              )}
            </>
          ))
        ) : (
          <NoResults text="No Comments Yet!." />
        )}
      </div>
      {userProfile && (
        <div className="comment__add-comment">
          <form onSubmit={addComment} className="comment__add-comment__form">
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="comment__add-comment__form__input "
              placeholder="Add comment.."
            />
            <button
              className="comment__add-comment__form__button"
              onClick={addComment}
            >
              {isPostingComment ? 'Commenting...' : 'Comment'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Comments
