import DOM from "./DOM.js";
import PubSub from "./PubSub.js";


function makeArray(aThing) {
  if (!Array.isArray(aThing)) {
    return [aThing];
  }
  return aThing;
}


function headerRowFromObject(obj) {
  let headerRow = document.createElement("tr");
  Object.keys(obj).forEach((key) => {
    let th = document.createElement("th");
    let textNode = document.createTextNode(key);
    th.appendChild(textNode);
    headerRow.appendChild(th);
  });
  return headerRow;
}

function bodyRowFromObject(obj) {
  let row = document.createElement("tr");
  Object.keys(obj).forEach((key) => {
    let td = document.createElement("td");
    let text = obj[key];
    let textNode = document.createTextNode(text);
    td.appendChild(textNode);
    row.appendChild(td);
  });
  return row;
}

function arrayofObjectsToTable(objects) {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  let firstObject = objects[0];
  let headerRow = headerRowFromObject(firstObject);
  thead.appendChild(headerRow);

  objects.forEach((object) => {
    let row = bodyRowFromObject(object);
    tbody.appendChild(row);
  });
  return table;
}

function dataToTable(data) {
  let anArray = makeArray(data);
  let table = arrayofObjectsToTable(anArray);
  return table;
}

const TableInspector = function (props) {
  
  self.update = function (data) {


  }

  self.ui = function () {
    let table = dataToTable(props);
    return table;
  }


  return self;
}

export default TableInspector;