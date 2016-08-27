/**
 * define module
 * @module  express,app,multiparty,faced,body-parser
 */
let express = require('express'),
    app = express(),
    multiparty = require('multiparty'),
    cv = require('opencv'),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * demo
 * @param      {String} --user
 * @param      {String} --password 
 * @return     {String} --send response string as "correct"
 */
app.post('/', function(req, res) {
    let user = req.body.username;
    let password = req.body.password;
    console.log("user " + user);
    res.send("correct");
})

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

app.listen(8088, function() {
    console.log("runnning");
})
