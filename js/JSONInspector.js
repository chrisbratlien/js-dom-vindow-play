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



    function injectWInspect() {
        window.wInspect = wInspect;
    }

    wInspect.appendToToolbar(
        DOM.button()
        .addClass('btn btn-sm')
        .append([
            DOM.i()
            .addClass('fa fa-glass'),
        ])
        .on('click', injectWInspect)
    )
    


    let phInspect = DOM.div()
    let phHistory = DOM.div()
        .addClass('history')    


        //update the inner inspector object as well as the history
        //and history UI
    wInspect.update = function(anObject) {
        history.push(anObject);

        phHistory.append(
            DOM.span("⏰")
                .on('click',function(){
                    inspector.update(anObject);
                    inspector.renderOn(phInspect);
                })
        )
        inspector.update(anObject);
        inspector.renderOn(phInspect)

    }
    
    



    wInspect.append([
        DOM.textarea()
            .addClass('full-width')
            .on('change',function(e){
                //console.log(e.target.value);
                var data = JSON.parse(e.target.value);
                wInspect.update(data);
            }),
            phHistory,
            phInspect
    ]);
    wInspect.append(inspector.ui());
    ///wInspect.renderOn(body);
    return wInspect;
}
export default JSONInspector;
