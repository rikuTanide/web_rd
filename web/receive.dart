import 'dart:convert';
import 'dart:html';

import 'package:newtify/consts.dart';

WebSocket receiveWebSocket;

void main() {
  connectReceiveWebSocket();
}

void connectReceiveWebSocket() {
  receiveWebSocket = new WebSocket('ws://localhost:9000/receive');
  receiveWebSocket.onMessage.listen((e) => receiveHtml(e));
}

void receiveHtml(MessageEvent e) {
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
  }
}

void onClick(Map<String, Object> msg) {
  String xpath = msg[XPATH];
  var tagName = xpath.split('/')[0];
  var index = int.parse(xpath.split('/')[1]);

  var elements = document.querySelectorAll(tagName);
  var element = elements[index];
  element.style.backgroundColor = "red";
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

  sanitize(headFrag);
  deleteAttrsAll(headFrag.nodes);
  sanitize(bodyFrag);
  deleteAttrsAll(bodyFrag.nodes);

  document.head
    ..nodes.clear()
    ..append(headFrag);

  document.body
    ..nodes.clear()
    ..append(bodyFrag);
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
