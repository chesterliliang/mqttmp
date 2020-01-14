var mqtt = require('./');

var address_list = ['0x8b16bed803968ffc10dec5c4110b09773dfaec09'];
var register_topic = '/machine';
var test_net_req = "test_net_req";
var test_net_res = "test_net_res";
var up_topic_list = ['/up/get_params/', '/up/post_report/', '/up/get/report/', '/up/post_tx/', '/up/get/tx/'];
var down_topic_list = ['/down/get_params/', '/down/report/', '/down/tx/',];

var down_test = {
  "status": "ok",
  "data": ""
};

var down_tx = {
  "addr": "0x8b16bed803968ffc10dec5c4110b09773dfaec09",
  "time": "1574674745",
  "msg_hash": "0x50b2c43fd39106bafbba0da34fc430e1f91e3c96ea2acee2bc34119f92b37750",
  "tx": "0xd686e4675c8315789a25096267e05bc0c783c3dea5d1a5b77dbfdbc8df7b8d47",
  "status": "1",
  "info": "ok"
};

var down_get_params = {
  "addr": "0x8b16bed803968ffc10dec5c4110b09773dfaec09",
  "time": "1572423023",
  "msg_hash": "0x50b2c43fd39106bafbba0da34fc430e1f91e3c96ea2acee2bc34119f92b37750",
  "nonce": "10",
  "gas": "70000",
  "gas_price": "2000000000",
  "status": "1",
  "info": "ok"
};

var down_report = {
  "addr": "0x8b16bed803968ffc10dec5c4110b09773dfaec09",
  "time": "1574674745",
  "msg_hash": "0x50b2c43fd39106bafbba0da34fc430e1f91e3c96ea2acee2bc34119f92b37750",
  "status": "1",
  "info": "ok"
};


var options = {
  username: 'admin',
  password: 'password',
}
var g_counter = 0;

console.log('server start');
//var client = mqtt.connect('mqtt://test.mosquitto.org');
var client = mqtt.connect('mqtt://121.36.3.243:61613', options);

console.log('connected');

console.log('execute subscribe');
for (var i = 0; i < up_topic_list.length; i++) {
  for (var j = 0; j < address_list.length; j++) {
    client.subscribe(up_topic_list[i] + address_list[j]);
    console.log(up_topic_list[i] + address_list[j]);
  }
}
client.subscribe(test_net_req);

console.log('listening');



client.on('message', function (topic, message) {

  setTimeout(function (topic, message){
    if (topic == test_net_req) {
      console.log('test_net_req:' + message);
      down_test.data = '' + message;
      client.publish(test_net_res, JSON.stringify(down_test));
      return;
    }
    if (topic == register_topic) {
      console.log('register');
      return;
    }
    var address = topic.substring(topic.length - 42, topic.length);
    console.log('address = ' + address);
    var topic_only = topic.substring(0, topic.length - 42);
    console.log('message:' + message);

    switch (topic_only) {
      case up_topic_list[0]:
        console.log('topic = ' + topic_only);//'/up/get_params/'
        var publish_topic = down_topic_list[0] + address;
        client.publish(publish_topic, JSON.stringify(down_get_params));
        break;
      case up_topic_list[1]:
        console.log('topic = ' + topic_only);
        var publish_topic = down_topic_list[1] + address;
        client.publish(publish_topic, JSON.stringify(down_report));
        break;
      case up_topic_list[2]:
        console.log('topic = ' + topic_only);
        var publish_topic = down_topic_list[1] + address;
        client.publish(publish_topic, JSON.stringify(down_report));
        break;
      case up_topic_list[3]:
        console.log('topic = ' + topic_only);
        var publish_topic = down_topic_list[2] + address;
        client.publish(publish_topic, JSON.stringify(down_tx));
        break;
      case up_topic_list[4]:
        console.log('topic = ' + topic_only);
        var publish_topic = down_topic_list[2] + address;
        client.publish(publish_topic, JSON.stringify(down_tx));
        break;
      default:
        console.log('unknown message')
    }
  },20000, topic, message);
  
})

