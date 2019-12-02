// Express
let express = require('express')

// Used to send event
var events = require('events');
var em = new events.EventEmitter();

var fs = require('fs');

// Use to talk betweem "frontend" and "backend"
const ipc = require('electron').ipcMain

// Used for file upload
const fileUpload = require('express-fileupload');

// Create app
let app = express()
app.use(fileUpload());
app.use(express.urlencoded());
app.use(express.json());

//Set up server
let server = app.listen(process.env.PORT || 1337, listen);

// Callback function confirming server start
function listen(){
    // let host = server.address().address;
    let host = '0.0.0.0';
    let port = server.address().port;
    console.log('Listening at http://' + host + ':' + port);
}


app.get('/', function (req, res) {
    res.sendfile('server/html/webUI.html')
})

// Get a list of all resources available to play
app.get('/info/frames', function (req, res) {
    fs.readdir("frames/", function(err, items) {
        res.send(items)
    });
})

// Set mode to random
app.get('/mode/random', function (req, res) {
    em.emit('test', {});
    res.send('does nothing yet')
})

// Set to a specific image
app.post('/mode/set_frame', function (req, res) {
    // console.log(req.body);
    // var dimensions = sizeOf('frames/' + req.body.frame);
    // console.log(dimensions.width, dimensions.height);
    em.emit('set_frame', req.body.frame)
    res.send('does nothing yet')
})

// Set to a specific image
app.post('/upload_frame', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    let newFrame = req.files.newFrame;

    // Use the mv() method to place the file somewhere on your server
    newFrame.mv(`frames/${newFrame.name}`, function(err) {
      if (err)
        return res.status(500).send(err);

        res.redirect('/');
    });
  });

module.exports = em;
