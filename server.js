let express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require('./api/appRoutes'); //importing route
routes(app);

app.use(serveStatic("public_html"));

app.listen(port);

console.log('Local media viewer server started on: ' + port);