/**
 * define module
 * @module  express,app,multiparty,faced,body-parser,opencv,socket.io,http
 */
let express = require('express'),
    app = express(),
    http = require('http').Server(app),
    multiparty = require('multiparty'),
    cv = require('opencv'),
    port = 8089,
    bodyParser = require('body-parser'),
    io = require('socket.io')(http);

    app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * socket connection on
 */
io.on('connection', require('./lib/routes/socket'));

/**
 * upload image and face detect
 * @param      {object}  --form 
 * @return     {object}  -- send respnse detect image object
 */
app.post('/upload', function(req, res) {
    let form = new multiparty.Form();
    form.parse(req, function(error, fields, files) {
        let file = files.file[0]
        cv.readImage(file.path, function(err, im) {
            im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt.xml', {}, function(err, faces) {
                for (let i = 0; i < faces.length; i++) {
                    let x = faces[i]
                    im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
                }
                let image = im.toBuffer();
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(image);
            });
        })
    })
});

/**
 * demo for check two image are same or not
 * @param  {object} --im
 * @param  {object} --im1
 * @return {json} 
 */
app.post('/demo', function(req, res) {
    let form = new multiparty.Form();
    form.parse(req, function(error, fields, files) {
        let file = files.file[0];
        let file1 = files.file1[0];
        cv.readImage(file.path, function(err, im) {
            cv.readImage(file1.path, function(err, im1) {
                cv.ImageSimilarity(im, im1, function(err, data) {
                    if (data == 0) {
                        res.send("Image is Similar")
                    } else {
                        res.send("Image is not similar")
                    }
                })
            })
        })
    });
});

http.listen(port, function() {
    console.log("runnning on :" + port);
})
