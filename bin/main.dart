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

WebSocket receiverWebSocket, senderWebSocket;

void sendToSenderWebSocket(String action, Map<String, dynamic> body) {
  if (senderWebSocket == null) {
    return;
  }
  var msg = <String, dynamic>{
    ACTION: action,
  };

  for (var key in body.keys) {
    msg[key] = body[key];
  }

  var str = jsonEncode(msg);

  senderWebSocket.add(str);
}

void sendToReceiverWebSocket(String action, Map<String, dynamic> body) {
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

  receiverWebSocket.add(str);
}

void onSendWebSocket(HttpRequest req) async {
  senderWebSocket = await WebSocketTransformer.upgrade(req);
  await for (var msg in senderWebSocket) {
    onMessage(msg);
  }
}

void onMessage(String msg) {
  var msgMap = jsonDecode(msg);
  switch (msgMap[ACTION]) {
    case CONNECT:
      onConnect();
      return;
  }
}

String receiverPeerID = "";

void onReceiverSkyWayOpen(msgMap) {
  receiverPeerID = msgMap[SKYWAY_PEER_ID];
  sendToSenderWebSocket(RECEIVER_SKYWAY_OPEN, {
    SKYWAY_PEER_ID: receiverPeerID,
  });
}

void onConnect() {
  if (receiverPeerID != "") {
    sendToSenderWebSocket(RECEIVER_SKYWAY_OPEN, {
      SKYWAY_PEER_ID: receiverPeerID,
    });
  }
}

void onReceiveWebSocket(HttpRequest req) async {
  receiverWebSocket = await WebSocketTransformer.upgrade(req);
  await for (var msg in receiverWebSocket) {
    onReceiverMessage(msg);
  }
}

void onReceiverMessage(String msg) {
  var msgMap = jsonDecode(msg);
  switch (msgMap[ACTION]) {
    case RECEIVER_SKYWAY_OPEN:
      onReceiverSkyWayOpen(msgMap);
      return;
  }
}
