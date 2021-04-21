import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriver, faInfinity, faHeartbeat } from '@fortawesome/free-solid-svg-icons'
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import  Tabs  from "../pages/components/Tabs";

config.autoAddCss = false;



export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Musical Assistant</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>

      <main className="main">
        <div id="tuner" className="panel active">
          <h1>Afinador</h1>
        </div>
        <div id="metronome" className="panel">
          <h1>Metronomo</h1>
        </div>
        <div id="loop" className="panel">
          <h1>Loop</h1>
        </div>
      </main>

      <footer className="footer">
        <div className="grow"></div>
        <Tabs></Tabs>
        <div className="grow"></div>        
      </footer>
    </div>
  )
}
