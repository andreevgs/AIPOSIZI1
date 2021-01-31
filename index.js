var http = require('http');
var fs = require('fs');
var path = require('path');

const port = process.env.PORT || 3000;

http.createServer(function (request, response) {
    console.log('request ', request.url);
    
    parsedURL = request.url.split('/');

    console.log(parsedURL);

    var filePath = './' + parsedURL[1];
    if (filePath == './') {
        console.log('path: ' + filePath);
        filePath = './index.html';
    }
    if (filePath == './ads') {
        filePath = './index.html';
    }
    if(filePath == './download') {
        filePath = './' + parsedURL[3] + '.' + parsedURL[2];
        console.log('FILEPATH: ' + filePath);
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    console.log('EXTNAME: ' + extname);

    var contentType = 'text/html';
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.ico': 'image/ico',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml',
    };

    console.log('EXTNAME MIME: ' + mimeTypes[extname]);

    console.log('request 2', request.url);

    if(parsedURL[1] == 'download') {
        let file = './' + parsedURL[3] + '.' + parsedURL[2];
        let filename = path.basename(file);

        console.log('file: ' + file);

        var filePath = './' + filename;

        response.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + filename
        });

        var readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
        
    }
    else {
        contentType = mimeTypes[extname] || 'text/html';
        console.log(contentType);

        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT'){
                    console.log('404 error');
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                    response.end();
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }

    

}).listen(port);
console.log(`Server running at: ${port}`);