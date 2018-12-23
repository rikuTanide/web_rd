import 'dart:convert';
import 'dart:html';

import 'package:websocket_rd/consts.dart';

WebSocket sendWebSocket;

void send(String action, Map<String, dynamic> body) {
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

void start(String wsHost, int wsPort) {
  connectSendWebSocket(wsHost, wsPort);
}

void connectSendWebSocket(String wsHost, int wsPort) {
  sendWebSocket = new WebSocket("wss://${wsHost}:${wsPort}/send");
  sendWebSocket.onOpen.listen((_) => sendHtml());

  listenMutation();
  listenScroll();
  listenClick();
  listenTouch();
  listenInput();
}

void listenInput() {
  window.onKeyUp.listen((e) {
    print("ii");
    var target = e.target;
    if (target is InputElement) {
      var xpath = getXpath(target);
      var value = target.value;
      send(INPUT, {XPATH: xpath, VALUE: value});
    }
  });
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

    send(CLICK, {
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
    send(SCROLL, msg);
  });
}

void sendHtml() {
  var msg = {
    HEAD: document.head.innerHtml,
    BODY: document.body.innerHtml,
    URL: window.location.href,
    SCROLL_Y: window.scrollY,
  };
  send(MUTATING, msg);
}

void listenMutation() {
  var observer = new MutationObserver((list, observer) {
    sendHtml();
  });
  observer.observe(document.body,
      attributes: true, characterData: true, childList: true, subtree: true);
}
