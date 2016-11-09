(function () {
  var instance = null;
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  
  function ScrollSpy () {
    if(instance) {
      return instance;
    } else {
      instance = {
        add: bind(this.addElement, this),
        clean: bind(this.cleanItems, this),
        getItems: this.getItems,
        debug: this.debug
      };
    }
    this.itemsLen = 0;
    this.items = [];
    this.setDefaultVariables();
    
    return instance;
  }
  
  ScrollSpy.prototype.throttle = function(callback) {
    var idle = true;
    return function() {
      if (idle) {
        callback();
        idle = false;
        setTimeout(function() {
          return idle = true;
        }, 150);
      }
    };
  };
  
  ScrollSpy.prototype.cleanItems = function() {
    this.items = [];
  };
  
  ScrollSpy.prototype.startListener = function() {
    window.addEventListener("scroll", this.onScroll());
    window.addEventListener("resize", this.onResize());
  };
  
  ScrollSpy.prototype.stopListeners = function() {
    window.removeEventListener("scroll", this.onScroll());
    window.removeEventListener("resize", this.onResize());
  };
  
  ScrollSpy.prototype.resetElementPosition = function() {
    var item;
    this.winHeight = window.innerHeight;
    for (var i = 0, len = this.items.length; i < len; i++) {
      item = this.items[i];
      item.pos = this.getElementPos(item);
    }
    this.checkVisibleItems();
  };
  
  ScrollSpy.prototype.getElementPos = function(param) {
    var top = this.getScrollY();
    var boundClient = param.el.getBoundingClientRect();
    return boundClient[param.reference] + top - param.offset;
  };
  
  ScrollSpy.prototype.getScrollY = function() {
    var doc;
    if (typeof pageYOffset !== 'undefined') {
      return pageYOffset;
    } else {
      doc = document.documentElement;
      doc = doc.clientHeight ? doc : document.body;
      return doc.scrollTop;
    }
  };
  
  ScrollSpy.prototype.onResize = function() {
    this.throttle(function () {
      if (this.winHeight !== window.innerHeight) {
        this.resetElementPosition();
      }
    });
  };
  
  ScrollSpy.prototype.onScroll = function() {
    this.throttle(function () {
      this.checkDocumentHeight();
      this.checkVisibleItems();
    });
  };
  
  ScrollSpy.prototype.getItems = function() {
    return this.items;
  };
  
  ScrollSpy.prototype.setDefaultVariables = function() {
    this.winHeight = window.innerHeight;
    this.lastPos = this.getScrollY();
    this.docHeight = document.body ? document.body.offsetHeight : 0;
  };
  
  ScrollSpy.prototype.addElement = function(param) {
    var count, item, prevItensLength;
    if (!param.el) {
      return;
    }
    param.offset = typeof param.offset === "undefined" ? 200 : param.offset;
    param.reference = param.reference || "top";
    param.pos = this.getElementPos(param);
    prevItensLength = this.items.length;
    count = 0;
    
    for (var i = 0, len = this.items.length; i < len; i++) {
      item = this.items[i];
      if (item.pos > param.pos) {
        break;
      }
      count++;
    }
    this.items.splice(count, 0, param);
    this.itemsLen = this.items.length;
    if (prevItensLength === 0) {
      this.setDefaultVariables();
      this.startListener();
    }
    this.checkVisibleItems();
  };
  
  ScrollSpy.prototype.checkDocumentHeight = function() {
    var currentDocHeight = document.body.offsetHeight;
    if (this.docHeight !== currentDocHeight) {
      this.docHeight = currentDocHeight;
      this.resetElementPosition();
    }
  };
  
  ScrollSpy.prototype.checkVisibleItems = function() {
    var item;
    var currentPos = this.getScrollY();
    var currentPosOffset = this.winHeight + currentPos;
    while (this.items.length) {
      item = this.items[0];
      if (currentPosOffset >= item.pos) {
        if (item.callback) {
          item.callback();
        }
        this.items.shift();
        this.itemsLen = this.items.length;
      } else {
        break;
      }
    }
    this.lastPos = currentPos;
    if (!this.items.length) {
      this.stopListeners();
    }
  };
  
  ScrollSpy.prototype.debug = function() {
    var border, color, item;
    // TODO: remove jquery use from debug function
    for (var i = 0, len = this.items.length; i < len; i++) {
      item = this.items[i];
      color = i % 2 ? "red" : "blue";
      border = "2px dashed " + color;
      item.el.style["border"] = border;
      $("<div class='debug-line'>").css({
        top: item.pos,
        width: "100%",
        position: "absolute",
        borderTop: border
      }).appendTo("body");
    }
  };
  
  window.ScrollSpy = new ScrollSpy();
})();