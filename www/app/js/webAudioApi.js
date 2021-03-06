window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var tuna = new Tuna(audioContext);

var audioRecorder = null,
    audioInput = null,
    recordingBuffer = null,
    rawRecordingBuffer = null;

//Options for initializing navigator.getUserMedia
var opts = {
    audio: {
        optional: [{
            echoCancellation: false
        }]
    }
};

//Checks if we can grab mic feed, then grabs mic feed
function captureAudio() {
    if (isGetUserMediaSupported) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        initializeAudio();
    }
}

//Checks if we can grab mic feed (called from capture audio)
function isGetUserMediaSupported() {
    if (!navigator.getUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }
    if (!navigator.getUserMedia) {
        return alert('GetUserMedia is not supported in your browser');
    }
}

//Grabs mic feed (called from capture audio)
function initializeAudio() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia(opts, gotStream, function (e) {
            console.log(e);
        });
    }
}

//assigns audioInput and recorder
function gotStream(stream) {
    audioInput = audioContext.createMediaStreamSource(stream);
    audioRecorder = new Recorder(audioInput, {
        workerPath: '/javascripts/recorderWorker.js'
    });
}

//constructor for a blank track
function TrackTemplate() {
    var _this;
    var bufferSource = null;
    var isArmed = false;
    var pausedLocation = null;
    var isMuted = false;

    //bools to help control toggle of effects
    var effectOn = false;

    //Effects Declarations
    var pingPong = new tuna.PingPongDelay({
        wetLevel: 0.3, //0 to 1
        feedback: 0.3, //0 to 1
        delayTimeLeft: 200, //1 to 10000 (milliseconds)
        delayTimeRight: 300 //1 to 10000 (milliseconds)
    });
    var chorus = new tuna.Chorus({
        rate: 1.5,
        feedback: 0.2,
        delay: 0.0045,
        bypass: 0
    });
    var reverb = new tuna.Convolver({
        highCut: 22050, //20 to 22050
        lowCut: 20, //20 to 22050
        dryLevel: 1, //0 to 1+
        wetLevel: 0.3, //0 to 1+
        level: 1, //0 to 1+, adjusts total output of both wet and dry
        impulse: '/app/audio/impulse_rev.wav', //the path to your impulse response
        bypass: 0
    });
    var wahwah = new tuna.WahWah({
        automode: true, //true/false
        baseFrequency: 0.5, //0 to 1
        excursionOctaves: 2, //1 to 6
        sweep: 0.2, //0 to 1
        resonance: 10, //1 to 100
        sensitivity: 0.5, //-1 to 1
        bypass: 0
    });
    var phaser = new tuna.Phaser({
        rate: 5.0, //0.01 to 8 is a decent range, but higher values are possible
        depth: 0.8, //0 to 1
        feedback: 0.2, //0 to 1+
        stereoPhase: 30, //0 to 180
        baseModulationFrequency: 700, //500 to 1500
        bypass: 0
    });
    var cabinet = new tuna.Cabinet({
        makeupGain: 20, //0 to 20
        impulsePath: '/app/audio/impulse_guitar.wav', //path to your speaker impulse
        bypass: 0
    });
    // var overdrive = new tuna.Overdrive({
    //     outputGain: 0.01,         //0 to 1+
    //     drive: 0.01,              //0 to 1
    //     curveAmount: 1,          //0 to 1
    //     algorithmIndex: 1,       //0 to 5, selects one of our drive algorithms
    //     bypass: 0
    // });

    var tremolo = new tuna.Tremolo({
        intensity: 0.5, //0 to 1
        rate: 4, //0.001 to 8
        stereoPhase: 90, //0 to 180
        bypass: 0
    });
    var bitcrusher = new tuna.Bitcrusher({
        bits: 4, //1 to 16
        normfreq: 0.1, //0 to 1
        bufferSize: 4096 //256 to 16384
    });

    this.buffer = null;
    this.eqHigh = audioContext.createBiquadFilter();
    this.eqMid = audioContext.createBiquadFilter();
    this.eqLow = audioContext.createBiquadFilter();
    this.gain = audioContext.createGain();
    this.pan = audioContext.createStereoPanner();
    this.analyser = audioContext.createAnalyser();
    this.meter = createAudioMeter(audioContext);
    this.timer = new StopWatch();
    this.isRecording = false;
    this.effect = {
        name: null,
        container: null
    };

    //initializes a blank track ready for recording
    this.InitTrack = function () {

        this.gain.value = 0.7;

        /*
         *Create all EQ types
         */

        //High
        this.eqHigh.type = 'peaking';
        this.eqHigh.frequency.value = 2000;
        this.eqHigh.gain.value = 0;
        this.eqHigh.Q.value = 0.75;

        //Mid
        this.eqMid.type = 'peaking';
        this.eqMid.frequency.value = 800;
        this.eqMid.gain.value = 0;
        this.eqMid.Q.value = 0.75;

        //Low
        this.eqLow.type = 'peaking';
        this.eqLow.frequency.value = 250;
        this.eqLow.gain.value = 0;
        this.eqLow.Q.value = 0.75;

        //Connect all parts of the signal chain
        this.eqHigh.connect(this.eqMid);
        this.eqMid.connect(this.eqLow);
        this.eqLow.connect(this.gain);
        this.gain.connect(this.pan);
        this.pan.connect(audioContext.destination);
    };

    this.playTrack = function (where) {
        where = dVar(where, 0);

        if (this.buffer !== null) {
            bufferSource = audioContext.createBufferSource(2, this.buffer, audioContext.sampleRate);
            bufferSource.buffer = this.buffer;
            bufferSource.connect(this.eqHigh);
            bufferSource.start(0, where);

            //Only user meter when playing because it's inefficent
            this.meter = createAudioMeter(audioContext);
            this.gain.connect(this.meter);
        }
    };

    this.stopTrack = function () {
        console.log('stop');
        if (this.buffer !== null) {
            bufferSource.stop();
            this.gain.disconnect(this.meter);
            this.meter.shutdown();
            this.meter.volume = 0;
        }
    };

    this.pauseTrack = function () {
        //needs Jose's clock
    };

    /*
     *Connects the whole signal chain
     *so that you hear you microphone feed
     *through your speakers, last step
     *before recording process
     */

    this.armTrackToggle = function () {
        if (isArmed === false) {
            audioInput.connect(this.eqHigh);
            isArmed = true;
        } else {
            audioInput.disconnect(this.eqHigh);
            isArmed = false;
        }
    };

    this.muteTrackToggle = function () {
        if (!isMuted) {
            this.pan.disconnect();
            isMuted = true;
        } else {
            this.pan.connect(audioContext.destination);
            isMuted = false;
        }
    };

    this.recordToggle = function () {
        if (isArmed === true) {
            if (this.isRecording === false) {
                audioRecorder.clear();
                audioRecorder.record();
                this.isRecording = true;
                this.meter = createAudioMeter(audioContext);
                this.gain.connect(this.meter);
            } else {
                audioRecorder.stop();
                this.isRecording = false;
                this.getRecorderBuffer();
                this.gain.disconnect(this.meter);
                this.meter.shutdown();
                this.meter.volume = 0;
            }
        } else {
            console.log('Track must be armed to record');
        }
    };

    this.getRecorderBuffer = function () {
        _this = this; //bring scope to callback function
        audioRecorder.getBuffer(this.grabFromAudioRecorderBuffer);
    };

    /*
     * Callback function for getRecorderBuffer, grabs the buffer
     * from the recorder.js and transfers it to a WebAudioApi
     * recording buffer.
     */

    this.grabFromAudioRecorderBuffer = function (buffers) {
        recordingBuffer = audioContext.createBuffer(2, buffers[0].length, audioContext.sampleRate);
        recordingBuffer.getChannelData(0)
            .set(buffers[0]);
        recordingBuffer.getChannelData(1)
            .set(buffers[1]);
        _this.buffer = recordingBuffer;
    };

    /*
     *  Allows user to toggle an effect on or off
     *  As of now available effects are CHORUS, REVERB, WAHWAH, PINGPONG
     *
     *   Functionality Example:
     *
     *       track[0].toggleEffect(REVERB) //Adds reverb to track 1
     *       track[0].toggleEffect(CHORUS) //Replaces reverb with chorus effect
     *       track[0].toggleEffect(CHORUS) //Removes chorus effect from track
     *
     *  @method track.toggleEffect
     */

    this.toggleEffect = function (effectName) {
        _this = this;
        if (effectName === 'CLEAR' && this.effect.container === null) {
            //do nothing
            console.log('Effect is already empty');
        } else if (this.effect.container === null) {
            //no effect, so assing effect variable
            switchEffect(effectName);

            //break signal chain
            this.gain.disconnect();

            //insert effect
            this.gain.connect(this.effect.container);
            this.effect.container.connect(this.pan);
        } else if (effectName === 'CLEAR') {
            //Same effect passed in, so remove it
            this.gain.disconnect();
            this.effect.container.disconnect();

            //Return signal chain to normal
            this.gain.connect(this.pan);

            //Reset Effect Variable
            this.effect.container = null;
            this.effect.name = null;
        } else { //Diffrent FX passed in, switch them

            //remove
            this.gain.disconnect();
            this.effect.container.disconnect();

            //replace variable
            switchEffect(effectName);

            //reconnect
            this.gain.connect(this.effect.container);
            this.effect.container.connect(this.pan);
        }
    };

    //Helper function for toggleEffect function
    //switch assigns the corresponding effect argument
    var switchEffect = function (effectName) {
        switch (effectName) {
        case 'REVERB':
            _this.effect.container = reverb;
            _this.effect.name = 'REVERB';
            break;
        case 'PINGPONG':
            _this.effect.container = pingPong;
            _this.effect.name = 'PINGPONG';
            break;
        case 'CHORUS':
            _this.effect.container = chorus;
            _this.effect.name = 'CHORUS';
            break;
        case 'WAHWAH':
            _this.effect.container = wahwah;
            _this.effect.name = 'WAHWAH';
            break;
        case 'TREMELO':
            _this.effect.container = tremolo;
            _this.effect.name = 'TREMELO';
            break;
        case 'BITCRUSHER':
            _this.effect.container = bitcrusher;
            _this.effect.name = 'BITCRUSHER';
            break;
        case 'PHASER':
            _this.effect.container = phaser;
            _this.effect.name = 'PHASER';
            break;
        case 'CABINET':
            _this.effect.container = cabinet;
            _this.effect.name = 'CABINET';
            break;
        }
    };
}

function doneEncoding(blob) {
    download(blob, 'TrackStudio.wav', 'audio/wav');
}