import DOM from "./DOM.js";
import Vindow from "./Vindow.js";
import PubSub from "./PubSub.js";

const transpose = (m) => {
    let res = [];
    for (var i = 0; i < m[0].length; i += 1) {
        res.push([]);
    }
    m.forEach( (mr,ri) =>{
        mr.forEach( (cv,cj) => {
          res[cj][ri] = cv;
        })
    })
    return res;
  }

const vdot = (a,b) => a.reduce((accum,asubi,i) => accum + asubi * b[i],0);

const matmulAB = (A,B) => {
    let BT = transpose(B);
    return A.map((Ar,Ari) => BT.map( (BTr,BTri) => vdot(BTr,Ar)));
}
const arrayOfSize = (n) => {
    return [...Array(n)].map(o => 0);
}

//identity matrix
//NOTE: I don't yet have the best grasp on the difference between
//rank and dimension...
const eye = (dimension) => {
    return arrayOfSize(dimension)
        .map((zero,i) => {
            var row = arrayOfSize(dimension);
            row[i] = 1;
            return row;
        });
}

const matmul = (matrices) => {
    return matrices
        .filter(o => o.length)
        .reduce((accum,m) => matmulAB(accum,m),eye(matrices[0].length));
}


function makeMat(someText) {
    const rows = someText.split(/\r+|\n+/)
        .filter(o => o.length)
    const result = rows.map(row => {
        //console.log(row,'row?')
        var terms = row
            .split(/ +/)
            .map(n => Number(n) )
        //console.log(terms,'terms?')
        return terms;
    })
    return result;
}

//tests

//console.log('eye',eye(3));

const A = makeMat(`
1 2
3 4
`);

const B = makeMat(`
5 6
7 8
`)

//console.log('matmul(A,B)',matmul([A,B]));
//console.log('matmul(B,A)',matmul([B,A]));

//const C = matmulAB(A,B);

//const D = matmul([A,B]);
//console.log(A,B,C,D,'A,B,C,D');



function MatInputView(m) {
    const self = PubSub();
    var textarea = DOM.textarea()
        .on('change',(e) => self.emit('change',makeMat(e.target.value)));
    var wrap = DOM.div()
        .addClass('matview')
        .append(textarea);
    self.ui = function() {
        return wrap;
    }
    return self; 
}
function MatOutputView(m) {
    const mT = transpose(m);
    
    let wrap = DOM.table()
        .append(
            m.map((row,ridx) => DOM.tr()
                .append(
                    row.map((entry,colidx) => DOM.td()
                        .text(entry)                        
                    )
                )
            )
        )
    return wrap;
}

//user interface
function Matty() {

    const self = Vindow({
        title: ' Matrix Multiplication'
    });
    var mats = [];
    var placeholder = DOM.div()
        .addClass('flex-row');

    function appendMat(m) {
        mats.push(m);
        var idx = mats.length - 1;
        var view = MatInputView(m)
            .on('change',(newM) => {
                mats[idx] = newM;
                self.emit('change');
            });
        placeholder.append(view.ui());
    }
    var answer = DOM.div()
        .addClass('answer')
        
    self.on('change',() => {
        const product = matmul(mats);
        answer
            .empty()
            .append(
                MatOutputView(product)
                // DOM.pre()
                //     .append(
                //         JSON.stringify(matmul(mats),null,4)
                //     )
            )
    })

    const toolbar = DOM.div()
        .append([
            DOM.button('[ ]')
                .addClass('btn-new-matrix')
                .on('click',() => appendMat(eye(2)))
        ])

    const wrap = DOM.div()
        .addClass('matty flex-row space-between')
        .append([
            placeholder,
            answer
        ]);

    self.appendToToolbar(toolbar);
    self.append(wrap);

    return self;
}

export default Matty;