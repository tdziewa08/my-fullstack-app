'use client'

import styles from '@/app/page.module.css'
import Form from 'next/form'
import { handleSign } from '@/app/auth/actions'

export default function SignUpPage() {
    return (
        <div className={styles.page}>
            <Form action={handleSign} className={styles.signupPage}>
                <h1>Sign Up</h1>
                <label>
                    <div>
                        <p>Email Address</p>
                        <input type='text' name='email' placeholder='me@abc.com'/>
                    </div>
                </label>
                <label>
                    <div>
                        <p>Password</p>
                        <input type='text' name='password' placeholder='123'/>
                    </div>
                </label>
                <button>Sign Up</button>
            </Form>
        </div>
    )
}