import styles from "../app/page.module.css";
import Image from 'next/image'

export default function Post() {
    return (
        <div className={styles.post}>
            <div className={styles.postImgContainer}>
                <Image src="/globe.svg" alt="placeholder-img" height={300} width={400} />
            </div>
            <div className={styles.postDetails}>
                <p>Gameplay: </p>
                <p>Graphics: </p>
                <p>Music: </p>
                <p>Replayability: </p>
            </div>
        </div>
    )
}