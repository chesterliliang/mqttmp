var mqtt = require('./');

var address_list = ['91BBB762CA70CA3571BA1070860A80287175262B'];
var register_topic = '/up/machine';
var test_net_req = "test_net_req";
var test_net_res = "test_net_res";
var up_topic_list = ['/up/get_params/', '/up/periodical_report/', '/up/send_transaction/'];
var down_topic_list = ['/down/get_params/', '/down/periodical_report/', '/down/send/transaction'];

var down_test = {
  "status": "ok",
  "data":""
};

var down_get_params = {
  "machine_address": "91BBB762CA70CA3571BA1070860A80287175262B",
  "hash_value": "0x50b2c43fd39106bafbba0da34fc430e1f91e3c96ea2acee2bc34119f92b37750",
  "nonce": 10,
  "gas": 70000,
  "timestamp": "1572423023"
};

var down_periodical_report = {
  "machine_address": "91BBB762CA70CA3571BA1070860A80287175262B",
  "hash_value": "0x50b2c43fd39106bafbba0da34fc430e1f91e3c96ea2acee2bc34119f92b37750"
};

var down_send_transaction = {
  "machine_address": "91BBB762CA70CA3571BA1070860A80287175262B",
  "hash_value": "0x50b2c43fd39106bafbba0da34fc430e1f91e3c96ea2acee2bc34119f92b37750",
  "trx": "0xd686e4675c8315789a25096267e05bc0c783c3dea5d1a5b77dbfdbc8df7b8d47"
};
var options = {
username: 'admin',
password: 'password',
}
var g_counter = 0;

console.log('server start');
//var client = mqtt.connect('mqtt://test.mosquitto.org');
var client = mqtt.connect('mqtt://121.36.3.243:61613',options);

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
  if (topic== test_net_req){
    console.log('test_net_req:'+ message);
    down_test.data = ''+message;
    client.publish(test_net_res, JSON.stringify(down_test));
    return;
  }
  if (topic == register_topic) {
    console.log('register');
    return;
  }
  var address = topic.substring(topic.length - 40, topic.length);
  console.log('address = ' + address);
  var topic_only = topic.substring(0, topic.length - 40);
  console.log('message:' + message);
  var index = parseInt(message);
  index=index-1;
  if(g_counter!=index){
    console.log('---missing----');
    console.log('---missing----');
    console.log('---missing----');
    while(true){

    }
  }
  g_counter = g_counter + 1;
  

  switch (topic_only) {
    case up_topic_list[0]:
      console.log('topic = ' + topic_only);
      var publish_topic = down_topic_list[0] + address;
      client.publish(publish_topic, JSON.stringify(down_get_params));
      break;
    case up_topic_list[1]:
      console.log('topic = ' + topic_only);
      var publish_topic = down_topic_list[1] + address;
      client.publish(publish_topic, JSON.stringify(down_periodical_report));
      break;
    case up_topic_list[2]:
      console.log('topic = ' + topic_only);
      var publish_topic = down_topic_list[2] + address;
      client.publish(publish_topic, JSON.stringify(down_send_transaction));
      break;
    default:
      console.log('unknown message')
  }
})

