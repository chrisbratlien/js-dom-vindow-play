import DOM from "./DOM.js";
import PubSub from "./PubSub.js";
import { remap } from "./Lerpy.js";
//with help from https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/

function GraphicEQ(props) {
    let self = PubSub();
    let canvas = DOM.canvas()
        .attr({
            width: 800, //FIXME: hardcode
            height: 200
        })

    //console.log('what is canvas', canvas);
    var dataArray;
    var audioCtx = props.audioCtx || props.audioSrc.context;
    var canvasCtx = canvas.raw.getContext('2d');
    var analyser = audioCtx.createAnalyser();
    self.analyser = analyser;

    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;

    let WIDTH = canvasCtx.canvas.width;
    let HEIGHT = canvasCtx.canvas.height;

    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    self.dataArray = dataArray;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    let drawVisual;

    let TAU = Math.PI * 2;
    let TAU_OVER_3 = TAU / 3;

    let hues = [...Array(bufferLength)].map((o, i) => {
        return remap(0, bufferLength, TAU, 0, i);
    });

    function draw() {
        drawVisual = requestAnimationFrame(draw);
        //return console.log('drawVisual',drawVisual);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5 - 1;
        var barHeight;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            //canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
            canvasCtx.fillStyle = `hsl(${hues[i]}rad,50%,50%)`;
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth;
        }
    };

    draw();


    self.connectAudioSource = function(anAudioSource) {
        anAudioSource.connect(analyser);
    }

    self.ui = function() {
        return canvas;
    }
    return self;
}

export default GraphicEQ;