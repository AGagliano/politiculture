/*
Serial-to-websocket Server
using serialport.js
To call this type the following on the command line:
node wsServer.js portName
where portname is the name of your serial port, e.g. /dev/tty.usbserial-xxxx (on OSX)
created 28 Aug 2015
by Tom Igoe
*/

// include the various libraries that you'll use:
var SerialPort = require('serialport');       // include the serialport library
var WebSocketServer = require('ws').Server;   // include the webSocket library

// configure the webSocket server:
var SERVER_PORT = 8081;                 // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;            // list of connections to the server

// configure the serial port:
// SerialPort = serialport.SerialPort,             // make a local instance of serialport
    // portName = "/dev/cu.HB-01-DevB",                 // get serial port name from the command line
    // delimiter = process.argv[3];                // serial parser to use, from command line

var serialOptions = {                           // serial communication options
      baudRate: 9600,                           // data rate: 9600 bits per second
      parser: SerialPort.parsers.readline("\n"),  //this parser ensures that full lines are read and broadcasted.
      // parser: delimiter // newline generates a data event
    };


// if the delimiter is n, use readline as the parser:
// if (delimiter === 'n' ) {
//   serialOptions.parser = serialport.parsers.readline('\n');
// }

// if (typeof delimiter === 'undefined') {
//   serialOptions.parser = null;
// }

// If the user didn't give a serial port name, exit the program:
// if (typeof portName === "undefined") {
//   console.log("You need to specify the serial port when you launch this script, like so:\n");
//   console.log("    node wsServer.js <portname>");
//   console.log("\n Fill in the name of your serial port in place of <portname> \n");
//   process.exit(1);
// }


var servi = require('servi');          // include the servi library
var app = new servi(false);            // servi instance
app.port(8080);                        // port number to run the server on

// configure the server's behavior:
app.serveFiles("public");              // serve all static HTML files from /public
app.route('/data', sendData);          // route requests for /data to sendData() function
// now that everything is configured, start the server:
app.start();

// open the serial port:
// var myPort = new SerialPort("/dev/cu.usbmodem1411", serialOptions);
var myPort = new SerialPort("/dev/cu.HC-05-DevB", serialOptions);
var myPort2 = new SerialPort("/dev/cu.HC-06-DevB", serialOptions);

// set up event listeners for the serial events:
// TODO: need more events =>
  // app_one: 1) requests User Data, 2) requests env_color (average of nearby Users)
  myPort.on('open', showPortOpen);
  myPort.on('data', sendSerialData);
  myPort.on('close', showPortClose);
  myPort.on('error', showError);

myPort2.on('open', showPortOpen);
myPort2.on('data', sendSerialData);
myPort2.on('close', showPortClose);
myPort2.on('error', showError);


// ------------------------ Serial event functions:
// this is called when the serial port is opened:
function showPortOpen() {
  console.log('port open. Data rate: ' + myPort + myPort.options.baudRate);
  console.log('port open. Data rate: ' + myPort2 + myPort2.options.baudRate);
  // ??? why not showing
}

// this is called when new data comes into the serial port:
function sendSerialData(data) {
  // if there are webSocket connections, send the serial data
  // to all of them:

  // TODO: customize this, and add more event driven callback functions

  console.log("fdsfs" + data);
  if (connections.length > 0) {
    console.log(connections.length);
    broadcast(data);
  }
}

function showPortClose() {
   console.log('port closed.');
}
// this is called when the serial port has an error:
function showError(error) {
  console.log('Serial port error: ' + error);
}

function sendToSerial(data) {
  console.log("sending to serial: " + data);
  // console.log(myPort);
  // look at data; if data is open or close

  myPort.write(data);
  myPort2.write(data);

  // close one of them? myPort is a serial port.
  console.log("port1 is: " + myPort.isOpen());
  console.log("port2 is: " + myPort2.isOpen());
}

// ------------------------ webSocket Server event functions
wss.on('connection', handleConnection);

function handleConnection(client) {
  console.log("New Connection");        // you have a new client
  connections.push(client);             // add this client to the connections array

  client.on('message', sendToSerial);      // when a client sends a message,

  client.on('close', function() {           // when a client closes its connection
    console.log("connection closed");       // print it out
    var position = connections.indexOf(client); // get the client's position in the array
    connections.splice(position, 1);        // and delete it from the array
  });
}

// This function broadcasts messages to all webSocket clients
function broadcast(data) {
  for (c in connections) {     // iterate over the array of connections
    // connections[c].send(JSON.stringify(data)); // send the data to each connection
    connections[c].send(data); // send the data to each connection
  }
}



// ------------------------ Server function
function sendData(request) {
  // print out the fact that a client HTTP request came in to the server:
  console.log("Got a client request, sending them the data.");
  // respond to the client request with the latest serial string:
  request.respond(serialData);
}
