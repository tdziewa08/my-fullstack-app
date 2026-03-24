import Link from 'next/link'
import { getUser, handleSignout } from '@/app/auth/actions'

export default async function Navigation() {
  const user = await getUser()

  return (
    <nav className="testy">
      <Link href="/">Home</Link>
      {user === null
       ? 
       <>
        <Link href="/sign-in">Sign In</Link>
        <Link href="/sign-up">Sign Up</Link>
       </>
       :
       <>
        <span>Welcome {user.user_metadata.display_name}</span>
        <form action={handleSignout}>
          <button type="submit">Sign Out</button>
        </form>
       </>
      }
    </nav>
  )
}

export function NavigationFallback() {
  return (
    <nav className="testy">
      <Link href="/">Home</Link>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/sign-up">Sign Up</Link>
    </nav>
  )
}