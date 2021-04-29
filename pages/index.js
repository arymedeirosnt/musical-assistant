import Head from 'next/head'
import { config, dom } from "@fortawesome/fontawesome-svg-core";
import  Tabs  from "../components/Tabs";
import dynamic from 'next/dynamic';
import detectMobile from '../components/util/detectMobile';

config.autoAddCss = false;

const DynamicTuner = dynamic(
  () => import('../components/Tuner'),
  { ssr: false }
)

const DynamicMetronome = dynamic(
  () => import('../components/Metronome'),
  { ssr: false }
)

const DynamicLooper = dynamic(
  () => import('../components/Looper'),
  { ssr: false }
)


export default function Home() {
  const detect = detectMobile();
  if ( detect.isMobile() ){
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
            <DynamicMetronome />
          </div>
          <div id="loop" className="panel">
            <DynamicLooper />
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
  return ( "<h1>Landing Page</h1>");
}
