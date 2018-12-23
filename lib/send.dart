import 'dart:convert';
import 'dart:html';

import 'package:skyway_interop/skyway.dart';
import 'package:websocket_rd/consts.dart';

WebSocket sendWebSocket;

void sendByWebSocket(String action, Map<String, dynamic> body) {
  if (sendWebSocket == null) {
    return;
  }
  var msg = <String, dynamic>{
    ACTION: action,
  };

  for (var key in body.keys) {
    msg[key] = body[key];
  }

  var str = jsonEncode(msg);

  sendWebSocket.send(str);
}

void sendBySkyWay(String action, Map<String, dynamic> body) {
  if (connection == null) {
    return;
  }
  var msg = <String, dynamic>{
    ACTION: action,
  };

  for (var key in body.keys) {
    msg[key] = body[key];
  }

  var str = jsonEncode(msg);

  connection.send(str);
}

void start(String schema, String wsHost, int wsPort, String skyWayKey) {
  connectSkyWay(skyWayKey);

  connectSendWebSocket(schema, wsHost, wsPort);
}

Peer peer;

void connectSkyWay(String skyWayKey) {
  peer = new Peer(skyWayKey);
}

void connectSendWebSocket(String schema, String wsHost, int wsPort) {
  sendWebSocket = new WebSocket("${schema}://${wsHost}:${wsPort}/send");
  sendWebSocket.onOpen.listen((_) => onWebSocketOpen());
  sendWebSocket.onMessage.listen((data) => receiveWebSocketMessage(data));

  listenMutation();
  listenScroll();
  listenClick();
  listenTouch();
  listenInput();
}

void onWebSocketOpen() {
  sendConnect();
  listenMutation();
  listenScroll();
  listenClick();
  listenTouch();
  listenInput();
}

void receiveWebSocketMessage(MessageEvent e) {
  String data = e.data;
  Map<String, Object> msg = jsonDecode(data);

  switch (msg[ACTION]) {
    case RECEIVER_SKYWAY_OPEN:
      onReceiverSkyWayOpen(msg);
      return;
  }
}

Connection connection;

void onReceiverSkyWayOpen(Map<String, Object> msg) async {
  String peerID = msg[SKYWAY_PEER_ID];
  await peer.onOpen;
  connection = await peer.connect(peerID);
  sendHtml();
}

void sendConnect() {
  sendByWebSocket(CONNECT, {});
}

void listenInput() {
  window.onKeyUp.listen((e) {
    var target = e.target;
    if (target is InputElement) {
      var xpath = getXpath(target);
      var value = target.value;
      sendBySkyWay(INPUT, {XPATH: xpath, VALUE: value});
    }
  });
}

void listenTouch() {
  void handler(String action, List<Touch> touches) {
    touches.forEach((touch) {
      sendBySkyWay(action,
          <String, int>{CLIENT_X: touch.client.x, CLIENT_Y: touch.client.y});
    });
  }

  window.onTouchStart.listen((e) {
    handler(TOUCH_START, e.touches);
  });

  window.onTouchMove.listen((e) {
    handler(TOUCH_MOVE, e.touches);
  });

  window.onTouchEnd.listen((e) {
    sendBySkyWay(TOUCH_END, {});
  });

  window.onTouchCancel.listen((e) {
    sendBySkyWay(TOUCH_END, {});
  });
}

void listenClick() {
  window.onClick.listen((e) {
    var element = e.target as HtmlElement;
    var tagName = element.tagName.toLowerCase();
    if (tagName == "body" || tagName == "html") {
      return;
    }

    sendBySkyWay(CLICK, {
      XPATH: getXpath(element),
    });
  });
}

String getXpath(HtmlElement element) {
  var tagName = element.tagName.toLowerCase();
  var tags = document.querySelectorAll(tagName);
  var elementIndex = tags.indexOf(element);
  return "${tagName}/${elementIndex}";
}

void listenScroll() {
  // passive trueにする方法がわからなかった。
  // addEventListenerでもだめだった。
  window.onScroll.listen((e) {
    var msg = {
      SCROLL_Y: window.scrollY,
    };
    sendBySkyWay(SCROLL, msg);
  });
}

void sendHtml() {
  var msg = {
    HEAD: document.head.innerHtml,
    BODY: document.body.innerHtml,
    URL: window.location.href,
    SCROLL_Y: window.scrollY,
  };
  sendBySkyWay(MUTATING, msg);
}

void listenMutation() {
  var observer = new MutationObserver((list, observer) {
    sendHtml();
  });
  observer.observe(document.body,
      attributes: true, characterData: true, childList: true, subtree: true);
}
