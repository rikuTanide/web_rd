import 'dart:convert';
import 'dart:html';

import 'package:skyway_interop/skyway.dart';
import 'package:websocket_rd/consts.dart';

WebSocket receiverWebSocket;
Peer peer;

DivElement touchCursor;

void sendReceiverWebSocket(String action, Map<String, dynamic> body) {
  if (receiverWebSocket == null) {
    return;
  }
  var msg = <String, dynamic>{
    ACTION: action,
  };

  for (var key in body.keys) {
    msg[key] = body[key];
  }

  var str = jsonEncode(msg);

  receiverWebSocket.send(str);
}

void start(String schema, String wsHost, int wsPort, String skyWayKey) {
  connectReceiveWebSocket(schema, wsHost, wsPort);
  touchCursor = new DivElement()
    ..style.position = "fixed"
    ..style.width = "10px"
    ..style.height = "10px"
    ..style.backgroundColor = "pink";
  setUpSkyWay(skyWayKey);
}

void setUpSkyWay(String skyWayKey) async {
  peer = new Peer(skyWayKey);
  await peer.onOpen;
  sendReceiverWebSocket(RECEIVER_SKYWAY_OPEN, {
    SKYWAY_PEER_ID: peer.peerID,
  });

  peer.onConnection.listen(onConnection);
}

void onConnection(Connection connection) {
  connection.onData.listen((data) {
    print(data);
  });
}

void connectReceiveWebSocket(String schema, String wsHost, int wsPort) {
  receiverWebSocket = new WebSocket("${schema}://${wsHost}:${wsPort}/receive");
  receiverWebSocket.onMessage.listen((e) => receiveMessage(e));
}

void receiveMessage(MessageEvent e) {
  String data = e.data;
  Map<String, Object> msg = jsonDecode(data);

  switch (msg[ACTION]) {
    case MUTATING:
      onReceiveMutating(msg);
      return;
    case SCROLL:
      onScrollY(msg);
      return;
    case CLICK:
      onClick(msg);
      return;
    case TOUCH_START:
    case TOUCH_MOVE:
      onTouchMove(msg);
      return;
    case TOUCH_END:
      onTouchEnd(msg);
      return;
    case INPUT:
      onInput(msg);
      return;
  }
}

void onInput(Map<String, Object> msg) {
  String xpath = msg[XPATH];
  var element = getByXPath(xpath);
  (element as InputElement).value = msg[VALUE];
}

void onTouchEnd(Map<String, Object> msg) {
  touchCursor.style.display = "none";
}

void onTouchMove(Map<String, Object> msg) {
  int y = msg[CLIENT_Y];
  int x = msg[CLIENT_X];
  touchCursor.style
    ..display = "block"
    ..top = "${y - 5}px"
    ..left = "${x - 5}px";
}

Element getByXPath(String xpath) {
  var xpaths = xpath.split('/');
  var tagName = xpaths[0];
  var index = int.parse(xpaths[1]);

  var elements = document.querySelectorAll(tagName);
  return elements[index];
}

void onClick(Map<String, Object> msg) {
  String xpath = msg[XPATH];
  var element = getByXPath(xpath);
  var backgroundColor = element.style.backgroundColor;
  if (backgroundColor == "") {
    backgroundColor = "transparent";
  }

  var keyFlames = <Map<String, dynamic>>[
    {
      "backgroundColor": "red",
    },
    {
      "backgroundColor": backgroundColor,
    }
  ];
  element.animate(keyFlames, 1000).play();
}

void onScrollY(Map<String, Object> msg) {
  int scrollY = msg[SCROLL_Y];
  window.scrollTo(0, scrollY);
}

void onReceiveMutating(Map<String, Object> msg) {
  var headFrag = new DocumentFragment.html(msg[HEAD],
      treeSanitizer: NodeTreeSanitizer.trusted);
  var bodyFrag = new DocumentFragment.html(msg[BODY],
      treeSanitizer: NodeTreeSanitizer.trusted);
  var base = new BaseElement()..href = msg[URL];

  sanitize(headFrag);
  deleteAttrsAll(headFrag.nodes);
  sanitize(bodyFrag);
  deleteAttrsAll(bodyFrag.nodes);

  document.head
    ..nodes.clear()
    ..append(headFrag)
    ..append(base);

  document.body
    ..nodes.clear()
    ..append(bodyFrag)
    ..append(touchCursor);

  var scrollY = int.parse(msg[SCROLL_Y]);
  window.scrollTo(0, scrollY);
}

void sanitize(DocumentFragment frag) {
  var scripts = frag.querySelectorAll('script');
  for (var script in scripts) {
    script.remove();
  }
}

void deleteAttrsAll(List<Node> list) {
  list.where((n) => n is HtmlElement).forEach((e) => deleteAttrs(e));
}

void deleteAttrs(HtmlElement element) {
  var keys = element.attributes.keys
      .where((key) => key.toLowerCase().startsWith('on'));
  keys.forEach((key) => element.attributes.remove(key));
  deleteAttrsAll(element.nodes);
}
