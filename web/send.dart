import 'dart:convert';
import 'dart:html';

import 'package:newtify/consts.dart';

WebSocket sendWebSocket;

void main() {
  connectSendWebSocket();
}

void connectSendWebSocket() {
  sendWebSocket = new WebSocket('ws://localhost:9000/send');
  sendWebSocket.onOpen.listen((_) => sendHtml());

  listenMutation();
  listenScroll();
  listenClick();
}

void listenClick() {
  window.onClick.listen((e) {
    var element = e.target as HtmlElement;
    var tags = document.querySelectorAll(element.tagName);
    var elementIndex = tags.indexOf(element);
    var msg = {
      ACTION: CLICK,
      XPATH: "${element.tagName}/${elementIndex}",
    };
    sendWebSocket.send(jsonEncode(msg));
  });
}

void listenScroll() {
  // passive trueにする方法がわからなかった。
  // addEventListenerでもだめだった。
  window.onScroll.listen((e) {
    var msg = {
      ACTION: SCROLL,
      SCROLL_Y: window.scrollY,
    };
    sendWebSocket.send(jsonEncode(msg));
  });
}

void sendHtml() {
  if (sendWebSocket == null) {
    return;
  }
  var msg = {
    ACTION: MUTATING,
    HEAD: document.head.innerHtml,
    BODY: document.body.innerHtml,
  };
  sendWebSocket.send(jsonEncode(msg));
}

void listenMutation() {
  var observer = new MutationObserver((list, observer) {
    sendHtml();
  });
  observer.observe(document.body,
      attributes: true, characterData: true, childList: true, subtree: true);
}
