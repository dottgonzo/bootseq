var find=require('find'),
fs = require("fs").readFileSync,
readJson=require('read-json-file-sync'),
exec=require('child_process').exec;
pathExists=require('path-exists');

      var run=[];
find.file('autorun.json','/', function(files) {

  for(var i=0;i<files.length;i++){
    var file=files[i];
    var dir=file.split('autorun.json')[0];
    if(dir.split('/').length>1){
      var parent=file.split(dir.split('/')[dir.split('/').length-2]+'/autorun.json')[0];

    } else{
      var parent=false
    }


    var validate=true
    if(!pathExists.sync(dir+'node_modules')){
      validate=false;
    }
    if(!pathExists.sync(dir+'package.json')){
      validate=false;
    }
if(parent&&parent.split('node_modules').length>1){
  validate=false;

}

try {
readJson(file); // generates an exception
readJson(file).user;
}
catch (e) {
   // statements to handle any exceptions

   validate=false;
}

    if(validate){
run.push({user:readJson(file).user,file:file,dir:dir})
    console.log('valid')
  } else{
    console.log('similar file: '+file)
  }

  }

for(r=0;r<run.length;r++){

exec('cd '+run[r].dir+' && npm start')


}
  })
  .error(function(err) {
    if (err) {
      //
    }
  })
