/* 
 * Base metronome, with no timing. 
 * More like a "click on command" class. 
 */
class BaseMetronome {
    constructor(tempo = 60,signature=4, compass=0) {
      this.tempo = tempo;
      this.signature = signature;
      this.playing = false;
      this.compass = compass ? compass+1: 0;
      this.recording = false;
      this.started = false;
      
      this.audioCtx = null;
      this.tick = null;
      this.tickVolume = null;
      this.soundHz = 1000;

      this.tock = null;
      this.tockVolume = null;
      this.ticktock = signature;

      this.startRecordFn = ()=>{};
      this.stopRecordFn = ()=>{};
    }
    
    initAudio() {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.tick = this.audioCtx.createOscillator();
      this.tickVolume = this.audioCtx.createGain();
  
      this.tick.type = 'sine'; 
      this.tick.frequency.value = this.soundHz;
      this.tickVolume.gain.value = 0;
      
      this.tick.connect(this.tickVolume);
      this.tickVolume.connect(this.audioCtx.destination);
      this.tick.start(0);  // No offset, start immediately.


      this.tock = this.audioCtx.createOscillator();
      this.tockVolume = this.audioCtx.createGain();
  
      this.tock.type = 'sine'; 
      this.tock.frequency.value = this.soundHz * 2;
      this.tockVolume.gain.value = 0;
      
      this.tock.connect(this.tockVolume);
      this.tockVolume.connect(this.audioCtx.destination);
      this.tock.start(0);  // No offset, start immediately.

      
    }
    
    click(callbackFn,startRecordFn=null,stopRecordFn=null) {
      const time = this.audioCtx.currentTime;

      this.startRecordFn = startRecordFn || this.startRecordFn;
      this.stopRecordFn = stopRecordFn || this.stopRecordFn;

      this.clickAtTime(time);
      
      if (callbackFn) {
        callbackFn(time);
      }
    }
    
    clickAtTime(time) {


      // Silence the click.
      this.tickVolume.gain.cancelScheduledValues(time);
      this.tickVolume.gain.setValueAtTime(0, time);

      // Silence the click.
      this.tockVolume.gain.cancelScheduledValues(time);
      this.tockVolume.gain.setValueAtTime(0, time);

      if ( this.ticktock === this.signature ){
          if ( !this.recording ){
            if ( !this.started ){
              this.tockVolume.gain.linearRampToValueAtTime(1, time + .001);
              this.tockVolume.gain.linearRampToValueAtTime(0, time + .001 + .01);
              if ( this.compass > 0 ){
                this.started = true;  
              }
            }
            else{
              this.startRecordFn();
              this.recording = true;
            }
          }
          if ( this.compass == 0 ){
            this.stopRecordFn();
          }
          this.ticktock = 0;
          this.compass--;
      }
      else{
          if ( !this.recording ){
            this.tickVolume.gain.linearRampToValueAtTime(1, time + .001);
            this.tickVolume.gain.linearRampToValueAtTime(0, time + .001 + .01);
          }
      }
      this.ticktock++
    }
    
    start(callbackFn) {
      this.playing = true;
      this.initAudio();
    }
    
    stop(callbackFn) {
      this.playing = false;
      this.tickVolume.gain.value = 0;
      this.tockVolume.gain.value = 0;
    }
  }
  
  
  /* 
   * Scheduling is done by calling setInterval() in a worker thread.
   */
  class WorkerMetronome extends BaseMetronome {
    constructor(tempo,signature,compass) {
      super(tempo,signature,compass);
      this.worker = new Worker('worker.js');
    }
    
    start(callbackFn,startRecordFn,stopRecordFn) {
      super.start();
      const timeoutDuration = (60 / this.tempo) * 1000;
      
      this.worker.postMessage({interval: timeoutDuration});
      this.worker.postMessage('start');
      this.worker.onmessage = () => this.click(callbackFn,startRecordFn,stopRecordFn); 
    }
    
    stop() {
      super.stop();
      this.worker.postMessage('stop');
    }
  }
  
  
  export { WorkerMetronome };