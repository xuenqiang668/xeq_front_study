// 用于响应处理结果
import * as net from 'net';
// ResponseFormatter 就是反序列化 JSON 数据的类，可从源码仓库查看
import ResponseFormatter from './ResponseFormatter'

class ServerResponse {
    private socket: net.Socket;
    private resFormatter: ResponseFormatter;

    constructor(socket: net.Socket) {
        this.socket = socket

        this.resFormatter = new ResponseFormatter()
    }

    // add setHeader func
    public setHeader(key: string, val: string) {
        this.resFormatter.setHeader(key, val)
    }

    // 
    public end(status: number, body: string) {
        const resFormatter = this.resFormatter
        resFormatter.setStatus(status)
        resFormatter.setBody(body)

        // console.log(resFormatter.format());
        // 下面三步就是向客户端发送 TCP 字节流数据
        this.socket.write(resFormatter.format())
        this.socket.pipe(this.socket)
        this.socket.end()
        
    }
   
}


export default ServerResponse