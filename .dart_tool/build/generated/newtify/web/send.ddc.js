define(['dart_sdk'], function(dart_sdk) {
  'use strict';
  const core = dart_sdk.core;
  const html = dart_sdk.html;
  const _js_helper = dart_sdk._js_helper;
  const convert = dart_sdk.convert;
  const dart = dart_sdk.dart;
  const dartx = dart_sdk.dartx;
  const _root = Object.create(null);
  const send = Object.create(_root);
  const $onOpen = dartx.onOpen;
  const $target = dartx.target;
  const $toLowerCase = dartx.toLowerCase;
  const $querySelectorAll = dartx.querySelectorAll;
  const $onClick = dartx.onClick;
  const $scrollY = dartx.scrollY;
  const $onScroll = dartx.onScroll;
  const $innerHtml = dartx.innerHtml;
  const $head = dartx.head;
  const $observe = dartx.observe;
  let EventTovoid = () => (EventTovoid = dart.constFn(dart.fnType(dart.void, [html.Event])))();
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
  send.main = function() {
    send.connectSendWebSocket();
  };
  send.connectSendWebSocket = function() {
    send.sendWebSocket = html.WebSocket.new("ws://localhost:9000/send");
    send.sendWebSocket[$onOpen].listen(dart.fn(_ => send.sendHtml(), EventTovoid()));
    send.listenMutation();
    send.listenScroll();
    send.listenClick();
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
  }, '{"version":3,"sourceRoot":"","sources":["send.dart"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;MAKU,kBAAa;;;;;;AAGrB,6BAAoB;EACtB;;AAGE,yBAAgB,AAAI,kBAAS,CAAC;AAC9B,sBAAa,SAAO,OAAO,CAAC,QAAC,CAAC,IAAK,aAAQ;AAE3C,uBAAc;AACd,qBAAY;AACZ,oBAAW;EACb;;AAGE,eAAM,UAAQ,OAAO,CAAC,QAAC,CAAC;AACtB,UAAI,8BAAU,CAAC,SAAO;AACtB,UAAI,UAAU,OAAO,QAAQ,cAAY;AACzC,UAAI,OAAO,KAAI,UAAU,OAAO,KAAI,QAAQ;AAC1C;;AAEF,UAAI,OAAO,aAAQ,mBAAiB,eAAC,OAAO;AAC5C,UAAI,eAAe,IAAI,QAAQ,CAAC,OAAO;AACvC,UAAI,MAAM,yCACR,QAAM,EAAE,OAAK,EACb,OAAK,EAAE,AAAG,OAAO,kBAAI,YAAY;AAEnC,wBAAa,KAAK,CAAC,kBAAU,CAAC,GAAG;;EAErC;;AAKE,eAAM,WAAS,OAAO,CAAC,QAAC,CAAC;AACvB,UAAI,MAAM,yCACR,QAAM,EAAE,QAAM,EACd,UAAQ,EAAE,WAAM,UAAQ;AAE1B,wBAAa,KAAK,CAAC,kBAAU,CAAC,GAAG;;EAErC;;AAGE,QAAI,kBAAa,IAAI,MAAM;AACzB;;AAEF,QAAI,MAAM,yCACR,QAAM,EAAE,UAAQ,EAChB,MAAI,EAAE,aAAQ,OAAK,YAAU,EAC7B,MAAI,EAAE,aAAQ,KAAK,YAAU;AAE/B,sBAAa,KAAK,CAAC,kBAAU,CAAC,GAAG;EACnC;;AAGE,QAAI,WAAW,AAAI,yBAAgB,CAAC,SAAC,IAAI,EAAE,QAAQ;AACjD,mBAAQ;;AAEV,YAAQ,UAAQ,CAAC,aAAQ,KAAK,eACd,qBAAqB,iBAAiB,eAAe;EACvE","file":"send.ddc.js"}');
  // Exports:
  return {
    send: send
  };
});

//# sourceMappingURL=send.ddc.js.map
