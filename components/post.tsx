import styles from "../app/page.module.css";
import Image from 'next/image'
import Form from 'next/form'
import type { Post } from '@/app/blogs/page'
import { Game, getDailyGame } from '@/utils/daily-game'
import { getUser, deletePost } from '@/app/auth/actions'


type PostProps = {
    post: Post
}

export default async function Post({ post }: PostProps) {

    const user = await getUser()
    const postTime = new Date(post.created_at).toLocaleString('en-US', {
        month: 'long',     // March
        day: 'numeric',    // 24
        year: 'numeric',   // 2026
        hour: 'numeric',   // 2 PM
        minute: '2-digit', // 30
        hour12: true       // AM/PM format
    })

    return (
        <div className={styles.post}>
            <div className={styles.postImgContainer}>
                <Image src={post.post_image} alt="placeholder-img" height={300} width={350} />
            </div>
            <div className={styles.postDetails}>
                <p>Gameplay: {post.gameplay_rating}</p>
                <p>Story: {post.story_rating}</p>
                <p>Music: {post.music_rating}</p>
                <p>Replayability: {post.replay_rating}</p>
            </div>
            <p>Written By: {post.user_display_name} ({post.user_role})</p>
            <p>{postTime}</p>
            {user?.id === post.user_id && <button>DELETE</button>}
            {/* THIS LOGIC IS WORKING, JUST NEED TO ADD FUNCTIONALITY TO THE BUTTON */}
        </div>
    )
}