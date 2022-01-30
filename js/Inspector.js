import DOM from "./DOM.js";
import PubSub from "./PubSub.js";

function Inspector(props) {
    const self = PubSub();

    let myWrap = DOM.div().addClass("inspector");

    let pre;

    self.renderOn = function(wrap) {
        wrap.append(pre = DOM.pre());
        self.update(props);
        return self; //allow chaining
    };

    self.ui = function() {
        self.renderOn(myWrap);
        return myWrap;
    };

    self.update = function(somethingInteresting) {
        pre.empty().append(JSON.stringify(somethingInteresting, null, 4));
    };
    self.copyTextToClipboard = function() {
        navigator.clipboard.writeText(pre.raw.innerText);
    }

    return self;
}
export default Inspector;