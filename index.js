var hostapdswitch=require('hostapd_switch'),
Promise=require('promise'),
testinternet=require('promise-test-connection'),
// npmAppsManager=require('npmAppsManager'),
netw=require('netw'),
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
app = require('express').createServer();

var confhapds ={

}
var hostapd_switch=new hostapdswitch(confhapds);


// if(!pathExists.sync(configFile)){
// cp.sync('./conf.example.json', configFile)
// }
// sudo iptables -t nat -A PREROUTING -d 0/0 -p tcp --dport 80 -j DNAT --to-destination 192.168.23.1 // better to custom port

app.use('/db', require('express-pouchdb')(PouchDB.defaults({prefix: '/tmp/my-temp-pouch/'})));
app.use(express.static(__dirname +'/html'));


app.get('/', function(req, res){
  res.send('hello world');
});

function regular_mode(options){

  return new Promise(function(resolve,reject){
    hostapd_switch.client('/etc/wpa_supplicant/wpa_supplicant.conf',true,true).then(function(switch_answer){
      resolve(switch_answer)
      // npmAppsManager.start().then(function(answer){
      //   resolve(answer)
      // }).catch(function(err){
      //   verb(err,'error','bootseq')
      //   reject(err)
      // })


    }).catch(function(err){
      reject(err)

    })
  })
}

function recovery_mode(options){
  return new Promise(function(resolve,reject){
    hostapd_switch.ap().then(function(){
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
    port:8080, // in modalità regular setta la porta per il manager
    wpa_supplicant_path:'/etc/wpa_supplicant/wpa_supplicant.conf',
    recovery_dev:'auto'
  }

  if(data){

    merge(config,data)

  }


  app.listen(options.port);

  this.j5=config
}

J5.prototype.start_apps=function(){
  return npmAppsManager.start()
};
J5.prototype.stop_apps=function(){
  return npmAppsManager.stop(this)
};
J5.prototype.restart_apps=function(){

  return npmAppsManager.restart(this)
};
J5.prototype.app_mode_switch=function(mode){
  switch(mode){
    case 'recovery':{

      return recovery_mode(this)
    };
    case 'regular':{

      return regular_mode(this)
    }
  }
})
J5.prototype.wifi_switch=function(mode){
  switch(mode){
    case 'ap':{
      return hostapd_switch.ap()
    };
    case 'host':{
      return hostapd_switch.host()
    };
    case 'client':{
      return hostapd_switch.client()
    }
  }
})


J5.prototype.init=function(){
  var options=this;
  return new Promise(function(resolve,reject){
    testinternet().then(function(){
      npmAppsManager.start().then(function(answer){
        resolve(answer)
      }).catch(function(err){
        verb(err,'error','bootseq')
        reject(err)
      })
    }).catch(function(){
      var wifi_exist=false

      netw.data().then(function(data){
        _.map(data.networks,function(device){
          if(device.interfaceType=='wifi'){
            wifi_exist=true
          }
        })
      })
      if(wifi_exist){
        hostapd_switch.client().then(function(answer){

          regular_mode(options).then(function(answer){
            resolve(answer)
          }).catch(function(err){
            reject(err)

            verb(err,'error','bootseq')
          })

        }).catch(function(err){

          if(mobile){
            linuxmobile().then(function(){

            }).catch(function(){
              if(options.recovery){
                recovery_mode(options).then(function(answer){
                  resolve(answer)
                }).catch(function(err){
                  verb(err,'error','bootseq')
                })
              } else{
                reject('no wlan host available')
              }

            })
          }



        })

      } else{
        if(mobile){
          linuxmobile().then(function(){
            regular_mode(options).then(function(answer){
              resolve(answer)
            }).catch(function(err){
              reject(err)
              verb(err,'error','bootseq')
            })

          }).catch(function(){
            reject({'no connections available'})

          }


        }


      })



    })
  };

  J5.prototype.recovery=function(){
    // return recovery_mode(this)
  };



  module.export=J5
