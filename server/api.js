// Express
let express = require('express')

// Used to send event
var events = require('events');
var em = new events.EventEmitter();

var fs = require('fs');
resolve = require('path').resolve
join = require('path').join

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
let server = app.listen(process.env.PORT || 1338, listen);

// Callback function confirming server start
function listen(){
    // let host = server.address().address;
    let host = '0.0.0.0';
    let port = server.address().port;
    console.log('Listening at http://' + host + ':' + port);
}


app.get('/', function (req, res) {
    res.sendFile(join(__dirname, 'html/webUI.html'))
})

app.get('/album', function (req, res) {
    fs.readFile(join(__dirname, 'html/album.html'), "utf8", function(err, data) {
        res.send(data.replace(/{ALBUM_NAME}/g, req.query["album"]))

    });
})

// Get a list of all resources available to play TODO: in an album
app.get('/info/frames', function (req, res) {
    console.log(req.query["album"])
    fs.readdir(`frames/${req.query["album"]}`, function(err, items) {
        res.send(items)
    });
})

// Get a list of all albums
app.get('/info/albums', function (req, res) {
    fs.readdir("frames/", function(err, items) {
        res.send(
            items.filter(
                i => fs.lstatSync(resolve(join('frames/', i))).isDirectory()
            )
        )
    });
})

// Set mode to random
app.get('/mode/random', function (req, res) {
    em.emit('random_mode', {album: req.query["album"]});
    res.send({'msg': 'switching to random mode'})
})

// Set to a specific image
app.post('/mode/set_frame', function (req, res) {
    // console.log(req.body);
    // var dimensions = sizeOf('frames/' + req.body.frame);
    // console.log(dimensions.width, dimensions.height);
    em.emit('set_frame', req.body.frame)
    res.send({'msg': 'switching frame'})
})

// Set to a specific image
app.post('/upload_frame', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    let newFrame = req.files.newFrame;
    let album = req.body.albumName;

    // Use the mv() method to place the file somewhere on your server
    newFrame.mv(`frames/${album}/${newFrame.name}`, function(err) {
      if (err)
        return res.status(500).send(err);

        res.redirect(`/album?album=${album}`);
    });
  });

// Create a new album
app.post('/create_album', function(req, res) {
    if (!req.body.albumName)
        res.status(400).send('No album name specified');

    var dir = `frames/${req.body.albumName}`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        res.redirect('/');
    }
    else {
        res.send({'msg': 'Album already exist'})
    }
  });

module.exports = em;
