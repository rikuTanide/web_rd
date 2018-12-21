define(['dart_sdk'], function(dart_sdk) {
  'use strict';
  const core = dart_sdk.core;
  const html = dart_sdk.html;
  const convert = dart_sdk.convert;
  const _js_helper = dart_sdk._js_helper;
  const _interceptors = dart_sdk._interceptors;
  const dart = dart_sdk.dart;
  const dartx = dart_sdk.dartx;
  const _root = Object.create(null);
  const receive = Object.create(_root);
  const $position = dartx.position;
  const $width = dartx.width;
  const $height = dartx.height;
  const $backgroundColor = dartx.backgroundColor;
  const $onMessage = dartx.onMessage;
  const $data = dartx.data;
  const $_get = dartx._get;
  const $display = dartx.display;
  const $top = dartx.top;
  const $left = dartx.left;
  const $split = dartx.split;
  const $querySelectorAll = dartx.querySelectorAll;
  const $animate = dartx.animate;
  const $scrollTo = dartx.scrollTo;
  const $nodes = dartx.nodes;
  const $head = dartx.head;
  const $clear = dartx.clear;
  const $append = dartx.append;
  const $remove = dartx.remove;
  const $forEach = dartx.forEach;
  const $where = dartx.where;
  const $startsWith = dartx.startsWith;
  const $toLowerCase = dartx.toLowerCase;
  const $keys = dartx.keys;
  const $attributes = dartx.attributes;
  let MessageEventTovoid = () => (MessageEventTovoid = dart.constFn(dart.fnType(dart.void, [html.MessageEvent])))();
  let MapOfString$Object = () => (MapOfString$Object = dart.constFn(core.Map$(core.String, core.Object)))();
  let IdentityMapOfString$dynamic = () => (IdentityMapOfString$dynamic = dart.constFn(_js_helper.IdentityMap$(core.String, dart.dynamic)))();
  let MapOfString$dynamic = () => (MapOfString$dynamic = dart.constFn(core.Map$(core.String, dart.dynamic)))();
  let JSArrayOfMapOfString$dynamic = () => (JSArrayOfMapOfString$dynamic = dart.constFn(_interceptors.JSArray$(MapOfString$dynamic())))();
  let NodeTovoid = () => (NodeTovoid = dart.constFn(dart.fnType(dart.void, [html.Node])))();
  let NodeTobool = () => (NodeTobool = dart.constFn(dart.fnType(core.bool, [html.Node])))();
  let StringTobool = () => (StringTobool = dart.constFn(dart.fnType(core.bool, [core.String])))();
  let StringToString = () => (StringToString = dart.constFn(dart.fnType(core.String, [core.String])))();
  dart.defineLazy(receive, {
    /*receive.receiveWebSocket*/get receiveWebSocket() {
      return null;
    },
    set receiveWebSocket(_) {},
    /*receive.touchCursor*/get touchCursor() {
      return null;
    },
    set touchCursor(_) {}
  });
  receive.main = function() {
    receive.connectReceiveWebSocket();
    receive.touchCursor = (() => {
      let _ = html.DivElement.new();
      _.style[$position] = "fixed";
      _.style[$width] = "10px";
      _.style[$height] = "10px";
      _.style[$backgroundColor] = "pink";
      return _;
    })();
  };
  receive.connectReceiveWebSocket = function() {
    receive.receiveWebSocket = html.WebSocket.new("ws://localhost:9000/receive");
    receive.receiveWebSocket[$onMessage].listen(dart.fn(e => receive.receiveHtml(e), MessageEventTovoid()));
  };
  receive.receiveHtml = function(e) {
    let data = core.String._check(e[$data]);
    let msg = MapOfString$Object()._check(convert.jsonDecode(data));
    switch (msg[$_get]("action")) {
      case "mutating":
      {
        receive.onReceiveMutating(msg);
        return;
      }
      case "scroll":
      {
        receive.onScrollY(msg);
        return;
      }
      case "click":
      {
        receive.onClick(msg);
        return;
      }
      case "touch_start":
      case "touch_move":
      {
        receive.onTouchMove(msg);
        return;
      }
      case "touch_end":
      {
        receive.onTouchEnd(msg);
        return;
      }
    }
  };
  receive.onTouchEnd = function(msg) {
    receive.touchCursor.style[$display] = "none";
  };
  receive.onTouchMove = function(msg) {
    let y = core.int._check(msg[$_get]("client_y"));
    let x = core.int._check(msg[$_get]("client_x"));
    receive.touchCursor.style[$display] = "block";
    receive.touchCursor.style[$top] = dart.str(dart.notNull(y) - 5) + "px";
    receive.touchCursor.style[$left] = dart.str(dart.notNull(x) - 5) + "px";
  };
  receive.onClick = function(msg) {
    let xpath = core.String._check(msg[$_get]("xpath"));
    let tagName = xpath[$split]("/")[$_get](0);
    let index = core.int.parse(xpath[$split]("/")[$_get](1));
    let elements = html.document[$querySelectorAll](html.Element, tagName);
    let element = elements._get(index);
    let backgroundColor = element.style[$backgroundColor];
    if (backgroundColor === "") {
      backgroundColor = "transparent";
    }
    let keyFlames = JSArrayOfMapOfString$dynamic().of([new (IdentityMapOfString$dynamic()).from(["backgroundColor", "red"]), new (IdentityMapOfString$dynamic()).from(["backgroundColor", backgroundColor])]);
    element[$animate](keyFlames, 1000).play();
  };
  receive.onScrollY = function(msg) {
    let scrollY = core.int._check(msg[$_get]("scroll_y"));
    html.window[$scrollTo](0, scrollY);
  };
  receive.onReceiveMutating = function(msg) {
    let headFrag = html.DocumentFragment.html(core.String._check(msg[$_get]("head")), {treeSanitizer: html.NodeTreeSanitizer.trusted});
    let bodyFrag = html.DocumentFragment.html(core.String._check(msg[$_get]("body")), {treeSanitizer: html.NodeTreeSanitizer.trusted});
    receive.sanitize(headFrag);
    receive.deleteAttrsAll(headFrag[$nodes]);
    receive.sanitize(bodyFrag);
    receive.deleteAttrsAll(bodyFrag[$nodes]);
    let _ = html.document[$head];
    _[$nodes][$clear]();
    _[$append](headFrag);
    let _$ = html.document.body;
    _$[$nodes][$clear]();
    _$[$append](bodyFrag);
    _$[$append](receive.touchCursor);
  };
  receive.sanitize = function(frag) {
    let scripts = frag[$querySelectorAll](html.Element, "script");
    for (let script of scripts) {
      script[$remove]();
    }
  };
  receive.deleteAttrsAll = function(list) {
    list[$where](dart.fn(n => html.HtmlElement.is(n), NodeTobool()))[$forEach](dart.fn(e => receive.deleteAttrs(html.HtmlElement._check(e)), NodeTovoid()));
  };
  receive.deleteAttrs = function(element) {
    let keys = element[$attributes][$keys][$where](dart.fn(key => key[$toLowerCase]()[$startsWith]("on"), StringTobool()));
    keys[$forEach](dart.fn(key => element[$attributes][$remove](key), StringToString()));
    receive.deleteAttrsAll(element[$nodes]);
  };
  dart.trackLibraries("web/receive.ddc", {
    "receive.dart": receive
  }, '{"version":3,"sourceRoot":"","sources":["receive.dart"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;MAKU,wBAAgB;;;;MACf,mBAAW;;;;;;AAGpB,mCAAuB;AACvB;cAAc,AAAI,mBAAU;2BACP;wBACH;yBACC;kCACS;;;EAC9B;;AAGE,+BAAmB,AAAI,kBAAS,CAAC;AACjC,4BAAgB,YAAU,OAAO,CAAC,QAAC,CAAC,IAAK,mBAAW,CAAC,CAAC;EACxD;iCAEiB,CAAc;AAC7B,QAAO,0BAAO,CAAC,OAAK;AACpB,QAAoB,kCAAM,kBAAU,CAAC,IAAI;AAEzC,YAAQ,GAAG,QAAC,QAAM;UACX,WAAQ;;AACX,iCAAiB,CAAC,GAAG;AACrB;;UACG,SAAM;;AACT,yBAAS,CAAC,GAAG;AACb;;UACG,QAAK;;AACR,uBAAO,CAAC,GAAG;AACX;;UACG,cAAW;UACX,aAAU;;AACb,2BAAW,CAAC,GAAG;AACf;;UACG,YAAS;;AACZ,0BAAU,CAAC,GAAG;AACd;;;EAEN;gCAEgB,GAAuB;AACrC,uBAAW,MAAM,UAAQ,GAAG;EAC9B;iCAEiB,GAAuB;AACtC,QAAI,oBAAI,GAAG,QAAC,UAAQ;AACpB,QAAI,oBAAI,GAAG,QAAC,UAAQ;AACpB,IAAA,AACE,AAAE,mBADO,MAAM,UACN,GAAG;IADd,AAEE,AAAE,mBAFO,MAAM,MAEV,GAAG,SAAK,aAAF,CAAC,IAAG;IAFjB,AAGE,AAAE,mBAHO,MAAM,OAGT,GAAG,SAAK,aAAF,CAAC,IAAG;EACpB;6BAEa,GAAuB;AAClC,QAAO,2BAAQ,GAAG,QAAC,OAAK;AACxB,QAAI,UAAU,KAAK,QAAM,CAAC,YAAK;AAC/B,QAAI,QAAQ,QAAG,MAAM,CAAC,KAAK,QAAM,CAAC,YAAK;AAEvC,QAAI,WAAW,aAAQ,mBAAiB,eAAC,OAAO;AAChD,QAAI,UAAU,QAAQ,MAAC,KAAK;AAE5B,QAAI,kBAAkB,OAAO,MAAM,kBAAgB;AACnD,QAAI,eAAe,KAAI,IAAI;AACzB,qBAAe,GAAG;;AAGpB,QAAI,YAAY,mCACd,0CACE,mBAAmB,SAErB,0CACE,mBAAmB,eAAe;AAGtC,WAAO,UAAQ,CAAC,SAAS,EAAE,UAAU;EACvC;+BAEe,GAAuB;AACpC,QAAI,0BAAU,GAAG,QAAC,UAAQ;AAC1B,eAAM,WAAS,CAAC,GAAG,OAAO;EAC5B;uCAEuB,GAAuB;AAC5C,QAAI,WAAW,AAAI,0BAAqB,oBAAC,GAAG,QAAC,MAAI,oBAC9B,sBAAiB,QAAQ;AAC5C,QAAI,WAAW,AAAI,0BAAqB,oBAAC,GAAG,QAAC,MAAI,oBAC9B,sBAAiB,QAAQ;AAE5C,oBAAQ,CAAC,QAAQ;AACjB,0BAAc,CAAC,QAAQ,QAAM;AAC7B,oBAAQ,CAAC,QAAQ;AACjB,0BAAc,CAAC,QAAQ,QAAM;AAE7B,yBAAQ,OAAK;;eAEF,QAAQ;AAEnB,0BAAQ,KAAK;;gBAEF,QAAQ;gBACR,mBAAW;EACxB;8BAEc,IAAqB;AACjC,QAAI,UAAU,IAAI,mBAAiB,eAAC;AACpC,aAAS,SAAU,QAAO,EAAE;AAC1B,YAAM,SAAO;;EAEjB;oCAEoB,IAAe;AACjC,QAAI,QAAM,CAAC,QAAC,CAAC,wBAAK,CAAC,2BAAwB,CAAC,QAAC,CAAC,IAAK,mBAAW,yBAAC,CAAC;EAClE;iCAEiB,OAAmB;AAClC,QAAI,OAAO,OAAO,aAAW,OAAK,QACxB,CAAC,QAAC,GAAG,IAAK,GAAG,cAAY,eAAa,CAAC;AACjD,QAAI,UAAQ,CAAC,QAAC,GAAG,IAAK,OAAO,aAAW,SAAO,CAAC,GAAG;AACnD,0BAAc,CAAC,OAAO,QAAM;EAC9B","file":"receive.ddc.js"}');
  // Exports:
  return {
    receive: receive
  };
});

//# sourceMappingURL=receive.ddc.js.map
