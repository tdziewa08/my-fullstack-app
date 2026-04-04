import styles from '@/app/page.module.css'
import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/app/auth/actions'
import Post from "@/components/Post"
import type { Post as PostType, Profile as ProfileType} from '@/app/blogs/page'

// Add the PostWithProfile type
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

async function getUserPosts(userId: string) {
    const user = await getUser()
    const supabase = await createClient()
    
    // ✅ Filter posts by the specific user
    const { data: postsWithProfiles, error } = await supabase
        .from('test_post_table')
        .select(`*, profiles(id, display_name, app_role)`)
        .eq('user_id', userId)  // ✅ Added filter for specific user
    
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

    // ✅ Fixed variable names and types
    return postsWithProfiles?.map(post => (
        <Post 
            key={post.id} 
            post={post as PostWithProfile} 
            user={user} 
            currentUserProfile={currentUserProfile}
        />
    ))
}

async function getUserData(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching user profile:', error)
        return null
    }

    return data
}

function UserDetailFallback() {
    return ( 
        <div>LOADING...</div>
    )
}

export default async function UserDetail({ params }: UserDetailProps) {
    const { id } = await params
    const [userPosts, userData] = await Promise.all([
        getUserPosts(id),
        getUserData(id)
    ])

    const memberSince = userData?.created_at
        ? new Date(userData.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        : 'Unknown'

    return (
        <Suspense fallback={<UserDetailFallback />}>
            <h1>USER: {userData?.display_name}</h1>
            <h2>ROLE: {userData?.app_role}</h2>
            <h3>MEMBER SINCE: {memberSince}</h3>
            {userPosts}
        </Suspense>
    )
}