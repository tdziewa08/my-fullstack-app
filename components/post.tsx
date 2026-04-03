import styles from "../app/page.module.css";
import type { Post as PostType, Profile as ProfileType } from '@/app/blogs/page'
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
                <img src={post.post_image} alt="placeholder-img" />
            </div>
            <div className={styles.postDetails}>
                <div className={styles.userDetails}>
                    <p>Written By: {post.profiles?.display_name}({post.profiles?.app_role})</p>
                    <p>{postTime}</p>
                </div>
                <p>Gameplay: {post.gameplay_rating}/10</p>
                <p>Story: {post.story_rating}/10</p>
                <p>Music: {post.music_rating}/10</p>
                <p>Replayability: {post.replay_rating}/10</p>
                {(user?.id === post.user_id || currentUserProfile?.app_role === 'Admin') &&
                <form action={deletePost.bind(null, post.id)}>
                    <button id={styles.deletePostBtn} type='submit'>DELETE</button>
                </form>}
            </div>
        </div>
    )
}