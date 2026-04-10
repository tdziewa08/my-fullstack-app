import styles from '@/app/page.module.css'
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/actions'
import Post from "@/components/Post"
import type { Post as PostType, Profile} from '@/app/blogs/page'

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
    const user = await getUser()
    const supabase = await createClient()
    
    const { data: postsWithProfiles, error } = await supabase
        .from('test_post_table')
        .select(`*, profiles(id, display_name, app_role)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    
    const { data: currentUserProfile } = user ? await supabase
        .from('profiles')
        .select('app_role')
        .eq('id', user.id)
        .single() : { data: null }
    
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

export default async function UserDetail({ params }: UserDetailProps) {
    const { id } = await params

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <Suspense fallback={<UserInfoFallback />}>
                    <UserInfo userId={id} />
                </Suspense>
                
                <Suspense fallback={<UserPostsFallback />}>
                    <section className={styles.userPostsContainer}>
                        <UserPostsList userId={id} />
                    </section>
                </Suspense>
            </main>
        </div>
    )
}