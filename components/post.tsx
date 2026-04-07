import styles from "../app/page.module.css";
import Link from 'next/link'
import type { Post as PostType } from '@/app/blogs/page'
import type { User } from '@supabase/supabase-js'
import { deletePost } from '@/app/auth/actions'

type PostWithProfile = PostType & {
    profiles: {
        id: string
        display_name: string | null
        app_role: string | null
    } | null
}

type PostProps = {
    post: PostWithProfile,
    user: User | null,
    currentUserProfile: { app_role: string | null } | null
}

export default function Post({ post, user, currentUserProfile }: PostProps) {
    const postTime = new Date(post.created_at).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <div className={styles.post}>
            <div className={styles.postImgContainer}>
                <img src={post.post_image} alt={post.post_game_name} />
            </div>
            <div className={styles.postDetails}>
                <p className={styles.postGameName}>{post.post_game_name}</p>
                <div className={styles.userInfo}>
                    <p>
                        Written By: <Link href={`/users/${post.user_id}`}>{post.profiles?.display_name}</Link>
                        {` (${post.profiles?.app_role})`}
                    </p>
                    <p>{postTime}</p>
                </div>
                <div className={styles.userScores}>
                    <p>Gameplay: {post.gameplay_rating}/10</p>
                    <p>Story: {post.story_rating}/10</p>
                    <p>Music: {post.music_rating}/10</p>
                    <p>Replayability: {post.replay_rating}/10</p>
                </div>
                {(user?.id === post.user_id || currentUserProfile?.app_role === 'Admin') &&
                <form action={deletePost.bind(null, post.id)}>
                    <button id={styles.deletePostBtn} type='submit'>DELETE</button>
                </form>}
            </div>
        </div>
    )
}