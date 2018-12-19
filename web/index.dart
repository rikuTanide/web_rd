import 'dart:html';

void main() {
  var ws = new WebSocket(
      "wss://i8rhp2cln5.execute-api.ap-northeast-1.amazonaws.com/dev");
  ws.onOpen.listen((e) {
    ws.send('ooo');
  });
}
