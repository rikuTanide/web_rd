import 'dart:async';
import 'dart:io';
import 'dart:convert';

import 'package:websocket_rd/consts.dart';


void main() {
  HttpServer.bind(Platform.environment['DART_HOST'],
          int.parse(Platform.environment['DART_PORT']))
      .then((server) => onServer(server));
}

void onServer(HttpServer server) async {
  await for (var req in server) {
    if (WebSocketTransformer.isUpgradeRequest(req)) {
      onWebSocketRequest(req);
    } else {
      req.response.close();
    }
  }
}

void onWebSocketRequest(HttpRequest req) {
  if (req.uri.path == "/send") {
    onSendWebSocket(req);
  } else if (req.uri.path == "/receive") {
    onReceiveWebSocket(req);
  } else {
    req.response.close();
  }
}

WebSocket receiveWebSocket, sendWebSocket;

void onSendWebSocket(HttpRequest req) async {
  sendWebSocket = await WebSocketTransformer.upgrade(req);
  await for (var msg in sendWebSocket) {
    onMessage(msg);
  }
}

void onMessage(String msg) {
  var msgMap = jsonDecode(msg);
  switch (msgMap[ACTION]) {
    case CONNECT:
      onConnect();
      return;
    case MUTATING:
      onMutating(msgMap);
      return;
    case SCROLL:
      onScroll(msgMap);
      return;
    case CLICK:
      onClick(msgMap);
      return;
    case TOUCH_END:
    case TOUCH_START:
    case TOUCH_MOVE:
      forward(msgMap);
  }
}

void forward(dynamic msg) {
  receiveWebSocket.add(jsonEncode(msg));
}

void onClick(msgMap) {
  String xpath = msgMap[XPATH];
  if (receiveWebSocket == null) {
    return;
  }

  var msg = {
    ACTION: CLICK,
    XPATH: xpath,
  };

  receiveWebSocket.add(jsonEncode(msg));
}

void onScroll(msgMap) {
  int scrollY = msgMap[SCROLL_Y];
  if (receiveWebSocket == null) {
    return;
  }

  var msg = {
    ACTION: SCROLL,
    SCROLL_Y: scrollY,
  };

  receiveWebSocket.add(jsonEncode(msg));
}

void onMutating(Map<String, Object> msgMap) {
  String head = msgMap[HEAD];
  String body = msgMap[BODY];
  String url = msgMap[URL];
  if (receiveWebSocket == null) {
    return;
  }

  sendHtml(head, body, url);
}

void sendHtml(String head, String body, String url) {
  var msg = {
    ACTION: MUTATING,
    HEAD: head,
    BODY: body,
    URL: url,
  };

  receiveWebSocket.add(jsonEncode(msg));
}

void onConnect() {}

void onReceiveWebSocket(HttpRequest req) async {
  receiveWebSocket = await WebSocketTransformer.upgrade(req);
}
