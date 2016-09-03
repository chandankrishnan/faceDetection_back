/**
 * define module
 * @module  express,app,multiparty,faced,body-parser,opencv,socket.io,http
 */
let cv = require('opencv');

/**
 * define variables
 */
let camWidth = 320,
    camHeight = 240,
    camFps = 10,
    camInterval = 1000 / camFps;

/**
 * face detection properties
 */
let rectColor = [0, 255, 0],
    rectThickness = 2;

/** 
 * intialize camera
 * @type {object} --camera
 */
var camera = new cv.VideoCapture(0);
camera.setWidth(camWidth);
camera.setHeight(camHeight);

module.exports = function(socket) {

    setInterval(function() {
        camera.read(function(err, im) {
            if (err) throw err;

            im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
                if (err) throw err;

                for (var i = 0; i < faces.length; i++) {
                    face = faces[i];
                    im.rectangle([face.x, face.y], [face.width, face.height], rectColor, rectThickness);
                }

                socket.emit('frame', { buffer: im.toBuffer() });
            });
        });
    }, camInterval);
};
