var net = require('net')

var server = net.createServer()

server.on('connection', (clientSocket) => {
  console.log('connection')
  // clientSocket.on('data', (data) => {
  //   console.log(data.toString())
  // })

  clientSocket.on('connect', (data) => {
    console.log('connect')
  })

  clientSocket.on('request', (data) => {
    console.log('request')
  })

  clientSocket.on('end', () => {
    console.log('client disconnected');
  })
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

    serverSocket.on('error', (err) => {
      console.log('PROXY TO SERVER ERROR');
      console.log(err);
    });

    clientSocket.on('error', err => {
      console.log('CLIENT TO PROXY ERROR');
      console.log(err);
    });
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
