<?php

require dirname(__DIR__) . '/vendor/autoload.php';

$loop = React\EventLoop\Factory::create();

$tcpConnector = new React\SocketClient\TcpConnector($loop);

$tcpConnector->create('127.0.0.1', 1337)->then(function (React\Stream\Stream $stream) {
	$stream->write('Antani');
	$stream->end();
});

$loop->run();

?>