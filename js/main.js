import GraphicEQ from "./GraphicEQ.js";
import DOM from "./DOM.js";
import Vindow from "./Vindow.js";
import Inspector from "./Inspector.js";

var audioElement = document.querySelector("audio");
let w = Vindow({ title: "Graphic EQ" });

let alreadyStarted = false;
w.appendToToolbar(
    DOM.button()
    .append(
        DOM.i()
        .addClass('fa fa-plug')
    )
    .on('click', function() {
        if (alreadyStarted) { return false; }
        alreadyStarted = true;
        var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        var audioSrc = audioCtx.createMediaElementSource(audioElement);
        audioSrc.connect(audioCtx.destination);
        window.audioSrc = audioSrc;
        let eq = GraphicEQ({
            audioCtx
        });
        eq.connectAudioSource(audioSrc);


        let osc = audioCtx.createOscillator()
            //osc.connect(eq.analyser)
        window.osc = osc;
        eq.connectAudioSource(osc);

        osc.start()


        ///eq.connectAudioSource(audioSrc);
        window.eq = eq;
        window.audioCtx = audioCtx;
        w.append(eq.ui());
    }))

let body = DOM.from(document.body);
w.renderOn(body);


let log = [];
let inspector = Inspector(log);
let wInspect = Vindow({ title: "Inspector" });
wInspect.appendToToolbar(
    DOM.button()
    .append(
        DOM.i()
        .addClass('fa fa-copy')
    )
    .on('click', inspector.copyTextToClipboard)
)
wInspect.append(inspector.ui());
wInspect.renderOn(body);
setInterval(() => {
    log.push({ time: Date.now() })
    inspector.update(log);
}, 10000);