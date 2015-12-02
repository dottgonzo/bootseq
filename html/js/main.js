

function hidehome(){
$('#home').hide();


}

function modmob(){

hidehome();
$('#set_wifi').hide();
$('#set_ppp').show();

}



function modwifi(){
hidehome();
$('#set_ppp').hide();

$('#set_wifi').show();

}



function netstatus(){


$.getJSON('/info/networking').done(function(dat){
  var data=dat.networks
  console.log(data)


for (var i=0;i<data.length;i++){



if (data[i].dev == 'wlan0'){


put_wifi(data[i]);


} else if (data[i].dev == 'ppp0'){

put_ppp(data[i]);



} else if (data[i].dev == 'eth0'){

put_eth(data[i]);

}

}





});

}


function reboot(t,c){

if (c==true){

var check=confirm('are you sure?');

if (check==false){

return
}
}

if (t != 0){

$.getJSON('php/reboot.php?time='+t).done(function(data){



$('.reboot_time').html(t);




});

}else{



$.getJSON('php/reboot.php');

alert('system is restarting');

}


}


function modserial(){
$('#home').hide();
$('#set_wifi').hide();

$('#home').hide();


$('#set_serial').val($(".serial_id").html());

}


function put_serial(){

$('#backtomain').hide();


netstatus();


$('#home').show();
$('#set_wifi').hide();
$('#set_ppp').hide();

}


function put_wifi(conf){

if (conf && conf.connected && conf.inuse){

$('.connected').html("connected");

$('.wifi_status').html('connected');
$('.wifi_essid').html(conf.essid);
$('.internal_ip').html(conf.ip);
} else {
$('.wifi_status').html('not connected');
}
}

function put_ppp(conf){



if (conf && conf.connected && conf.inuse){
$('.connected').html("connected");
$('.ppp_status').html('connected');
$('.ppp_apn').html(conf.apn);
$('.internal_ip').html(conf.ip);
} else {
$('.wifi_status').html('not connected');
}
}
function put_eth(conf){

if (conf && conf.connected && conf.inuse){
$('.connected').html("connected");
$('.eth_status').html('connected');
$('.internal_ip').html(conf.ip);
} else {
$('.wifi_status').html('not connected');
}


}






function listwpa(){

$.getJSON('/sys/wpa').done(function(data){


console.log(data);

});

}





$("#set_wifi").submit(function(e){
e.preventDefault();

var essid=$('#set_wifi_essid').val();
var passw=$('#set_wifi_passw').val();
var priority=$('#set_wifi_priority').val();
console.log(passw)
if ( essid && passw && passw.length > 7 ){
  $.ajax({
  type: "POST",
  url: '/sys/wpa',
  data: '{"essid":"'+essid+'","password":"'+passw+'","priority":"'+priority+'"}',
  contentType: "application/json",
   dataType: 'json'
}).done(function(data){
  console.log(passw)

if (!data.error){
alert('network added');
//reboot(10,false);
} else {
alert(data.error);
}
});
} else {
alert('essid and password are required. Password must be longer then 8 characters');
}
});


$("#set_ppp").submit(function(e){
e.preventDefault();

var ppp_apn=$('#mobile_apn').val();
var ppp_passw=$('#mobile_passw').val();
var ppp_user=$('#mobile_user').val();
var ppp_number=$('#mobile_number').val();

if (ppp_apn && ppp_apn.length > 3 && ppp_apn.split('.')[1]){
$.getJSON('php/setmobile.php?apn='+ppp_apn+'&passw='+ppp_passw+'&number='+ppp_number+'&user='+ppp_user).done(function(data){
if (!data.error){
alert('network added, system will be restarted in 10 seconds');
//reboot(10,false);
} else {
alert(data.error);
}
});
} else {
alert('valid apn is required');
}
});







// start



put_serial();
