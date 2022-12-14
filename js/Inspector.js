import DOM from "./DOM.js";
import PubSub from "./PubSub.js";

function Inspector(props) {
    const self = PubSub();
    let myWrap = DOM.div().addClass("inspector");
    //let pre;
    let nested;
    let reveal = false;
    self.renderOn = function(wrap) {
        wrap.append([
            //pre = DOM.pre(),
            nested = DOM.div()
                .addClass('nested')        
        ]);
        self.update(props);
        return self; //allow chaining
    };
    self.ui = function() {
        self.renderOn(myWrap);
        return myWrap;
    };
    self.update = function(somethingInteresting) {
        const revealer = DOM.span(" 👀 ")
            .addClass('revealer')
            .on('click',() => { 
                reveal = true;
                self.update(somethingInteresting)            
            });
        const hider = DOM.span("❌ ")
            .addClass('hider')
            .on('click',() => { 
                reveal = false;
                self.update(somethingInteresting)            
            });
        const copier = DOM.span("📄")
            .addClass('copier')
            .on('click',self.copyTextToClipboard);

        props = somethingInteresting;
        if (somethingInteresting === null) {
            myWrap = DOM.span()
                .addClass('inspector-v v-null')
                .html("null");
            return;
        }
        var theType = typeof somethingInteresting;
        if (theType === "undefined") {
            myWrap = DOM.span()
                .addClass('inspector-v v-undefined')
                .html("undefined");
            return;
        }
        if (theType === "boolean") {
            myWrap = DOM.span()
                .addClass('inspector-v v-boolean')
                .html(somethingInteresting ? "true" : "false");
            return;
        }
        if (theType === "string") {
            myWrap = DOM.span()
                .addClass('inspector-v v-string')
                .html(somethingInteresting.length ? somethingInteresting : '""');
            return;
        }
        if (theType === "number") {
            myWrap = DOM.span()
                .addClass('inspector-v v-number')
                .html(somethingInteresting);
            return;
        }
        if (Array.isArray(somethingInteresting)) {
            myWrap.empty()
                .append([
                    '[',
                    (reveal ? [hider, copier] : revealer),
                    ...(reveal ? somethingInteresting.map(o => Inspector(o).ui()) : []),
                    ']'
                ]);
            return;
        }
        if (theType === "object") {
            var keys = Object.keys(somethingInteresting);
            myWrap.empty()
                .append([
                    '{',
                    (reveal ? [hider, copier] : revealer),
                    ...(reveal ? keys.map(k => DOM.div()
                        .addClass('inspected-object-kv-slot flex-row')
                        .append([
                            DOM.span(k)
                            .addClass('inspector-k'),
                            Inspector(somethingInteresting[k]).ui()
                        ])) : []),
                    '}'
                ]);
        }
    };
    self.copyTextToClipboard = function() {
        var text = JSON.stringify(props,null,4);
        navigator.clipboard.writeText(text);
    }
    return self;
}
export default Inspector;