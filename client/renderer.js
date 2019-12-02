// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var sizeOf = require('image-size');

var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('set_frame', function (event, arg){
    set_frame(arg);
})

function set_frame(frame) {
    // get filename extension
    ext = frame.split('.')
    ext = ext[ext.length - 1]

    if (ext === 'webm') {
        document.getElementById('frameBody').innerHTML = `<video autoplay loop id="video" src="../../frames/${frame}">`
    }
    else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === "gif" ){
        var imgDimensions = sizeOf(`frames/${frame}`);

        // Get by how much we we need to multiply the image width and height to fill the screen and keep aspect ratio
        var ratio = Math.min(screen.width / imgDimensions.width, screen.height / imgDimensions.height);
        newWidth = Math.floor(imgDimensions.width * ratio)
        newHeight = Math.floor(imgDimensions.height * ratio)

        document.getElementById('frameBody').innerHTML = `<img id="image" src="../../frames/${frame}" width="${newWidth}px" height="${newHeight}px">`
    }
}

set_frame('default.webm')
