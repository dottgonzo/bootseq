var hostapd_switch=require('hostapd_switch'),
Promise=require('promise'),
verb=require('verbo');

function recovery_mode(){
  return new Promise(function(resolve,reject){
    hostapd_switch.ap().then(function(answer){

      // avvia express
      resolve(answer)

    }).catch(function(err){
      verb(err,'error','bootseq')

      reject(err)

    })
  })

}

function start_app(){
  return new Promise(function(resolve,reject){
  })

}
function stop_app(){
  return new Promise(function(resolve,reject){

  })

}

function J5(config) {

}

J5.prototype.start=function(){
  start_app().then(function(answer){
    resolve(answer)

  }).catch(function(err){
    reject(err)


  })
};
J5.prototype.stop=function(){
  stop_app().then(function(answer){
    resolve(answer)

  }).catch(function(err){
    reject(err)


  })
};
J5.prototype.restart=function(){

  stop_app().then(function(answer){
    start_app().then(function(answer){
      resolve(answer)

    }).catch(function(err){
      reject(err)


    })
  }).catch(function(err){
    reject(err)


  })
};
  J5.prototype.boot=function(){
    return new Promise(function(resolve,reject){


      hostapd_switch.client().then(function(answer){

        start_app().then(function(answer){
          resolve(answer)

        }).catch(function(err){
          verb(err,'error','bootseq')

          reject(err)


        })
      }).catch(function(){
        recovery_mode().then(function(answer){
          resolve(answer)

        }).catch(function(err){
          reject(err)


        })
      })
    })
  };

  J5.prototype.log=function(){
};
  J5.prototype.recovery=function(){
    recovery_mode().then(function(answer){
      resolve(answer)

    }).catch(function(err){
      reject(err)


    })
  };



module.export=J5
