import styles from "../page.module.css";
import PostsList, { PostsListFallback } from "../../components/PostsList"
import { Suspense } from 'react'
import type { Database } from '@/types/supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts_table']['Row']

export default function PostsPage() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>User Posts</h1>
                <section className={styles.postsContainer}>
                    <Suspense fallback={<PostsListFallback />}>
                        <PostsList />
                    </Suspense>
                </section>
            </main>
        </div>
    )
}