var hostapdswitch=require('hostapd_switch'),
Promise=require('promise'),
testinternet=require('promise-test-connection'),
PouchDB = require('pouchdb'),
// npmAppsManager=require('npmAppsManager'),
netw=require('netw'),
mkdir=require('mkdir-p'),
LMC=require('linux-mobile-connection'),
mobileconnect=require('linux-mobile-connection'),
pouchDB=require('pouchdb'),
merge=require('json-add'),
//LOS=require('linux-online-status'),
offlinereboot=require('offlinereboot'),
pathExists=require('path-exists'),
// timerdaemon=require('timerdaemon'),
_=require('lodash'),
verb=require('verbo'),
// cp = require('cp'),
// configFile='./conf.json',
express = require('express'),
app     = express();




if(!pathExists.sync(__dirname+'/db/')){
  mkdir.sync(__dirname+'/db/');
}
var pdb=PouchDB.defaults({prefix: __dirname+'/db/'});
app.use('/db', require('express-pouchdb')(pdb));
app.use(express.static(__dirname +'/html'));


app.get('/', function(req, res){
  res.send('hello world');
});

function init_apps(options){
  return new Promise(function(resolve,reject){
    console.log('starting apps');
    resolve(true)
  })

}

function recovery_mode(options){
  var apswitch=new hostapdswitch(confhapds);
  return new Promise(function(resolve,reject){
    apswitch.ap().then(function(){
      resolve(answer)
    }).catch(function(err){
      verb(err,'error','bootseq')
      reject(err)
    })
  })

}


function J5(data) {
  var config={
    recovery:true,
    offlineApp:false, // avvia l'app solo in stato regular
    port:4000, // in modalità regular setta la porta per il manager
    wpa_supplicant_path:'/etc/wpa_supplicant/wpa_supplicant.conf',
    recovery_dev:'auto'
  }

  if(data){
    merge(config,data)
  }

  app.listen(config.port);

  this.config=config
};

J5.prototype.start_apps=function(){
  //  return npmAppsManager.start()
},
J5.prototype.stop_apps=function(){
  //   return npmAppsManager.stop(this)
},
J5.prototype.wifi_switch=function(mode,dev){

  if(dev){
    var apswitch=new hostapdswitch(
      {
        interface:dev,
        hostapd:this.hostapd
      }
    );
    return apswitch.mode(mode)
  }else{
    return new Promise(function(resolve,reject){
      netw().then(function(data){
        _.map(data.networks,function(device){
          if(device.interfaceType=='wifi'){
            dev=device.interface
          }
        })
        if(dev){
          var apswitch=new hostapdswitch(
            {
              interface:dev,
              hostapd:this.hostapd
            }
          );
          apswitch.mode(mode).then(function(answer){
            resolve(answer)
          }).catch(function(err){
            reject(err)
          })
        }else{
          reject(err)
        }
      }).catch(function(err){
        reject(err)
      })
    })
  }


},


J5.prototype.init=function(){
  var config=this.config;
  return new Promise(function(resolve,reject){
    testinternet().then(function(){
      npmAppsManager.start().then(function(answer){
        resolve(answer)
      }).catch(function(err){
        verb(err,'error','bootseq')
        reject(err)
      })
    }).catch(function(){
      verb(err,'info','Tryng to connect')
      var wifi_exist=false
      netw.data().then(function(data){
        _.map(data.networks,function(device){
          if(device.interfaceType=='wifi'){
            wifi_exist=true
          }
        })
        if(wifi_exist){
          verb(err,'info','Wlan interface founded');
          var apswitch=new hostapdswitch(confhapds);
          apswitch.client().then(function(answer){
            init_apps(options).then(function(answer){
              resolve(answer)
            }).catch(function(err){
              reject(err)
              verb(err,'error','J5 start apps')
            })
          }).catch(function(err){
            if(config.mobile){
              var mobile=new linuxmobile(config.mobile)
              linuxmobile.connect().then(function(){
                init_apps(options).then(function(answer){
                  resolve(answer)
                }).catch(function(err){
                  reject(err)
                  verb(err,'error','J5 start apps')
                })
              }).catch(function(){
                if(options.recovery){
                  recovery_mode(options).then(function(answer){
                    resolve(answer)
                  }).catch(function(err){
                    verb(err,'error','J5 recovery mode start')
                    reject(err)
                  })
                } else{
                  reject('no wlan host available')
                }
              })
            }
          })
        } else{
          if(config.mobile){
            var mobile=new linuxmobile(config.mobile)
            linuxmobile.connect().then(function(){
              init_apps(options).then(function(answer){
                resolve(answer)
              }).catch(function(err){
                reject(err)
                verb(err,'error','J5 start apps')
              })
            }).catch(function(err){
              verb(err,'error','J5 linuxmobile')
              reject(err)
            })
          }
        }
      }).catch(function(err){
        verb(err,'error','J5 NETW ERROR!!')
        reject(err)
      })
    })
  })
},

J5.prototype.recovery=function(){
  // return recovery_mode(this)
};



module.exports=J5
