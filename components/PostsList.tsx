import styles from '@/app/page.module.css'
import Post from "./Post"
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/actions'

export default async function PostsList() {
    const supabase = await createClient()
    const user = await getUser()
    
    // Get posts with joined profile data
    const { data: postsWithProfiles, error } = await supabase
        .from('test_post_table')
        .select(`*, profiles(id, display_name, app_role)`)
    
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

    // Fixed: Use postsWithProfiles, not test_post_table
    if (!postsWithProfiles || postsWithProfiles.length === 0) {
        return <div>No posts found</div>
    }

    return (
        <>
            {/* Fixed: Use postsWithProfiles and pass currentUserProfile */}
            {postsWithProfiles.map(post => (
                <Post 
                    key={post.id} 
                    post={post} 
                    user={user} 
                    currentUserProfile={currentUserProfile}
                />
            )).reverse()}
        </>
    )
}

export function PostsListFallback() {
    return (
        <div className={styles.page}>
            <span>Loading posts...</span>
        </div>
    )
}
