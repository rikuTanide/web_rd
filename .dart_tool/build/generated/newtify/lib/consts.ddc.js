define(['dart_sdk'], function(dart_sdk) {
  'use strict';
  const core = dart_sdk.core;
  const dart = dart_sdk.dart;
  const dartx = dart_sdk.dartx;
  const _root = Object.create(null);
  const consts = Object.create(_root);
  dart.defineLazy(consts, {
    /*consts.ACTION*/get ACTION() {
      return "action";
    },
    /*consts.CONNECT*/get CONNECT() {
      return "connect";
    },
    /*consts.MUTATING*/get MUTATING() {
      return "mutating";
    },
    /*consts.HEAD*/get HEAD() {
      return "head";
    },
    /*consts.BODY*/get BODY() {
      return "body";
    },
    /*consts.SCROLL*/get SCROLL() {
      return "scroll";
    },
    /*consts.SCROLL_Y*/get SCROLL_Y() {
      return "scroll_y";
    },
    /*consts.TOUCH_MOVE*/get TOUCH_MOVE() {
      return "touch_move";
    },
    /*consts.TOUCH_START*/get TOUCH_START() {
      return "touch_start";
    },
    /*consts.TOUCH_END*/get TOUCH_END() {
      return "touch_end";
    },
    /*consts.CLIENT_X*/get CLIENT_X() {
      return "client_x";
    },
    /*consts.CLIENT_Y*/get CLIENT_Y() {
      return "client_y";
    },
    /*consts.CLICK*/get CLICK() {
      return "click";
    },
    /*consts.XPATH*/get XPATH() {
      return "xpath";
    }
  });
  dart.trackLibraries("packages/newtify/consts.ddc", {
    "package:newtify/consts.dart": consts
  }, '{"version":3,"sourceRoot":"","sources":["consts.dart"],"names":[],"mappings":";;;;;;;;MAAa,aAAM;YAAG;;MAClB,cAAO;YAAG;;MACV,eAAQ;YAAG;;MACX,WAAI;YAAG;;MACP,WAAI;YAAG;;MACP,aAAM;YAAG;;MACT,eAAQ;YAAG;;MACX,iBAAU;YAAG;;MACb,kBAAW;YAAG;;MACd,gBAAS;YAAG;;MACZ,eAAQ;YAAG;;MACX,eAAQ;YAAG;;MACX,YAAK;YAAG;;MACR,YAAK;YAAG","file":"consts.ddc.js"}');
  // Exports:
  return {
    consts: consts
  };
});

//# sourceMappingURL=consts.ddc.js.map
