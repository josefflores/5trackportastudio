//Container for the mixers tracks
var track = [null, null, null, null];

$(function () {
    captureAudio();

    track.forEach(function (item, index) {
        track[index] = new TrackTemplate();
        track[index].InitTrack();
    });

}); //end document ready

function armTrackToggle(trackNumber) {
    console.log('armTrackToggle track:' + trackNumber);
    track[trackNumber - 1].armTrackToggle();
}

function recordToggle(trackNumber) {

    console.log('recordToggle track:' + trackNumber);

    track[trackNumber - 1].recordToggle();

    if (track[trackNumber - 1].isRecording) {
        track.forEach(function (item, index) {
            //play tracks that arnt recording
            if (index !== trackNumber - 1) {
                track[index].playTrack();
            }
        });
        sw.run('START');
    } else {
        sw.run('STOP');
        sw.run('RESET');
    }
}

function play() {
    console.log('play');

    track.forEach(function (item, index) {
        track[index].playTrack();
    });

    sw.run('START');

}

function stop() {
    console.log('stop');

    track.forEach(function (item, index) {
        if (track[index].isRecording) {
            //stop recording
            track[index].recordToggle();
            track[index].armTrackToggle();
        } else {
            //stop playing
            track[index].stopTrack();
        }
    });

    sw.run('STOP');
    sw.run('RESET');
}

function muteToggle(trackNumber) {
    console.log('MuteToggle track:' + trackNumber);
    track[trackNumber - 1].muteTrackToggle();

}

function pan(trackNumber, amount) {
    console.log('pan:' + amount + ' track:' + trackNumber);
    track[trackNumber - 1].pan.pan.value = amount;

}

function gain(trackNumber, amount) {
    console.log('Changed Gain of track:' + trackNumber + ' to ' + amount);
    track[trackNumber - 1].gain.gain.value = amount;

}

function eq(trackNumber, type, amount) {
    console.log('Changing Eq' + type + ' of Track:' + trackNumber + ' amount:' + amount);

    if (type === 'HIGH') {
        track[trackNumber - 1].eqHigh.gain.value = amount;
    }

    if (type === 'MID') {
        track[trackNumber - 1].eqMid.gain.value = amount;
    }

    if (type === 'LOW') {
        track[trackNumber - 1].eqLow.gain.value = amount;
    }
}

function downloadProject() {
    //record whole project into recording buffer
    //download blob
}