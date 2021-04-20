import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriver, faInfinity, faHeartbeat } from '@fortawesome/free-solid-svg-icons'
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Musical</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>

      <main className={styles.main}>
        <h1>1.01a</h1>
      </main>

      <footer className={styles.footer}>
        <div className={styles.grow}></div>
        <div className={styles.tab}>
          <FontAwesomeIcon icon={faScrewdriver}  size="lg"/>
          <span>Afinador</span>
        </div>
        <div className={styles.tab}>
          <FontAwesomeIcon icon={faHeartbeat} size="lg"/>
          <span>Metronomo</span>
        </div>        
        <div className={styles.tab}>
          <FontAwesomeIcon icon={faInfinity} size="lg"/>
          <span>Loop</span>
        </div>        
        <div className={styles.grow}></div>        
      </footer>
    </div>
  )
}
