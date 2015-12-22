<?php
// this PHP application require the Composer (1) PHP
// package manager. Once installed and available, you
// need to install the "cboden/ratchet" dependencies (2)
// --
// (1) https://getcomposer.org
// (2) http://socketo.me/docs/install
require dirname ( __DIR__ ) . '/vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

use MyApp\Chat;
use MyApp\Logger;

$logger = new Logger ();
$logger->SetDetails ( false );
$logger->SetLevel (LOG_INFO);

// main event-loop objects
$logger->debug ( 'Instantiating main loop object' );
$loop = React\EventLoop\Factory::create ();

// this is our main object, handling communications
// with connected browsers, via websockets;
$logger->debug ( 'Instantiating main Chat object' );
$chat = new Chat ();

// this is our TCP-server that will receive messages
// to be delivered to clients/browsers via websocket;
$logger->debug ( 'Instantiating main "Server" socket object' );
$server = new React\Socket\Server ( $loop );

// Let's define some very-basic code to be run when something is
// received on the main socket (the one supposed to RECEIVE the 
// data to be sent to websocket clients...
$logger->debug ( 'Setting [onConnection/onData] callback' );
$server->on ( 'connection', function ($conn) use($chat, $logger) {
	$logger->info ( '[onConnection] New client connected' );
	$chat->broadcast ( "[onCONNECTION] Client arrivato..." . PHP_EOL );
	
	// Please note that the onDATA callback is defined INSIDE the outer onCONNECTION one!
	$conn->on ( 'data', function ($data) use($conn, $chat, $logger) {
		$logger->debug ( '[onData] Got data from socket [' . count($data) . ' bytes]' );

		// passo ai client un JSON "puro", altrimenti genero problemi di parsing...
		$chat->broadcast ($data. PHP_EOL );
		//$conn->write("I just got: [".$data."]");
	} );
} );

// Let's run the main server socket
$logger->debug ( 'Spinning main server socket' );
$server->listen ( 1337, '127.0.0.1' );

// Let's run the main websocket
$logger->debug ( 'Instantiating main WebSocket object' );
$webSock = new React\Socket\Server ( $loop );

$logger->debug ( 'Spinning main websocket' );
$webSock->listen ( 8888, '127.0.0.1' );

// This is not clear... (to me, at least), unfortunately !!!!
$logger->debug ( 'instantiating main webserver (?)' );
$webServer = new Ratchet\Server\IoServer ( new Ratchet\Http\HttpServer ( new Ratchet\WebSocket\WsServer ( $chat ) ), $webSock );

// Let's add some periodic trigger, just to check that everything is running fine
$logger->debug ( 'Adding periodic timer to main loop' );
$loop->addPeriodicTimer ( 10, function () use($chat, $logger) {
	$logger->info ( "[TIMER] sending keepalive to connected websocket clients" );

	// as of now (20/12/2015) this cannot be sent, as it's **not** JSON-encoded
	// $chat->broadcast ( '[TIMER] A keepalive...' );
} );

// Everything should be in place so... let's start the main event loop.
$logger->info ( 'spinning main loop' );
$loop->run ();