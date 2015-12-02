var Wvdial=require('wvdialjs'),
config = require('../conf.json'),
verb=require('verbo'),
mobileconnect=require('linux-mobile-connection');

module.exports=function(wvdialFile){
  var mobilemodem=new Wvdial('/etc/wvdial.conf');



  setTimeout(function () {
    if(config.devices.mobilemodem.dev && config.devices.mobilemodem.provider){
      mobileconnect(config.devices.mobilemodem.provider,{dev:config.devices.mobilemodem.dev}).then(function(c){
        verb(c)
      }).catch(function(err){
        verb(err,'error')
      })
    }else if(config.devices.mobilemodem.dev){
      verb('no device set','error','Modem')
    }else if(config.devices.mobilemodem.provider){
      verb('no provider set','error','Modem')

    }


  }, 100000);


}
