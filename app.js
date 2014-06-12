
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load customers route
var customers = require('./routes/customers'); 

var app = module.exports = express.createServer();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');
var bodyParser = require('body-parser');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("view options", { layout: false });

//app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.json());
app.use(bodyParser());
app.use(bodyParser.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'node'
    },'request')
);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', customers.list);
app.get('/customers',customers.list);
app.get('/customers/add',customers.add);
app.post('/customers/add',customers.save);
app.get('/customers/delete/:id',customers.delete_customer);
app.get('/customers/edit/:id',customers.edit);
app.post('/customers/edit/:id',customers.save_edit);

app.get('/awesome',function(req,res))


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
