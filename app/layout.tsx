import type { Metadata } from "next";
import Link from 'next/link'
import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
  description: "My custom application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="testy">
          <Link href="/">Home</Link>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}


//Psudo Code for the Gamer Blogger Shitter App

/*
  The site is a blog for users to post about video games
  The site will use React, Next, And Supabase

  There will be three types of accounts with access to the site, each with their own permissions

  Admin - post, post announcements, delete ANY post, view posts
  User - post, delete OWN post, view posts
  Visitor - view posts

  SUPABASE:
    authenticate users
    allow user signup
    store users posts (maybe likes, other metadata(dateAdded, category, id, name, etc))

  REACT:
    UI - different for each level of user
    Welcome Page - maybe the same as the blog page
    Sign In/Up Page - render form
    Blogs Page - render blogs and announcements
  
  NEXT:
    use Next links to go between pages
    use Next forms to allow new posts and announcements

*/