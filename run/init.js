var J5=require('../index'),
verb=require('verbo');
var options={

};
var gionni=J5(options)

gionni.init().then(function(status){
  verb(status,'info','J5 init')
}).catch(function(err){
  verb(err,'error','J5 init')
})
