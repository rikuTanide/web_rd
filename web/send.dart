import 'dart:convert';
import 'dart:html';

import 'package:newtify/consts.dart';

WebSocket sendWebSocket;

void send(String action, Map<String, dynamic> body) {
  var msg = <String, dynamic>{
    ACTION: action,
  };

  for (var key in body.keys) {
    msg[key] = body[key];
  }

  var str = jsonEncode(msg);

  sendWebSocket.send(str);
}

void main() {
  connectSendWebSocket();
}

void connectSendWebSocket() {
  sendWebSocket = new WebSocket('ws://localhost:9000/send');
  sendWebSocket.onOpen.listen((_) => sendHtml());

  listenMutation();
  listenScroll();
  listenClick();
  listenTouch();
}

void listenTouch() {
  void handler(String action, List<Touch> touches) {
    touches.forEach((touch) {
      send(action,
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
    send(TOUCH_END, {});
  });

  window.onTouchCancel.listen((e) {
    send(TOUCH_END, {});
  });
}

void listenClick() {
  window.onClick.listen((e) {
    var element = e.target as HtmlElement;
    var tagName = element.tagName.toLowerCase();
    if (tagName == "body" || tagName == "html") {
      return;
    }
    var tags = document.querySelectorAll(tagName);
    var elementIndex = tags.indexOf(element);
    var msg = {
      ACTION: CLICK,
      XPATH: "${tagName}/${elementIndex}",
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
