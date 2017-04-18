var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');

//var PImage = require('pureimage');
var Image = require('purified-image');
var Tesseract = require('tesseract.js'),
  image = require('path').resolve(__dirname, 'cosmic.png');



/* GET home page. */
router.get('/', function (req, res, next) {
  //res.render('index', { title: 'Express' });
  //res.sendFile(image);
  var search = req.query.search;

  var _image = new Image(image);
  //var img = PImage.decodePNG(imagestream);
  //var ctx = img.getContext('2d');
  Tesseract.recognize(image)
    .then(data => {

      _image.draw(function(ctx){
        for (var i = 0; i < data.words.length; i++) {

          var word = data.words[i];

          if(search && word.text && word.text.toLowerCase().indexOf(search) == -1) continue;

          //if(word.text && word.text.search("/"+search+"/i"))

          console.log("text: " + word.text);
          console.log("bbox" + util.inspect(word.bbox, false, 0));
          //console.log(util.inspect(word));

          //var red = 10 * i;
          //ctx.fillStyle = 'rgba(100,'+red+',0,0.5)';
          
          //ctx.fillRect(word.bbox.x0, word.bbox.y0, word.bbox.x1, word.bbox.y1);
            //ctx.fillRect(word.bbox.x0, word.bbox.y0, word.bbox.x1, word.bbox.y1);
            var x = word.bbox.x0;
            var y = word.bbox.y0;
            var width = word.bbox.x1 - x;
            var height = word.bbox.y1 - y;
            ctx.strokeRect(x,y, width, height);
        }

      })
      .save(__dirname + 'out.png')
      .then(function(){

        res.sendFile(__dirname + 'out.png');

      });
    })
    .catch(err => {
      console.log('catch\n', err);
    })
    .finally(e => {
      console.log('finally\n');
      //process.exit();
        // PImage.encodePNG(img, fs.createWriteStream('out.png'), function(err){
        //   if(err){
        //     console.log(err);
        //   }
        //   res.sendFile(__dirname + 'out.png');
        // });
    });


});

module.exports = router;
