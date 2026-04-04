'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Game, getDailyGame } from '@/utils/daily-game'

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
        .from('test_post_table')
        .insert(
            {
                user_id: user.id,
                user_display_name: user.user_metadata.display_name,
                user_role: user.user_metadata.app_role,
                gameplay_rating: Number(formData.get('gameplay')),
                story_rating: Number(formData.get('story')),
                music_rating: Number(formData.get('music')),
                replay_rating: Number(formData.get('replay')),
                post_image: formData.get('post_image') as string
            }
        )
    if(error)
    {
        console.error(error)
        redirect('/')
    }

    redirect('/blogs')
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
        .from('test_post_table')
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
        .from('test_post_table')
        .delete()
        .eq('id', postId)
    
    if (error) {
        console.error('Error deleting post:', error)
        return
    }
    
    console.log('Post deleted successfully by:', isAdmin ? 'Admin' : 'Owner')
    revalidatePath('/blogs')
}

//failed sign in
    // __isAuthError: true,
    // status: 400,
    // code: 'invalid_credentials'

//successful sign in
//     data: {
//     user: {
//       id: 'c709687d-00a3-43dd-9f79-ab6d2a24f2e3',
//       aud: 'authenticated',
//       role: 'authenticated',
//       email: 'tdziewa08@gmail.com',
//       email_confirmed_at: '2026-03-20T16:28:27.403124Z',
//       phone: '',
//       confirmed_at: '2026-03-20T16:28:27.403124Z',
//       last_sign_in_at: '2026-03-20T16:38:30.37505404Z',
//       app_metadata: [Object],
//       user_metadata: [Object],
//       identities: [Array],
//       created_at: '2026-03-20T16:28:27.375325Z',
//       updated_at: '2026-03-20T16:38:30.427277Z',
//       is_anonymous: false
//     },
//     session: {
//       access_token: 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjQ0OGQ3MGI2LWJkY2ItNGU2Ny05MTI4LTdiMzI2OGQzZWI0MCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3p2YmNnZ3dsc2RzenJpdG9jamRjLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJjNzA5Njg3ZC0wMGEzLTQzZGQtOWY3OS1hYjZkMmEyNGYyZTMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc0MDI4MzEwLCJpYXQiOjE3NzQwMjQ3MTAsImVtYWlsIjoidGR6aWV3YTA4QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJ0ZHppZXdhMDhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiYzcwOTY4N2QtMDBhMy00M2RkLTlmNzktYWI2ZDJhMjRmMmUzIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NzQwMjQ3MTB9XSwic2Vzc2lvbl9pZCI6IjYwNDNhNzkwLTMzN2MtNDhiMy1hMGRiLWVlODJmODU5OTQ4MiIsImlzX2Fub255bW91cyI6ZmFsc2V9.dh7_nLeCIYAno4lxJKBeI5q40Y6oTzG2OnWNFA3Ow_KmZB9gAZQGSuuRrU3IVOo9nuVB_Zn9X20UUl9rOrAqMQ',
//       token_type: 'bearer',
//       expires_in: 3600,
//       expires_at: 1774028310,
//       refresh_token: 'ql6fzaeqfdqt',
//       user: [Object],
//       weak_password: null
//     }
//   },
//   error: null
// }