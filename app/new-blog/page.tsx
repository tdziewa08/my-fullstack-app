import styles from '@/app/page.module.css'
import Form from 'next/form'
import { redirect } from 'next/navigation'
import { getUser } from '@/app/auth/actions'
import { getDailyGame } from '@/utils/daily-game'
import { writePost } from '@/app/auth/actions'
import { Suspense } from 'react'

export default function NewBlogPage() {
    return (
        <>
            <Suspense fallback={<NewBlogFallback />}>
                <NewBlogContent />
            </Suspense>
        </>
    )
}

async function NewBlogContent() {

    const user = await getUser()
    if(!user)
    {
        redirect('/sign-in')
    }
    const { image, name } = await getDailyGame()

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.newPostContainer}>
                    <div className={styles.newPostImgContainer}>
                        <img src={image} alt={name} />
                    </div>
                    <Form action={writePost} className={styles.newPostForm}>
                        <h1>{name}</h1>
                        <div className={styles.newPostFormInputs}>
                            <label>
                                <div>
                                    <p>Gameplay</p>
                                    <input type='number' name='gameplay' placeholder='1 - 10' min='1' max='10' required />
                                </div>
                            </label>
                            <label>
                                <div>
                                    <p>Story</p>
                                    <input type='number' name='story' placeholder='1 - 10' min='1' max='10' required />
                                </div>
                            </label>
                            <label>
                                <div>
                                    <p>Music</p>
                                    <input type='number' name='music' placeholder='1 - 10' min='1' max='10' required />
                                </div>
                            </label>
                            <label>
                                <div>
                                    <p>Replayability</p>
                                    <input type='number' name='replay' placeholder='1 - 10' min='1' max='10' required />
                                </div>
                            </label>
                        </div>
                        <input type="hidden" name="post_game_name" value={name} />
                        <input type="hidden" name="post_image" value={image} />
                        <button type="submit">Post</button>
                    </Form>
                </div>
            </main>
        </div>
    )
}

function NewBlogFallback() {
    return (
        <main className={styles.main}>
            <div className={styles.newBlogSkeleton}>
                <div className={`${styles.skeleton} ${styles.newBlogSkeletonImg}`}></div>
                <div className={styles.newBlogSkeletonForm}>
                    <div className={`${styles.skeleton} ${styles.newBlogSkeletonTitle}`}></div>
                    <div className={styles.newBlogSkeletonInputs}>
                        <div className={`${styles.skeleton} ${styles.newBlogSkeletonInput}`}></div>
                        <div className={`${styles.skeleton} ${styles.newBlogSkeletonInput}`}></div>
                        <div className={`${styles.skeleton} ${styles.newBlogSkeletonInput}`}></div>
                        <div className={`${styles.skeleton} ${styles.newBlogSkeletonInput}`}></div>
                    </div>
                    <div className={`${styles.skeleton} ${styles.newBlogSkeletonButton}`}></div>
                </div>
            </div>
        </main>
    )
}