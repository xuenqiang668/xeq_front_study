// 用于处理请求信息
import HttpParser, { HttpMessage } from "./HttpParser";

class IncomingMessage {
    private httpParser: HttpParser
    public httpMessage: HttpMessage


    constructor(message: string) {
        this.httpParser = new HttpParser(message)
        //  HTTP 报文中得到序列化后的请求报文
        this.httpMessage = this.httpParser.httpMessage!
    }
}



export default IncomingMessage