import Inspector from "./Inspector.js";
import Vindow from "./Vindow.js";
import DOM from "./DOM.js";

function JSONInspector(props) {
    let history = [props];
    let inspector = Inspector(props);
    let wInspect = Vindow({ 
        title: "JSON Inspector",
        className: "json-inspector"
    });
    /*
    wInspect.appendToToolbar(
        DOM.button()
        .addClass('btn btn-sm')
        .append([
            DOM.i()
            .addClass('fa fa-copy'),
        ])
        .on('click', inspector.copyTextToClipboard)
    )
    */
    let phInspect = DOM.div()
    let phHistory = DOM.div()
        .addClass('history')    
    wInspect.append([
        DOM.textarea()
            .addClass('full-width')
            .on('change',function(e){
                //console.log(e.target.value);
                var data = JSON.parse(e.target.value);
                history.push(data);

                phHistory.append(
                    DOM.span("⏰")
                        .on('click',function(){
                            inspector.update(data);
                            inspector.renderOn(phInspect);
                        })
                )
                inspector.update(data);
                inspector.renderOn(phInspect)
            }),
            phHistory,
            phInspect
    ]);
    wInspect.append(inspector.ui());
    ///wInspect.renderOn(body);
    return wInspect;
}
export default JSONInspector;
