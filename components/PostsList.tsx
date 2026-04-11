import styles from '@/app/page.module.css'
import Post from "./Post"
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/actions'

export default async function PostsList() {
    const supabase = await createClient()
    const user = await getUser()
    
    // Get posts with joined profile data
    const { data: postsWithProfiles, error } = await supabase
        .from('posts_table')
        .select(`*, profiles(id, display_name, app_role)`)
        .order('created_at', { ascending: false })
    
    // Get current user's profile for admin check
    const { data: currentUserProfile } = user ? await supabase
        .from('profiles')
        .select('app_role')
        .eq('id', user.id)
        .single() : { data: null }
    
    if (error) {
        console.error('Error fetching posts:', error)
        return <div>Error loading posts</div>
    }

    if (!postsWithProfiles || postsWithProfiles.length === 0) {
        return <div>No posts found</div>
    }

    return (
        <>
            {postsWithProfiles.map(post => (
                <Post 
                    key={post.id} 
                    post={post} 
                    user={user} 
                    currentUserProfile={currentUserProfile}
                />
            ))}
        </>
    )
}

export function PostsListFallback() {
    return (
        <>
            {/* Generate 4 skeleton posts */}
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.postSkeleton}>
                    <div className={`${styles.skeleton} ${styles.postSkeletonImg}`}></div>
                    <div className={styles.postSkeletonDetails}>
                        <div className={`${styles.skeleton} ${styles.postSkeletonTitle}`}></div>
                        <div className={`${styles.skeleton} ${styles.postSkeletonUser}`}></div>
                        <div className={`${styles.skeleton} ${styles.postSkeletonDate}`}></div>
                        <div className={`${styles.skeleton} ${styles.postSkeletonScore}`}></div>
                        <div className={`${styles.skeleton} ${styles.postSkeletonScore}`}></div>
                        <div className={`${styles.skeleton} ${styles.postSkeletonScore}`}></div>
                        <div className={`${styles.skeleton} ${styles.postSkeletonScore}`}></div>
                    </div>
                </div>
            ))}
        </>
    )
}
