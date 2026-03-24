import Post from "./post"
import { createClient } from '@/utils/supabase/server'
import type { Post as PostType } from '@/app/blogs/page'

export default async function PostsList() {
    const supabase = await createClient()
    const { data: test_post_table, error } = await supabase.from('test_post_table').select()
    
    if (error) {
        console.error('Error fetching posts:', error)
        return <div>Error loading posts</div>
    }

    if (!test_post_table || test_post_table.length === 0) {
        return <div>No posts found</div>
    }

    return (
        <>
            {test_post_table.map(post => (
                <Post key={post.id} post={post as PostType} />
            ))}
        </>
    )
}

export function PostsListFallback() {
    return (
        <div>Loading posts...</div>
    )
}