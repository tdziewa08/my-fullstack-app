'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function handleSign(formData: FormData) {
    const supabase = await createClient()
    const email : string = formData.get('email') as string
    const password : string = formData.get('password') as string
    const result = await supabase.auth.signUp(
        {
        email: email,
        password: password
        }
    )
    redirect('/')
    console.log('inside the handle Signin function...')
    console.log('name', email)
    console.log('password', password)
}