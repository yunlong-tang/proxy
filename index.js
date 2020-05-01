var http = require('http')
var net = require('net')
var httpProxy = require('http-proxy')
var HttpsProxyAgent = require('https-proxy-agent')

var proxy = httpProxy.createProxyServer({})

var server = http.createServer()
server.on('connection', () => {
  console.log('connection')
})
server.on('request', () => {
  console.log('request')
})
server.on('connect', (req, clientSocket, head) => {
  console.log(req.url)
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`)
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' + 'Proxy-agent: Node.js-Proxy\r\n' + '\r\n')
    serverSocket.write(head)
    serverSocket.pipe(clientSocket)
    clientSocket.pipe(serverSocket)
  })
  console.log('connect')
})
server.on('error', (e) => {
  console.log(e)
})

server.on('close', (e) => {
  console.log(e)
})
server.on('clientError', (e) => {
  console.log(e)
})

console.log('listening on port 5050')
server.listen(5050)

httpProxy
  .createProxyServer({
    target: {
      protocol: 'https:',
      host: 'www.google.com',
      port: 443,
      secure: false
      // pfx: fs.readFileSync('path/to/certificate.p12'),
      // passphrase: 'password',
    },
    changeOrigin: true
    // secure: false
  })
  .listen(8000)
