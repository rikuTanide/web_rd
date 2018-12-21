define(['dart_sdk'], function(dart_sdk) {
  'use strict';
  const core = dart_sdk.core;
  const _js_helper = dart_sdk._js_helper;
  const convert = dart_sdk.convert;
  const html = dart_sdk.html;
  const dart = dart_sdk.dart;
  const dartx = dart_sdk.dartx;
  const _root = Object.create(null);
  const send = Object.create(_root);
  const $keys = dartx.keys;
  const $_set = dartx._set;
  const $_get = dartx._get;
  const $onOpen = dartx.onOpen;
  const $client = dartx.client;
  const $forEach = dartx.forEach;
  const $onTouchStart = dartx.onTouchStart;
  const $onTouchMove = dartx.onTouchMove;
  const $onTouchEnd = dartx.onTouchEnd;
  const $onTouchCancel = dartx.onTouchCancel;
  const $target = dartx.target;
  const $toLowerCase = dartx.toLowerCase;
  const $querySelectorAll = dartx.querySelectorAll;
  const $onClick = dartx.onClick;
  const $scrollY = dartx.scrollY;
  const $onScroll = dartx.onScroll;
  const $innerHtml = dartx.innerHtml;
  const $head = dartx.head;
  const $observe = dartx.observe;
  let IdentityMapOfString$dynamic = () => (IdentityMapOfString$dynamic = dart.constFn(_js_helper.IdentityMap$(core.String, dart.dynamic)))();
  let EventTovoid = () => (EventTovoid = dart.constFn(dart.fnType(dart.void, [html.Event])))();
  let IdentityMapOfString$int = () => (IdentityMapOfString$int = dart.constFn(_js_helper.IdentityMap$(core.String, core.int)))();
  let TouchToNull = () => (TouchToNull = dart.constFn(dart.fnType(core.Null, [html.Touch])))();
  let ListOfTouch = () => (ListOfTouch = dart.constFn(core.List$(html.Touch)))();
  let StringAndListOfTouchTovoid = () => (StringAndListOfTouchTovoid = dart.constFn(dart.fnType(dart.void, [core.String, ListOfTouch()])))();
  let TouchEventToNull = () => (TouchEventToNull = dart.constFn(dart.fnType(core.Null, [html.TouchEvent])))();
  let IdentityMapOfString$String = () => (IdentityMapOfString$String = dart.constFn(_js_helper.IdentityMap$(core.String, core.String)))();
  let MouseEventToNull = () => (MouseEventToNull = dart.constFn(dart.fnType(core.Null, [html.MouseEvent])))();
  let IdentityMapOfString$Object = () => (IdentityMapOfString$Object = dart.constFn(_js_helper.IdentityMap$(core.String, core.Object)))();
  let EventToNull = () => (EventToNull = dart.constFn(dart.fnType(core.Null, [html.Event])))();
  let ListAndMutationObserverToNull = () => (ListAndMutationObserverToNull = dart.constFn(dart.fnType(core.Null, [core.List, html.MutationObserver])))();
  dart.defineLazy(send, {
    /*send.sendWebSocket*/get sendWebSocket() {
      return null;
    },
    set sendWebSocket(_) {}
  });
  send.send = function(action, body) {
    let msg = new (IdentityMapOfString$dynamic()).from(["action", action]);
    for (let key of body[$keys]) {
      msg[$_set](key, body[$_get](key));
    }
    let str = convert.jsonEncode(msg);
    send.sendWebSocket.send(str);
  };
  send.main = function() {
    send.connectSendWebSocket();
  };
  send.connectSendWebSocket = function() {
    send.sendWebSocket = html.WebSocket.new("ws://localhost:9000/send");
    send.sendWebSocket[$onOpen].listen(dart.fn(_ => send.sendHtml(), EventTovoid()));
    send.listenMutation();
    send.listenScroll();
    send.listenClick();
    send.listenTouch();
  };
  send.listenTouch = function() {
    function handler(action, touches) {
      touches[$forEach](dart.fn(touch => {
        send.send(action, new (IdentityMapOfString$int()).from(["client_x", dart.asInt(touch[$client].x), "client_y", dart.asInt(touch[$client].y)]));
      }, TouchToNull()));
    }
    dart.fn(handler, StringAndListOfTouchTovoid());
    html.window[$onTouchStart].listen(dart.fn(e => {
      handler("touch_start", e.touches);
    }, TouchEventToNull()));
    html.window[$onTouchMove].listen(dart.fn(e => {
      handler("touch_move", e.touches);
    }, TouchEventToNull()));
    html.window[$onTouchEnd].listen(dart.fn(e => {
      send.send("touch_end", new (IdentityMapOfString$dynamic()).new());
    }, TouchEventToNull()));
    html.window[$onTouchCancel].listen(dart.fn(e => {
      send.send("touch_end", new (IdentityMapOfString$dynamic()).new());
    }, TouchEventToNull()));
  };
  send.listenClick = function() {
    html.window[$onClick].listen(dart.fn(e => {
      let element = html.HtmlElement.as(e[$target]);
      let tagName = element.tagName[$toLowerCase]();
      if (tagName === "body" || tagName === "html") {
        return;
      }
      let tags = html.document[$querySelectorAll](html.Element, tagName);
      let elementIndex = tags.indexOf(element);
      let msg = new (IdentityMapOfString$String()).from(["action", "click", "xpath", tagName + "/" + dart.str(elementIndex)]);
      send.sendWebSocket.send(convert.jsonEncode(msg));
    }, MouseEventToNull()));
  };
  send.listenScroll = function() {
    html.window[$onScroll].listen(dart.fn(e => {
      let msg = new (IdentityMapOfString$Object()).from(["action", "scroll", "scroll_y", html.window[$scrollY]]);
      send.sendWebSocket.send(convert.jsonEncode(msg));
    }, EventToNull()));
  };
  send.sendHtml = function() {
    if (send.sendWebSocket == null) {
      return;
    }
    let msg = new (IdentityMapOfString$String()).from(["action", "mutating", "head", html.document[$head][$innerHtml], "body", html.document.body[$innerHtml]]);
    send.sendWebSocket.send(convert.jsonEncode(msg));
  };
  send.listenMutation = function() {
    let observer = html.MutationObserver.new(dart.fn((list, observer) => {
      send.sendHtml();
    }, ListAndMutationObserverToNull()));
    observer[$observe](html.document.body, {attributes: true, characterData: true, childList: true, subtree: true});
  };
  dart.trackLibraries("web/send.ddc", {
    "send.dart": send
  }, '{"version":3,"sourceRoot":"","sources":["send.dart"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;MAKU,kBAAa;;;;;uBAEb,MAAa,EAAE,IAAyB;AAChD,QAAI,MAAM,0CACR,QAAM,EAAE,MAAM;AAGhB,aAAS,MAAO,KAAI,OAAK,EAAE;AACzB,SAAG,QAAC,GAAG,EAAI,IAAI,QAAC,GAAG;;AAGrB,QAAI,MAAM,kBAAU,CAAC,GAAG;AAExB,sBAAa,KAAK,CAAC,GAAG;EACxB;;AAGE,6BAAoB;EACtB;;AAGE,yBAAgB,AAAI,kBAAS,CAAC;AAC9B,sBAAa,SAAO,OAAO,CAAC,QAAC,CAAC,IAAK,aAAQ;AAE3C,uBAAc;AACd,qBAAY;AACZ,oBAAW;AACX,oBAAW;EACb;;AAGE,aAAK,QAAQ,MAAa,EAAE,OAAmB;AAC7C,aAAO,UAAQ,CAAC,QAAC,KAAK;AACpB,iBAAI,CAAC,MAAM,EACP,sCAAc,UAAQ,aAAE,KAAK,SAAO,EAAE,GAAE,UAAQ,aAAE,KAAK,SAAO,EAAE;;;YAHnE;AAOL,eAAM,eAAa,OAAO,CAAC,QAAC,CAAC;AAC3B,aAAO,CAAC,aAAW,EAAE,CAAC,QAAQ;;AAGhC,eAAM,cAAY,OAAO,CAAC,QAAC,CAAC;AAC1B,aAAO,CAAC,YAAU,EAAE,CAAC,QAAQ;;AAG/B,eAAM,aAAW,OAAO,CAAC,QAAC,CAAC;AACzB,eAAI,CAAC,WAAS,EAAE;;AAGlB,eAAM,gBAAc,OAAO,CAAC,QAAC,CAAC;AAC5B,eAAI,CAAC,WAAS,EAAE;;EAEpB;;AAGE,eAAM,UAAQ,OAAO,CAAC,QAAC,CAAC;AACtB,UAAI,8BAAU,CAAC,SAAO;AACtB,UAAI,UAAU,OAAO,QAAQ,cAAY;AACzC,UAAI,OAAO,KAAI,UAAU,OAAO,KAAI,QAAQ;AAC1C;;AAEF,UAAI,OAAO,aAAQ,mBAAiB,eAAC,OAAO;AAC5C,UAAI,eAAe,IAAI,QAAQ,CAAC,OAAO;AACvC,UAAI,MAAM,yCACR,QAAM,EAAE,OAAK,EACb,OAAK,EAAE,AAAG,OAAO,kBAAI,YAAY;AAEnC,wBAAa,KAAK,CAAC,kBAAU,CAAC,GAAG;;EAErC;;AAKE,eAAM,WAAS,OAAO,CAAC,QAAC,CAAC;AACvB,UAAI,MAAM,yCACR,QAAM,EAAE,QAAM,EACd,UAAQ,EAAE,WAAM,UAAQ;AAE1B,wBAAa,KAAK,CAAC,kBAAU,CAAC,GAAG;;EAErC;;AAGE,QAAI,kBAAa,IAAI,MAAM;AACzB;;AAEF,QAAI,MAAM,yCACR,QAAM,EAAE,UAAQ,EAChB,MAAI,EAAE,aAAQ,OAAK,YAAU,EAC7B,MAAI,EAAE,aAAQ,KAAK,YAAU;AAE/B,sBAAa,KAAK,CAAC,kBAAU,CAAC,GAAG;EACnC;;AAGE,QAAI,WAAW,AAAI,yBAAgB,CAAC,SAAC,IAAI,EAAE,QAAQ;AACjD,mBAAQ;;AAEV,YAAQ,UAAQ,CAAC,aAAQ,KAAK,eACd,qBAAqB,iBAAiB,eAAe;EACvE","file":"send.ddc.js"}');
  // Exports:
  return {
    send: send
  };
});

//# sourceMappingURL=send.ddc.js.map
