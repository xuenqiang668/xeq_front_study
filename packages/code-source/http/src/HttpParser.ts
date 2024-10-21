export type Headers = {[key: string]: string}


export type HttpMessage = {
    method: string
    url: string
    version: string
    headers: Headers
    body: string
}

class HttpParser {
    private message: string
    public httpMessage?: HttpMessage

    constructor(message: string) {
        this.message = message

        this.parse()
    }


    // HTTP/1.1 200 ok
    // content-type: application/json

    // {"method":"POST","url":"/","version":"HTTP/1.1","headers":{"content-type":"application/json","user-agent":"PostmanRuntime/7.17.1","accept":"*/*","cache-control":"no-cache","postman-token":"5cd74556-35fe-488d-a363-b4754992da60","host":"localhost","accept-encoding":"gzip, deflate","content-length":"19","connection":"keep-alive"},"body":"{\n\t\"name\": \"jack\"\n}"}

    private parse(): void {
        this.httpMessage = {} as any
        const messages = this.message.split('\r\n')
        const [head] = messages
        const headers = messages.slice(1, -2)
        const [body] = messages.slice(-1)

        this.parseHead(head) // 把head 的method url version 处理到this.httpMessage 中
        this.parseHeaders(headers) // 把headers的key:value 处理到this.httpMessage.headers 中
        this.parseBody(body) // this.httpMessage!.body = bodyStr;
    }

    private parseHead(headStr: string) {
        const [method, url, version] = headStr.split(' ')
        this.httpMessage!.method = method
        this.httpMessage!.url = url
        this.httpMessage!.version = version
    }

    private parseHeaders(headerStrList: string[]) {
        this.httpMessage!.headers = {};
        for (let i = 0; i < headerStrList.length; i++) {
            const header = headerStrList[i];
            let [key, value] = header.split(":");
            key = key.toLocaleLowerCase();
            value = value.trim();
            this.httpMessage!.headers[key] = value;
        }
    }

    private parseBody(bodyStr: string) {
        if (!bodyStr) return this.httpMessage!.body = "";
        this.httpMessage!.body = bodyStr;
    }
}

export default HttpParser