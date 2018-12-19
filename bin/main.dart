import 'dart:io';

void main() {
  HttpServer
      .bind('ec2-52-193-251-39.ap-northeast-1.compute.amazonaws.com', 8080)
      .then((server) {
    server.listen((req) => onRequest(req));
  });
}

Future onRequest(HttpRequest req) async {
  print(req.uri);
  List<int> chars = [];

  await for (var char in req) {
    chars.addAll(char);
  }

  var str = new String.fromCharCodes(chars);
  print(str);
  req.response.write("yeah");
  req.response.close();
}
