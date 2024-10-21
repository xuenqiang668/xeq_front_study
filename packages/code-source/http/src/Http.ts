import * as net from 'net';
import { EventEmitter } from 'node:events';
import IncomingMessage from "./IncomingMessage";
import ServerResponse from "./ServerResponse";

type Handler = (request: IncomingMessage, response: ServerResponse) => void;

class HTTP extends EventEmitter {

    handler: Handler;
    request?: IncomingMessage;
    response?: ServerResponse;
    server?: net.Server;
    socket?: net.Socket;
  

    constructor(handler: Handler) {
        super()

        this.handler = handler

        this.createServer()
    }


    createServer() {
        // 使用net.socket 实现
        // TCP 是一条全双工通信通道，我们可以通过使用 Node 的 net 模块来创建一个 TCP 进程，监听来自客户端的请求
        this.server = net.createServer(socket => {
            // 在 data 事件中所接收到的数据属于字节流数据（Buffer 对象），我们需要使用 Buffer 对象自带的 toString 方法来进行对字节流的解析，将其转化为 utf-8 格式的字符。
            socket.on('data', (data: Buffer) => {
                const message = data.toString('utf-8') // 解码字节流数据
                this.request = new IncomingMessage(message) // 封装 request 对象
                this.response = new ServerResponse(socket) // 封装 response 对象

                this.handler(this.request, this.response) // 将两个对象作为参数传入回调函数
            })

            socket.on('error', error => {
                this.emit('error', error)
            });
        })
    }

    public listen(port: number, cb: any = () => { }): void {
        this.server!.listen(port, cb);
        this.server!.on('error', error => this.emit('error', error));
      }
}


const createServer = (handler: Handler) => {
    return new HTTP(handler)
}

export default {
    createServer
}