import Inspector from "./Inspector.js";
import Vindow from "./Vindow.js";
import DOM from "./DOM.js";

function JSONInspector(props) {
    let inspector = Inspector(props);
    let wInspect = Vindow({ title: "JSON Inspector" });
    wInspect.appendToToolbar(
        DOM.button()
        .addClass('btn btn-sm')
        .append([
            DOM.i()
            .addClass('fa fa-copy'),
        ])
        .on('click', inspector.copyTextToClipboard)
    )
    
    var phInspect = DOM.div()
    wInspect.append([
        DOM.textarea()
            .on('change',function(e){
                //console.log(e.target.value);
                var data = JSON.parse(e.target.value)
                inspector.update(data);
                inspector.renderOn(phInspect)
            }),
            phInspect
    ]);
    wInspect.append(inspector.ui());
    ///wInspect.renderOn(body);
    return wInspect;
}
export default JSONInspector;
