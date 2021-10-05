function clamp01(t) {
    t = Math.max(0, t);
    t = Math.min(t, 1);
    return t;
}

function lerp(a, b, t, clamp) {
    if (clamp) {
        t = clamp01(t);
    }
    var result = (1 - t) * a + t * b;
    return result;
}

function invlerp(a, b, v, clamp) {
    var t = (v - a) / (b - a);
    if (!clamp) { return t; }
    t = clamp01(t);
    return t;
}

function remap(iMin, iMax, oMin, oMax, v, clamp) {
    var t = invlerp(iMin, iMax, v, clamp);
    var result = lerp(oMin, oMax, t); //don't reclamp here.
    return result;
}
export {
    clamp01,
    lerp,
    invlerp,
    remap
}