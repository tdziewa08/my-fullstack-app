import styles from "../page.module.css";
import PostsList, { PostsListFallback } from "../../components/PostsList"
import { Suspense } from 'react'

export type Post = {
  id: number,
  created_at: string,
  gameplay_rating: number,
  story_rating: number,
  music_rating: number,
  replay_rating: number,
  user_id: string,
  user_display_name: string,
  user_role: string,
  post_image: string
}

export default function BlogPage() {
    return (
        <>
            <h1>This is the Blog page...</h1>
            <section className={styles.postsContainer}>
                <Suspense fallback={<PostsListFallback />}>
                    <PostsList />
                </Suspense>
            </section>
        </>
    )
}