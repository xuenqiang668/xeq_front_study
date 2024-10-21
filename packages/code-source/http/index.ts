import http from './src/Http';
import IncomingMessage from './src/IncomingMessage';
import ServerResponse from './src/ServerResponse';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  // console.log(req.httpMessage);
  

  res.setHeader('Content-Type', 'application/json')
  // res.end(200, JSON.stringify(req.httpMessage));
  res.end(200, JSON.stringify([{name: "amdin"}]));
});

server.listen(8888, () => {
  console.log("server is listening in 8888...");
});