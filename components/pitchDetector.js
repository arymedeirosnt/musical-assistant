const url_model = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';

let instance = null

class PitchDetector{
    constructor(options){
        this.cb = {};
        this.cb.onModelLoaded = ()=>{};
        this.cb.onPitch = ()=>{};
        this.cb.onSilence = ()=>{};
        this.running = false;

        this._pitch = null;
        this._modelLoaded = this._modelLoaded.bind(this);
        this.gotStream = this.gotStream.bind(this);
        this.updatePitch = this.updatePitch.bind(this);
        this._getPitch = this._getPitch.bind(this);
        this.buffer = new Float32Array( 4096 );
        this.rafID = null;
        this.lastNote = null;
        this.reads = [];
    }  

    _modelLoaded(){
        this.cb.onModelLoaded();
        this._getPitch();
    }

    getUserMedia(dictionary, callback){
        try {
            navigator.getUserMedia = 
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            navigator.getUserMedia(dictionary, callback, this.error);
        } catch (e) {
            alert('getUserMedia threw exception :' + e);
        }
    }


    gotStream(stream) {
        this._stream = stream;
        this.mediaStreamSource = this._audioContext.createMediaStreamSource(stream);    
        this.analyser = this._audioContext.createAnalyser();
        this.analyser.fftSize = 4096;
        this.mediaStreamSource.connect( this.analyser );
        this.running = true;
        this.updatePitch();
    }

    error() {
        alert('Stream generation failed.');
    }

    async init(){
        /*
        const loadML5 = (callback) => {
            const existingScript = document.getElementById('ML5');
            if (!existingScript) {
              const script = document.createElement('script');
              script.src = 'https://unpkg.com/ml5@latest/dist/ml5.min.js';
              script.id = 'ML5';
              document.body.appendChild(script);
              script.onload = () => { 
                if (callback) callback();
              };
            }
            if (existingScript && callback) callback();
          };
    
            const self = this;
            if ( !window.pitchDetector ){ 
                const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
                self._stream = stream;
                self._audioContext = new AudioContext();
                self._audioContext.resume().then(async function(){
                    loadML5(()=>{
                        self.running = true;
                        self._pitch = window.ml5.pitchDetection(url_model, self._audioContext , self._stream, self._modelLoaded);
                        window.pitchDetector = true;
                    });
                });
    
            }
            else{
                self.running = true;
                self._getPitch();
            }

*/
        if ( !this._audioContext ){
            this._audioContext = new AudioContext();
            this.MAX_SIZE = Math.max(4,Math.floor(this._audioContext.sampleRate/5000));
            this.getUserMedia({audio: {
                echoCancellation: false,
                autoGainControl: false
            }, video: false},this.gotStream);
        }
        else{
            this.running = true;
            this.updatePitch();
        }
    }

    terminate(){
        this.running = false;
        if ( this.rafID ){
            if (!window.cancelAnimationFrame)
			    window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame( this.rafID );
        }
    }

    updatePitch(){
        const cycles = new Array;
        this.analyser.getFloatTimeDomainData(this.buffer );
        var ac = this.autoCorrelate( this.buffer, this._audioContext.sampleRate );

        if ( ac === -1 ){
            this.cb.onSilence();
        }
        else{
            const ret = this._getNote(ac);            
            if ( ret.note === this.lastNote ){

                if ( this.reads.length == 10 ){
                    this.reads.shift();
                }
                this.reads.push(ret.cents);

                let sum = 0;
                for ( let i of this.reads )
                    sum += this.reads[i];
                
                ret.cents = sum / this.reads.length;
                this.cb.onPitch(ret);
            }
            else{
                this.reads = [];
            }
            this.lastNote = ret.note;
        }
        if (!window.requestAnimationFrame)
		    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
        if ( this.running )    
	        this.rafID = window.requestAnimationFrame( this.updatePitch );
    }


    autoCorrelate( buf, sampleRate ) {
        // Implements the ACF2+ algorithm
        var SIZE = buf.length;
        var rms = 0;
    
        for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
        }
        rms = Math.sqrt(rms/SIZE);
        if (rms<0.01) // not enough signal
            return -1;
    
        var r1=0, r2=SIZE-1, thres=0.2;
        for (var i=0; i<SIZE/2; i++)
            if (Math.abs(buf[i])<thres) { r1=i; break; }
        for (var i=1; i<SIZE/2; i++)
            if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }
    
        buf = buf.slice(r1,r2);
        SIZE = buf.length;
    
        var c = new Array(SIZE).fill(0);
        for (var i=0; i<SIZE; i++)
            for (var j=0; j<SIZE-i; j++)
                c[i] = c[i] + buf[j]*buf[j+i];
    
        var d=0; while (c[d]>c[d+1]) d++;
        var maxval=-1, maxpos=-1;
        for (var i=d; i<SIZE; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        var T0 = maxpos;
    
        var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
        var a = (x1 + x3 - 2*x2)/2;
        var b = (x3 - x1)/2;
        if (a) T0 = T0 - b/(2*a);
    
        return sampleRate/T0;
    }
    


    _getPitch(){
        const self = this;
        self._pitch.getPitch((err, frequency)=>{
            if (frequency) {
              const note = self._getNote(frequency);
              self.cb.onPitch(note);
            } else {
              self.cb.onSilence();
            }

            if ( self.running )
                setTimeout(function(){ self._getPitch()},50);
          })
    }

    _getNote(frequency){

        const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        const note =  Math.round( noteNum ) + 69;

        const frequencyFromNoteNumber = function( note ) {
            return 440 * Math.pow(2,(note-69)/12);
        }
        
        const  centsOffFromPitch = function( frequency, note ) {
            return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
        }

        const ret = {};
        ret.note = noteStrings[note%12];
        ret.detune = centsOffFromPitch( frequency, note ); 

        return ret;

    }

    setModelLoadCallBack(callback){
        this.cb.onModelLoaded = callback;
    }

    setPitchCallBack(callback){
        this.cb.onPitch = callback;
    }
    
    setSilenceCallBack(callback){
        this.cb.onSilence = callback;
    }
    
} 

export default PitchDetector;


