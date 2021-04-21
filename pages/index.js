import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriver, faInfinity, faHeartbeat } from '@fortawesome/free-solid-svg-icons'
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import  Tabs  from "../pages/components/Tabs";
import dynamic from 'next/dynamic';

config.autoAddCss = false;

const DynamicTuner = dynamic(
  () => import('./components/Tuner'),
  { ssr: false }
)

const DynamicMwtronome = dynamic(
  () => import('./components/Metronome'),
  { ssr: false }
)


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
          <DynamicTuner />
        </div>
        <div id="metronome" className="panel">
          <DynamicMwtronome />
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
