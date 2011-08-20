var cradle=require('cradle'),
    connection=new(cradle.Connection)('podviaznikov.cloudant.com', 80,{
        auth:{
            username:"thurightshiminguensedgen",
            password:"q0efA00sSJMbg4XRciHWgfJN"
        }
    }),
    db = connection.database("worstcompany");

exports.save=function(story,callback){
    db.save(story,function(er,doc){
        if(er){
            callback({});
        }
        else{
            callback({_id:doc.id,_rev:doc.rev})
        }
    });
};

exports.stream=function(callback){
    db.changes({include_docs: true}).on('response',function(res){
        res.on('data',function (change){
            if(!change.deleted && change.doc){
                callback(change.doc);
            }
        });
        res.on('end',function (){
            console.log('end of streaming')
        });
    });
};