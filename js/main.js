import GraphicEQ from "./GraphicEQ.js";
import DOM from "./DOM.js";
import Vindow from "./Vindow.js";
import Inspector from "./Inspector.js";


var audioElement = document.querySelector("audio");

let alreadyStarted = false;


let osc, analyser, meydaAnalyzer, audioStreamSrc;

function bootupAudio(cb) {
    if (alreadyStarted) { return cb("alreadyStarted"); }
    alreadyStarted = true;
    var audioCtx = new(window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
    window.audioCtx = audioCtx;
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    audioSrc.connect(audioCtx.destination);
    window.audioSrc = audioSrc;

    osc = audioCtx.createOscillator()
        //osc.connect(eq.analyser)
    window.osc = osc;


    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            window.stream = stream;
            console.log('stream!!', stream);
            audioStreamSrc = audioCtx.createMediaStreamSource(stream);
            window.audioStreamSrc = audioStreamSrc;
            cb(null, {
                audioCtx,
                audioSrc,
                osc,
                audioStreamSrc
            })
        })


}

let w = Vindow({ title: "Graphic EQ" });
let chromaLookup = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']

w.appendToToolbar(
    DOM.button()
    .append(
        DOM.i()
        .addClass('fa fa-plug')
    )
    .on('click', function() {
        bootupAudio(function(err, payload) {

            let eq = GraphicEQ({
                audioCtx
            });
            eq.connectAudioSource(audioSrc);
            eq.connectAudioSource(osc);
            eq.connectAudioSource(audioStreamSrc);

            //osc.start()
            ///eq.connectAudioSource(audioSrc);
            window.eq = eq;
            w.append(eq.ui());


            meydaAnalyzer = Meyda.createMeydaAnalyzer({
                "audioContext": audioCtx,
                //"source": osc,
                //"source": audioSrc,
                "source": audioStreamSrc,
                "bufferSize": 512,
                "sampleRate": audioCtx.sampleRate,
                "featureExtractors": ["rms", "chroma"],
                "callback": newMeydaFrame
            });
            meydaAnalyzer.start();
            window.meydaAnalyzer = meydaAnalyzer;





        });
    }))

let body = DOM.from(document.body);
w.renderOn(body);


let log = [];
let inspector = Inspector(log);
let wInspect = Vindow({ title: "Inspector" });
wInspect.appendToToolbar(
    DOM.button()
    .addClass('btn btn-sm')
    .append([
        DOM.i()
        .addClass('fa fa-copy'),
    ])
    .on('click', inspector.copyTextToClipboard)
)
wInspect.append(inspector.ui());
wInspect.renderOn(body);

let chromaCounts = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0
}

function newMeydaFrame(features) {

    let noteIdx = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].find(n => features.chroma[n] == 1);
    let theNote = chromaLookup[noteIdx];
    chromaCounts[noteIdx] += 1;
    inspector.update({
        ...chromaCounts
        //note: theNote,
        //chroma: features.chroma
    });
    //inspector.update(features.chroma);

}

/*
setInterval(() => {
    log.push({ time: Date.now() })
    inspector.update(eq.dataArray);
}, 10000);
*/