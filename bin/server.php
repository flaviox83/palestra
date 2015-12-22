<?php
require dirname ( __DIR__ ) . '/vendor/autoload.php';

$loop = React\EventLoop\Factory::create ();

$socket = new React\Socket\Server ( $loop );
$socket->on ( 'connection', function ($conn) {
	echo "===> [CONNECT]<====\n";
	$conn->write ( "Hello there!\n" );
	$conn->write ( "Welcome to this amazing server!\n" );
	$conn->write ( "Here's a tip: don't say anything.\n" );
	
	$conn->on ( 'data', function ($data) {
		echo "===> [" . $data . "]<====\n";
	} );	
} );

$socket->listen ( 1337 );

$loop->run ();

?>