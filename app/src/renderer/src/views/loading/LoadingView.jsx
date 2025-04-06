import styles from './styles.module.css'

export const LoadingView = () => (
  <div className="flex items-center justify-center h-screen">
    <div className={styles.loader}></div>
  </div>
)
