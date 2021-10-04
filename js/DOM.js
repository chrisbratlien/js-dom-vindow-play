var DOM = window.DOM || {
    regularTagString: 'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr',
    svgTagString: 'circle,ellipse,g,line,path,polygon,polyline,rect,svg,text'
};

DOM.regularTags = DOM.regularTagString
    .split(',')
    .filter(function(o) { return o; });
DOM.svgTags = DOM.svgTagString
    .split(',')
    .filter(function(o) { return o; });


function fromVanilla(raw) {
    let self = {};
    self.raw = raw;
    self[0] = raw;

    self.get = function(prop) {
        return self[prop];
    }

    self.on = function(eventName, callback) {
        raw.addEventListener(eventName, callback);
        return self;
    }
    self.addClass = function(classes) {
        classes = classes
            .split(/ +/)
            .filter(o => o);
        raw.classList.add(...classes);
        return self;
    }
    self.empty = function() {
        let item;
        while (item = raw.children.item(0)) {
            console.log('item', item);
            raw.removeChild(item);
        }
        raw.innerHTML = null;
        return self;
    }
    self.show = function() {
        self.css('display', null);
        return self;
    }
    self.append = function() {

        let children = [...arguments];
        if (children.length == 1) {
            children = children[0];
        }

        if (Array.isArray(children)) {
            children
                .filter(o => o)
                .forEach(function(child) {
                    self.append(child);
                });
            return self;
        }
        if (children && typeof children == "object" && children.raw) {
            raw.append(children.raw);
            return self;
        }

        raw.append(children);


        return self;
    }

    function attrHelper(base, key, value) {

        if (typeof key == 'object' && !value) {
            let props = key;
            base = {
                ...base,
                ...props
            }
            return self;
        }
        if (typeof value == "undefined") {
            //just reading...
            return base[key];
        }
        //single prop
        base[key] = value;
        return self;
    } //attrHelper

    self.attr = function(key, value) {
        return attrHelper(raw, key, value);
    }
    self.css = function(key, value) {
        if (typeof key == 'object') {
            let props = key;
            //Object.keys(props).forEach(prop => raw.style.setProperty(prop,props[prop]));
            Object.keys(props).forEach(prop => { raw.style[prop] = props[prop]; })
            return self;
        }
        if (typeof value == "undefined") {
            //just reading...
            return raw.style[key];
        }
        //single prop
        raw.style[key] = value;
        return self;

    }

    return self;
}

DOM.element = function(tag) {

    var args = Array.prototype.slice.call(arguments);

    if (arguments.length == 0) { return "ERROR"; }

    var tag = arguments[0];
    var self, raw;

    if (DOM.svgTags.find(function(o) { return o == tag; })) {
        raw = document.createElementNS('http://www.w3.org/2000/svg', tag);
    } else {
        raw = document.createElement(tag);
    }

    self = fromVanilla(raw);

    if (arguments.length == 1) {
        return self;
    }
    let children = arguments[1];
    if (children) {
        self.append(children);
    }

    return self;
};

var combined = new Set(
    []
    .concat(DOM.regularTags)
    .concat(DOM.svgTags)
);

combined.forEach(function(tag) {
    DOM[tag] = function() {

        var args = Array.prototype.slice.call(arguments);


        if (arguments.length == 0) { return DOM.element(tag); }
        //return DOM.element(tag, arguments[0]);
        ///var result = DOM.element(tag, arguments);

        //var result = DOM.element.apply(null,arguments);
        ////var result = DOM.element.apply(null,args);
        var result = DOM.element(tag, args);
        return result;
    }
});

DOM.from = function(vanilla) {
    return fromVanilla(vanilla);
}

export default DOM;