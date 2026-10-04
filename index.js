const app = require('http')
const port = 4444

const server = app.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end()
})

function doSomething(error){
    if (error){
        console.log("something went wrong")
        console.log(error.message)
    }
    else{
        console.log("working...")
    }
}

server.listen(port, doSomething)

