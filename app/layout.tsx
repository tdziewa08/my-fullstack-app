import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";
import Navigation, { NavigationFallback } from '@/components/Navigation'
import { Suspense } from 'react'

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
        <Suspense fallback={<NavigationFallback />}>
          <Navigation />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

//Pseudo Code for the Gamer Blogger Shitter App

/*
  The site is a blog for users to post about video games
  The site will use React, Next, And Supabase

  There will be three types of accounts with access to the site, each with their own permissions

  Admin - post, post announcements, delete ANY post, view posts
  User - post, delete OWN post, view posts****
  Visitor - view posts****

  SUPABASE:
    authenticate users****
    allow user signup****
    store users posts (maybe likes, other metadata(dateAdded, category, id, name, etc))****

  REACT:
    UI - different for each level of user
    Welcome Page - encourage signing up, show thumbnails for blogs posts****
    use new API for getting random game images for the user to post about i guess???****
    **users post on GAME OF THE DAY??? (single image chosen every 24 hours???)
    not really blogs but fields of a form for a user to rate game aspects on a scale (gameplay, music, replayability, graphics, maybe a little comment)****
    Sign In/Up Page - render form****
    Blogs Page - render blogs ****

  
  NEXT:
    use Next links to go between pages****
    each blog post has a dynamic parameter [blod_id] or similar
    use Next forms to allow new posts and announcements

  PAGE STRUCTURE:
    Main page(visitor):
      welcomes user****
      shows game of the day****
      links to login, signup, blogs page****
    
    Main page(user):
      welcomes user by NAME ****
      shows game of the day ****
      button to post a blog ****
      links to signout, blogs page ****
    
    Main page(admin):
      welcomes user by NAME****
      shows game of the day****
      button to post a blog****
      links to signout, blogs page****

    Blogs page(visitor):
      shows blogs ****
      blog info ****
      shows NAME and role of who posted the blog****

    Blogs page(user):
      shows blogs ****
      blog info ****
      shows NAME and role of who posted the blog ****
      shows delete option for blog matching user ID ****

    Blogs page(admin):
      shows blogs ****
      blog info ****
      shows NAME and role of who posted the blog****
      shows delete option for any blog

    Create Blog Post page(user and admin):
      form inputs ****
      game of the day image ****
      number fields for ranking ****
      submit button ****

    SignIn:
      email and password fields ****

    SignUp:
      name, email, and password fields ****

    5 pages total
*/


/* Final Stretch Pseudo Code 

    show delete option for ANY post when Admin is signed in****
    Have users automatically signed out when leaving the app **** (NOT actually a problem)
    Fine tune API call to not grab multiple tokens AND fetch more relevant games****
    Use profiles table instead of authenticated users table where possible**** I THINK I DID IT
    protect routes from being accessed through address bar****
    rename tables, env variables

    style post component
    style sign-in/up pages
    style game of the day component
    style users/[id] page
    add fonts
    add media queries

    clean up and LAUNCH


*/