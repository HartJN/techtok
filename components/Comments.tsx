import React, { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GoVerified } from 'react-icons/go'
import styles from '../styles/_comments.module.scss'

import useAuthStore from '../store/authStore'
import NoResults from './EmptyResults'
import { User } from '../types'

interface Props {
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
}: Props) => {
  const { allUsers, userProfile }: any = useAuthStore()

  return (
    <div className={styles.comments_wrapper}>
      <div className={styles.comment_list}>
        {comments?.length > 0 ? (
          comments?.map((item: IComment, idx: number) => (
            <>
              {allUsers?.map(
                (user: User) =>
                  user._id === (item.postedBy._ref || item.postedBy._id) && (
                    <div className={styles.comment_item} key={idx}>
                      <Link href={`/profile/${user._id}`}>
                        <div className={styles.comment_author}>
                          <div className={styles.comment_author_image}>
                            <Image
                              width={48}
                              height={48}
                              className={styles.author_image}
                              src={user.image}
                              alt="user-profile"
                              layout="responsive"
                            />
                          </div>
                          <p className={styles.comment_author_name}>
                            {user.userName}{' '}
                            <GoVerified
                              className={styles.author_verified_icon}
                            />
                            :
                          </p>
                        </div>
                      </Link>
                      <div>
                        <p className={styles.comment_text}>{item.comment}</p>
                      </div>
                    </div>
                  )
              )}
            </>
          ))
        ) : (
          <NoResults text="No Comments Yet." />
        )}
      </div>
      {userProfile && (
        <div className={styles.add_comment_section}>
          <form onSubmit={addComment} className={styles.comment_form}>
            <input
              value={comment}
              onChange={e => setComment(e.target.value)}
              className={styles.comment_input}
              placeholder="Add comment.."
            />
            <button
              className={styles.comment_submit_button}
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
