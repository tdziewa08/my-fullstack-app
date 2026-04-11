import styles from '@/app/page.module.css'
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/actions'
import Post from '@/components/Post'
import type { Post as PostType} from '@/app/posts/page'

type PostWithProfile = PostType & {
    profiles: {
        id: string
        display_name: string | null
        app_role: string | null
    } | null
}

type UserDetailProps = {
    params: Promise<{ id: string }>
}

// Separate async component for user posts
async function UserPostsList({ userId }: { userId: string }) {
    const supabase = await createClient()
    
    // Parallelize data fetching with Promise.all
    const [user, postsResult] = await Promise.all([
        getUser(),
        supabase
            .from('posts_table')
            .select(`*, profiles(id, display_name, app_role)`)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
    ])
    
    const { data: postsWithProfiles, error } = postsResult
    
    // Get current user profile only if user exists
    const currentUserProfile = user ? 
        await supabase
            .from('profiles')
            .select('app_role')
            .eq('id', user.id)
            .single()
            .then(result => result.data)
        : null
    
    if (error) {
        console.error('Error fetching posts:', error)
        return <div>Error loading posts</div>
    }

    return (
        <>
            {postsWithProfiles?.map(post => (
                <Post 
                    key={post.id} 
                    post={post as PostWithProfile} 
                    user={user} 
                    currentUserProfile={currentUserProfile}
                />
            ))}
        </>
    )
}

// Separate async component for user data
async function UserInfo({ userId }: { userId: string }) {
    const supabase = await createClient()
    const { data: userData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching user profile:', error)
        return <div>Error loading user profile</div>
    }

    const memberSince = userData?.created_at
        ? new Date(userData.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        : 'Unknown'

    return (
        <section className={styles.userDetails}>
            <h1>{userData?.display_name}</h1>
            <h2>Member Since: {memberSince}</h2>
        </section>
    )
}

// Fallback components
function UserInfoFallback() {
    return (
        <section className={styles.userDetailsSkeleton}>
            <div className={`${styles.skeleton} ${styles.userSkeletonName}`}></div>
            <div className={`${styles.skeleton} ${styles.userSkeletonMember}`}></div>
        </section>
    )
}

function UserPostsFallback() {
    return (
        <div className={styles.postsContainerSkeleton}>
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
        </div>
    )
}

// Combined async component for the entire page content
async function UserPageContent({ userId }: { userId: string }) {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Suspense fallback={<UserInfoFallback />}>
                    <UserInfo userId={userId} />
                </Suspense>
                
                <Suspense fallback={<UserPostsFallback />}>
                    <section className={styles.userPostsContainer}>
                        <UserPostsList userId={userId} />
                    </section>
                </Suspense>
            </main>
        </div>
    )
}

export default function UserDetail({ params }: UserDetailProps) {
    return (
        <Suspense fallback={<div className={styles.page}><main className={styles.main}><UserInfoFallback /><UserPostsFallback /></main></div>}>
            <UserPageWrapper params={params} />
        </Suspense>
    )
}

// Wrapper to handle the async params
async function UserPageWrapper({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <UserPageContent userId={id} />
}