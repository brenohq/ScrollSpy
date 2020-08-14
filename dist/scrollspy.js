(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.ScrollSpy = {}));
}(this, (function (exports) { 'use strict';

    /*
     * Copyright (c) 2016, Globo.com (https://github.com/globocom)
     *
     * License: MIT
     */
    let items = [];
    let winHeight;
    let docHeight;
    function clean() {
        items = [];
    }
    function getItems() {
        return items.map(i => i);
    }
    function add(param) {
        if (!param.el) {
            throw new Error("[@globocom/scrollspy] item.el is required");
        }
        const item = Object.assign({ offset: 200, reference: "top", pos: 0 }, param);
        item.pos = getElementPos(item);
        const index = items.findIndex(i => i.pos > item.pos);
        items.splice(index === -1 ? items.length : index, 0, item);
        if (items.length === 1) {
            setDefaultVariables();
            startListener();
        }
        checkVisibleItems();
    }
    function debug() {
        items.forEach((item, i) => {
            const color = i % 2 ? "red" : "blue";
            const border = `2px dashed ${color}`;
            const nodeHtml = document.createElement("div");
            const css = [
                `top: ${item.pos};`,
                "width: 100%;",
                "position: absolute;",
                `border-top: ${border};`
            ].join("");
            item.el.style.border = border;
            nodeHtml.className = "debug-line";
            nodeHtml.setAttribute("style", css);
            document.body.appendChild(nodeHtml);
        });
        return items;
    }
    function throttle(callback) {
        let idle = true;
        return () => {
            if (idle) {
                callback();
                idle = false;
                setTimeout(() => (idle = true), 150);
            }
        };
    }
    function getElementPos(item) {
        const top = getScrollY();
        const boundClient = item.el.getBoundingClientRect();
        return boundClient[item.reference] + top - item.offset;
    }
    function getScrollY() {
        if (typeof pageYOffset !== "undefined") {
            return pageYOffset;
        }
        else {
            let doc = document.documentElement;
            doc = doc.clientHeight ? doc : document.body;
            return doc.scrollTop;
        }
    }
    function onResize() {
    }
    function onScroll() {
        checkDocumentHeight();
        checkVisibleItems();
    }
    function startListener() {
        window.addEventListener("scroll", throttle(onScroll));
        window.addEventListener("resize", throttle(onResize));
    }
    function stopListeners() {
        window.removeEventListener("scroll", throttle(onScroll));
        window.removeEventListener("resize", throttle(onResize));
    }
    function resetElementPosition() {
        winHeight = window.innerHeight;
        for (const item of items) {
            item.pos = getElementPos(item);
        }
        checkVisibleItems();
    }
    function setDefaultVariables() {
        winHeight = window.innerHeight;
        docHeight = document.body ? document.body.offsetHeight : 0;
    }
    function checkDocumentHeight() {
        const currentDocHeight = document.body.offsetHeight;
        if (docHeight !== currentDocHeight) {
            docHeight = currentDocHeight;
            resetElementPosition();
        }
    }
    function checkVisibleItems() {
        const currentPos = getScrollY();
        const currentPosOffset = winHeight + currentPos;
        for (const item of items) {
            if (currentPosOffset >= item.pos) {
                if (item.callback) {
                    item.callback();
                }
                items.shift();
            }
            else {
                break;
            }
        }
        if (!items.length) {
            stopListeners();
        }
    }

    exports.add = add;
    exports.clean = clean;
    exports.debug = debug;
    exports.getItems = getItems;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=scrollspy.js.map
