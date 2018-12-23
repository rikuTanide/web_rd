import 'package:websocket_rd/send.dart' as rdSend;
import 'package:websocket_rd/receive.dart' as rdReceive;
import 'dart:html';
import 'dart:convert';

void main() {
  var configJson = document.getElementById('rd-config').text;
  var config = jsonDecode(configJson);
  String wsHost = config["host"];
  int wsPort = config["port"];
  if (config["method"] == "receive") {
    rdReceive.start(wsHost, wsPort);
  } else if (config["method"] == "send") {
    rdSend.start(wsHost, wsPort);
  }
}
