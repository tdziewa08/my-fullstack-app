'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function handleSignup(formData: FormData) {
    const supabase = await createClient()
    const name: string = formData.get('name') as string
    const email : string = formData.get('email') as string
    const password : string = formData.get('password') as string
    const result = await supabase.auth.signUp(
        {
            email: email,
            password: password,
            options: {
                data: {
                    display_name: name,
                    app_role: 'User'
                }
            }
        }
    )
    redirect('/')
}

export async function handleSignin(formData: FormData) {
        const supabase = await createClient()
        const email: string = formData.get('email') as string
        const password: string = formData.get('password') as string
        const result = await supabase.auth.signInWithPassword(
            {
                email: email,
                password: password
            }
        )
        console.log(result)
        if(result.error)
        {
            console.error(result.error)
        }
        else if(result.data.user)
        {
            console.log(`Welcome ${result.data.user.email}`)
            redirect('/')
        }
}

export async function handleSignout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function writePost(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user)
    {
        console.error('Not an authenticated user')
        redirect('/sign-in')
    }
    const { data, error } = await supabase
        .from('posts_table')
        .insert(
            {
                user_id: user.id,
                gameplay_rating: Number(formData.get('gameplay')),
                story_rating: Number(formData.get('story')),
                music_rating: Number(formData.get('music')),
                replay_rating: Number(formData.get('replay')),
                post_image: formData.get('post_image') as string,
                post_game_name: formData.get('post_game_name') as string
            }
        )

    if(error)
    {
        console.error(error)
        redirect('/')
    }

    redirect('/posts')
}

export async function deletePost(postId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        console.error('Unauthorized: No user')
        return
    }
    
    // Get the post to check ownership
    const { data: post } = await supabase
        .from('posts_table')
        .select('user_id')
        .eq('id', postId)
        .single()
    
    // Get current user's profile to check admin status
    const { data: profile } = await supabase
        .from('profiles')
        .select('app_role')
        .eq('id', user.id)
        .single()
    
    const isOwner = post?.user_id === user.id
    const isAdmin = profile?.app_role === 'Admin'
    
    if (!isOwner && !isAdmin) {
        console.error('Unauthorized: Not owner or admin')
        return
    }
    
    const { error } = await supabase
        .from('posts_table')
        .delete()
        .eq('id', postId)
    
    if (error) {
        console.error('Error deleting post:', error)
        return
    }
    
    console.log('Post deleted successfully by:', isAdmin ? 'Admin' : 'Owner')
    revalidatePath('/posts')
}