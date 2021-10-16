import GraphicEQ from "./GraphicEQ.js";
import DOM from "./DOM.js";
import Vindow from "./Vindow.js";
import Inspector from "./Inspector.js";
import { setBackgroundHue } from "./Utils.js";

import TableEditor from "./TableEditor.js";
import hexdump from "./hexdump.js";
import DragAndDropFile from "./DragAndDropFile.js";


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

/*
setInterval(() => {
    log.push({ time: Date.now() })
    inspector.update(log);
}, 10000);
*/
//let dump = hexdump("HELLO WORLD, HOW ARE YOU DOING?");

//console.log('dump?', dump);
//inspector.update(dump);


function makeHexDumpFrom(dump) {
    let hexyAF = DOM.div()
        .addClass('flex-row hexy-mf space-between')
        .append([
            DOM.div()
            .addClass('flex-column addr-column')
            .append(dump.addrs.map(addr => {
                return DOM.div()
                    .addClass('flex-row addr-row')
                    .append(addr)

            })),
            DOM.div()
            .addClass('flex-column code-column')
            .append(dump.codes.map(codeRow => {

                return DOM.div()
                    .addClass('flex-row code-row')
                    .append(codeRow)


            })),
            DOM.div()
            .addClass('flex-column char-column')
            .append(dump.chars.map(charRow => {
                return DOM.div()
                    .addClass('flex-row char-row')
                    .append(charRow)
            }))
        ])

    let wHex = Vindow({ title: 'Hex Dump' });
    wHex.append(hexyAF);
    wHex.renderOn(body);

}



let dragFile = DragAndDropFile({
    accept: '*',
    handleFiles: function(files, b, c) {
        [...files].forEach(file => {
                window.file = file;
                console.log('file?', file);
                file.text()
                    .then(data => {
                        let dump = hexdump(data);
                        makeHexDumpFrom(dump);

                    })

            })
            //console.log('a?', a);
            //inspector.update([a, b, c]);

    }
});
///dragFile.renderOn(body);

body.append(dragFile.ui())