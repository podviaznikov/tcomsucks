var util         = require('util'),
    express      = require('express'),
    storyStorage = require('./storage/story.storage'),
    nib          = require('nib'),
    stylus       = require('stylus'),
    assetManager = require('connect-assetmanager'),
    _            = require('underscore'),
    app          = express.createServer(),
    streamer     = require('./streamer'),
    socketIo     = require('socket.io'),
    storiesStream= streamer.defineStream('api/stories'),
    io           = socketIo.listen(app);

function compile(str, path){
      return stylus(str)
        .set('filename', path)
        .set('warn', true)
        .set('compress', true)
        .use(nib());
};

var assetManagerGroups = {
    'js': {
        'route': /\/static.js/
        , 'path': './public/js/'
        , 'dataType': 'javascript'
        , 'files': [
            'jquery-1.6.2.min.js',
            'jquery.hotkeys.js',
            'underscore.js',
            'backbone.js',
            'backbone.goodies.view.js',
            'streaming.collection.js',
            'proper.js',
            'models.js',
            'views.js',
            'controller.js'
        ]
    }
};
var assetsManagerMiddleware = assetManager(assetManagerGroups);


app.configure(function(){
    //request body parser
    app.use(express.bodyParser());
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
    //public folder for static files
	app.use(express.static(__dirname + '/public'));
    //asset manager
	app.use(assetsManagerMiddleware);
});

app.get('/',function(req,res){
  var digits = '345',
      digitsArray = [],
      i = 0;
  for(;i<digits.length;i++){
    digitsArray[i] = digits.charAt(i);
  }
  res.render('index.jade',{
    layout:false,
    locals:{
      digits:digitsArray
    }
  });
});

app.get('/stories',function(req,res){
  var digits = '345',
      digitsArray = [],
      i = 0;
  for(;i<digits.length;i++){
    digitsArray[i] = digits.charAt(i);
  }
  res.render('index.jade',{
    layout:false,
    locals:{
      digits:digitsArray
    }
  });
});

app.get('/stories/:story',function(req,res){
  var digits = '345',
      digitsArray = [],
      i = 0;
  for(;i<digits.length;i++){
    digitsArray[i] = digits.charAt(i);
  }
  res.render('index.jade',{
    layout:false,
    locals:{
      digits:digitsArray
    }
  });
});

app.get('/stories/read/:story',function(req,res){
  var digits = '345',
      digitsArray = [],
      i = 0;
  for(;i<digits.length;i++){
    digitsArray[i] = digits.charAt(i);
  }
  res.render('index.jade',{
    layout:false,
    locals:{
      digits:digitsArray
    }
  });
});


app.post('/api/stories',function(req,res){
  var story=req.body;
  console.log('story to save',story);
  storyStorage.save(story,function(data){
    res.send(data);
  })
});

streamer.initStreams(io,[storiesStream]);

console.log('READY: Server is listening on port 3003');
app.listen(3003);