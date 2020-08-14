/*
 * Copyright (c) 2016, Globo.com (https://github.com/globocom)
 *
 * License: MIT
 */

import $ from 'jquery';
import * as ScrollSpy from '../src/scrollspy2.ts';
import fixture from './util/fixture.js';


describe("ScrollSpy2", function() {
  var interval = null;
  beforeEach(function() {
    $(fixture).prependTo("body");
    window.scrollTo(0, 0);
    window.innerHeight = 5000;
  });

  afterEach(function() {
    clearInterval(interval);
    ScrollSpy.clean();
    $(".fixture").remove();
  });

  it("should call the callback immediately", function(done) {
    var el = $(".top0")[0];
    var foo = {};
    foo.top0Callback = function() {};
    spyOn(foo, "top0Callback");
    ScrollSpy.add({
      el: el,
      callback: foo.top0Callback
    });
    setTimeout(function() {
      expect(foo.top0Callback).toHaveBeenCalled();
      done();
    }, 100);
  });

  it("should call the callback of multiples elements", function(done) {
    var fooTop0 = {
      top0Callback: function() {}
    };
    var fooTop200 = {
      top200Callback: function() {}
    };

    spyOn(fooTop0, 'top0Callback');
    spyOn(fooTop200, 'top200Callback');

    ScrollSpy.add({
      el: $(".top0")[0],
      callback: fooTop0.top0Callback
    });
    ScrollSpy.add({
      el: $(".top200")[0],
      callback: fooTop200.top200Callback
    });

    setTimeout(function() {
      expect(fooTop0.top0Callback).toHaveBeenCalled();
      expect(fooTop200.top200Callback).toHaveBeenCalled();
      done();
    }, 100);
  });

  describe("Callback tests", function() {
    var el, foo;

    beforeEach(function() {
      el = $(".top1150")[0];
      foo = {};
      foo.top1150Callback = function() {};
      foo.top1150BottomCallback = function() {};
      spyOn(foo, "top1150Callback").and.callThrough();
      spyOn(foo, "top1150BottomCallback").and.callThrough();
    });

    it("should not call the callback if element isnt on screen", function() {
      ScrollSpy.add({
        el: el,
        callback: foo.top1150Callback
      });
      window.scrollTo(0, 500);
      $(window).trigger("scroll");
      expect(foo.top1150Callback).not.toHaveBeenCalled();
    });

    it("should call the callback if the the element offset was reached", function(done) {
      ScrollSpy.add({
        el: el,
        offset: 400,
        callback: foo.top1150Callback
      });
      expect(foo.top1150Callback).not.toHaveBeenCalled();
      window.scrollTo(0, 800);
      $(window).trigger("scroll");
      setTimeout(function() {
        expect(foo.top1150Callback).toHaveBeenCalled();
        done();
      }, 100);
    });

    it("should call the callback on scroll", function(done) {
      ScrollSpy.add({
        el: el,
        callback: foo.top1150Callback
      });
      expect(foo.top1150Callback).not.toHaveBeenCalled();
      window.scrollBy(0, 900);
      $(window).trigger("scroll");
      setTimeout(function() {
        expect(foo.top1150Callback).toHaveBeenCalled();
        done();
      }, 200);
    });

    it("should not call the callback if reference is bottom", function(done) {
      ScrollSpy.add({
        el: el,
        callback: foo.top1150Callback
      });
      ScrollSpy.add({
        el: el,
        reference: "bottom",
        callback: foo.top1150BottomCallback
      });
      window.scrollTo(0, 900);
      $(window).trigger("scroll");
      setTimeout(function() {
        expect(foo.top1150Callback).toHaveBeenCalled();
        expect(foo.top1150BottomCallback).not.toHaveBeenCalled();
        done();
      }, 100);
    });

    it("should call the callback if reference is bottom and its visible", function(done) {
      ScrollSpy.add({
        el: el,
        reference: "bottom",
        callback: foo.top1150BottomCallback
      });

      window.scrollTo(0, 2000);
      $(window).trigger("scroll");

      setTimeout(function() {
        expect(foo.top1150BottomCallback).toHaveBeenCalled();
        done();
      }, 100);
    });

    it("should not call the callback if the the position changes", function(done) {
      ScrollSpy.add({
        el: el,
        callback: foo.top1150Callback
      });
      ScrollSpy.add({
        el: el,
        reference: "bottom",
        callback: foo.top1150BottomCallback
      });
      $(".top550")
        .clone()
        .add($(".top550").clone())
        .insertAfter($(".top550"));
      window.scrollTo(0, 2500);
      $(window).trigger("scroll");
      setTimeout(function() {
        expect(foo.top1150Callback).toHaveBeenCalled();
        expect(foo.top1150BottomCallback).not.toHaveBeenCalled();
        done();
      }, 100);
    });
  });
});
