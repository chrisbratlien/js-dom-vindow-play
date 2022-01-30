import DOM from "./DOM.js";
import PubSub from "./PubSub.js";
import Procrastinator from "./Procrastinator.js";

function makeArray(aThing) {
    if (!Array.isArray(aThing)) {
        return [aThing];
    }
    return aThing;
}

const TableEditor = function(props, opts) {
    const procrastinate = Procrastinator();

    let anArray = makeArray(props);

    let toolbar, table, thead, tbody;

    function headerRowFromObject(obj) {
        let headerRow = DOM.tr();
        Object.keys(obj).forEach((key) => {
            let th = DOM.th();
            let text = key.toString();
            th.append(text);
            headerRow.append(th);
        });
        return headerRow;
    }

    function bodyRowFromObject(obj) {
        let selected = false;

        let row = DOM.tr();
        Object.keys(firstObject).forEach((key) => {
            let td = DOM.td();

            let text = "";
            if (obj && obj[key]) {
                text = obj[key].toString();
            }

            let readOnly =
                opts &&
                opts.readOnlyProps &&
                opts.readOnlyProps.find((opt) => opt === key);

            let span = DOM.span(text);
            let textInput = !readOnly &&
                DOM.input()
                .attr("type", "text")
                .val(text)
                .on("change blur", function(e) {
                    let newValue = e.target.value;

                    console.log("wee", newValue);
                    obj[key] = newValue;
                    //back to read-only
                    span.text(newValue);

                    textInput.hide();
                    span.show();

                    procrastinate(
                        "cell-changed",
                        function() {
                            self.emit("cell-changed", obj, key, newValue, anArray);
                        },
                        400
                    );
                });

            textInput && textInput.hide();
            td.append(span, textInput);
            td.on("click", function() {
                //to write-mode
                !readOnly && span.hide();
                textInput && textInput.show().focus();
            });

            row.append(td);
        });

        row.on("click", function() {
            selected = !selected;
            row.toggleClass("selected");
            self.emit("row-selected", row, obj, anArray);
        });

        return row;
    }

    function insertObjects(objects) {
        objects.forEach((object) => {
            let row = bodyRowFromObject(object);
            tbody.append(row);
        });
    }

    table = DOM.table().append((thead = DOM.thead()), (tbody = DOM.tbody()));

    let firstObject = anArray[0];

    let headerObj = Object.keys(firstObject).reduce((accum, k) => {
        accum[k] = null;
        return accum;
    }, {});

    console.log("headerObj", headerObj);

    let headerRow = headerRowFromObject(firstObject);
    thead.append(headerRow);

    insertObjects(anArray);

    let self = PubSub();

    self.ui = function() {
        return [toolbar, table];
    };

    self.getData = function() {
        let aCopy = [...anArray];
        return aCopy;
    };

    self.push = function(data) {
        let them = makeArray(data);
        anArray = [...anArray, ...them];
        insertObjects(them);
    };

    return self;
};

export default TableEditor;