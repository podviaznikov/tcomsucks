var util         = require('util'),
    express      = require('express'),
    storyStorage = require('./storage/story.storage'),
    nib          = require('nib'),
    stylus       = require('stylus'),
    assetManager = require('connect-assetmanager'),
    app          = express.createServer(),
    redisStreamer= require('./redis.streamer'),
    streamer     = require('./streamer'),
    socketIo     = require('socket.io'),
    storiesStream= streamer.defineStream('api/stories','couch'),
    voteStream   = streamer.defineStream('vote','redis'),
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
            'streamer.js',
            'proper.js',
            'models.js',
            'views.js',
            'controller.js'
        ]
    }
};
var assetsManagerMiddleware=assetManager(assetManagerGroups);

app.configure('production',function(){
  app.set('view cache',true);
});

app.configure(function(){

   app.use(express.favicon(__dirname+'/public/favicon.ico'));
    //request body parser
    app.use(express.bodyParser());
    //using router
	app.use(app.router);
	//public folder for static files
	app.use(express.static(__dirname + '/public'));
    // folder with templates
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
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

var pageRenderer=function(req,res){
    redisStreamer.getVotes(function(votes){
        var digits=votes||'0',
            digitsArray = [],
            i = 0;
        for(;i<digits.length;i++){
            digitsArray[i] = digits.charAt(i);
        }
        res.render('index',{
            layout:false,
            locals:{
                digits:digitsArray
            }
        });
    });
};
app.get('/',pageRenderer);

app.get('/tcom',pageRenderer);
app.get('/tcom/intro',pageRenderer);
app.get('/tcom/new-story',pageRenderer);
app.get('/tcom/stories',pageRenderer);
app.get('/tcom/stories/:story',pageRenderer);

app.post('/api/stories',function(req,res){
    var story=req.body;
    console.log('story to save',story);
    storyStorage.save(story,function(data){
        console.log('story saved');
        res.json(data);
    });
});
app.get('/api/stories',function(req,res){
    console.log('getting all stories');
    storyStorage.getAll(function(data){
        res.json(data);
    });
});

app.get('/api/stories/:id',function(req,res){
    var id=req.params.id;
    storyStorage.get(id,function(story){
        res.json(story);
    });
});

app.post('/vote',function(req,res){
    redisStreamer.fireVote();
    res.end();
});

streamer.initStreams(io,[storiesStream,voteStream],redisStreamer);

//catch all errors
process.on('uncaughtException',function(err){
  console.log(err);
});

console.log('READY: Server is listening on port 8082');
exports.app = app;
