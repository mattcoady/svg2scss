#!/usr/bin/env node

var fs = require ('fs'),
  glob = require ('glob');

var master = "",
    fillList = {},
    fillCount = 0;

glob ("*.svg", function(err, files) {

  console.log(files);

  if (err) {
    console.log ("Error reading files: ", err);
  } else {
    // keep track of how many we have to go.
    var remaining = files.length;
    var totalBytes = 0;

    // for each file,
    files.forEach(function (file){
      // read its contents.

      fs.readFile (file, 'utf8', function(error, data) {
        console.log('Reading ' + file);
        if (error) {
          console.log ("Error: ", error);
        } else {
          totalBytes += data.length;
          console.log ("Successfully read " + file + "\n");
        }

        var svgTag = data.match(/<svg([^]*?)<\/svg>/g)[0];
        var fills = svgTag.match(/fill=\"([^"]*)\"/g);


        for(var x=0;x<fills.length;x++){
          if(fills[x] in fillList){
          }else{
            fillList[fills[x]] = '$svg-color-' + fillCount;
            fillCount++;
          }
        }

        master +=
          '$svg-img-' + file.replace('.svg','') +
          ':\n\'' + svgTag + '\';\n\n';

        remaining -= 1;
        if (remaining == 0) {

          master += '//Found fill colors: \n';

          var itterCount = 0;
          for(key in fillList){
            master += '$reference-color-' + itterCount + ': ' + key.replace('"','').replace('fill=','').replace('"','') + ';\n';
            itterCount++;
          }

          fs.writeFile('_output.scss', master, 'utf8');

          console.log ("Done reading files. totalBytes: " + totalBytes + "\n");
          console.log ("||======================||");
          console.log ("||Output to _output.scss||");
          console.log ("||======================||");

        }
      });
    })
  }

});



