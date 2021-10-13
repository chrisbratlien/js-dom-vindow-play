import GraphicEQ from "./GraphicEQ.js";
import DOM from "./DOM.js";
import Vindow from "./Vindow.js";
import Inspector from "./Inspector.js";
import { setBackgroundHue } from "./Utils.js";

import TableEditor from "./TableEditor.js";


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
    .addClass('btn btn-sm')
    .append([
        DOM.i()
        .addClass('fa fa-copy'),
    ])
    .on('click', inspector.copyTextToClipboard)
)
wInspect.append(inspector.ui());
wInspect.renderOn(body);

let numRows = 30;
let data = [...(new Array(numRows)).keys()]
    .map(emptyRow => {
        return {
            Area: Math.round(Math.random() * 300) / 10,
            Rating: Math.round(Math.random() * 10),
        }
    })
let te = TableEditor(data);

let [teToolbar, tePane] = te.ui();
let tvin = Vindow({ title: 'Table Editor' });
tvin.appendToToolbar(teToolbar);
tvin.append(tePane);
tvin.renderOn(body);



let TAU = Math.PI * 2;
let biggerIsSlower = 500000 // 1_000_000
let magicHueRadians = (Date.now() / biggerIsSlower) % TAU;
document.querySelectorAll('.vindow .header').forEach(elem => {
    setBackgroundHue(elem, magicHueRadians)
});


setInterval(() => {
    log.push({ time: Date.now() })
    inspector.update(log);
}, 10000);