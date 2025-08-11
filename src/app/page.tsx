import AvatarCropper from './components/cropper';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <AvatarCropper />
      </main>
    </div>
  );
}
