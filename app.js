var util    = require('util'),
    express = require('express'),
    nib     = require('nib'),
    stylus  = require('stylus'),
    Data    = require('data'),
    schema  = require('./db/schema')
    app     = express.createServer();

function compile(str, path){
      return stylus(str)
        .set('filename', path)
        .set('warn', true)
        .set('compress', true)
        .use(nib());
};

//var items = new Data.Hash({a: 123, b: 34, x: 53});
console.log(items.first())
var graph = new Data.Graph(schema.app,false);


// Connect to a data-store
graph.connect('couch', {
  url: "https://ortheryoutaidstimemetrav:yugysM15NsKlJYHhjLr78bjj@podviaznikov.cloudant.com/worstcompany"
});

graph.set({
  _id: "/story/1",
  type: "/type/story",
  name: "Bart Simpson"
});


app.configure(function(){
    //using router
	app.use(app.router);
	//public folder for static files
	app.use(express.static(__dirname + '/public'));
    // folder with templates
    app.set('views', __dirname + '/views');
    // stylus
    app.use(stylus.middleware({
        src: __dirname+'/styles',
        dest: __dirname + '/public',
        compile: compile
    }));
});

app.get('/',function(req,res){
  res.render('index.jade',{layout:false});
});
graph.merge(schema.app,{dirty: true}); // nodes should be considered dirty.
graph.sync(function(err) { if (!err) console.log('Successfully synced'); });
// Serve Data.js backend along with an express server
//graph.serve(app);
console.log(schema.app);
console.log('READY: Server is listening on port 3003');
app.listen(3003);