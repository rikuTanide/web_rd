import 'package:websocket_rd/send.dart' as rdSend;
import 'package:websocket_rd/receive.dart' as rdReceive;
import 'dart:html';
import 'dart:convert';

void main() {
  var configJson = document.getElementById('rd-config').text;
  var config = jsonDecode(configJson);
  String wsHost = config["host"];
  int wsPort = config["port"];
  String schema = config["schema"];
  String skywayKey = config["skywayKey"];

  if (config["method"] == "receive") {
    rdReceive.start(schema, wsHost, wsPort, skywayKey);
  } else if (config["method"] == "send") {
    rdSend.start(schema, wsHost, wsPort, skywayKey);
  }
}
