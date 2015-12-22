<?php

require dirname(__DIR__) . '/vendor/autoload.php';

$loop = React\EventLoop\Factory::create();

$tcpConnector = new React\SocketClient\TcpConnector($loop);

$tcpConnector->create('10.6.1.119', 1337)->then(function (React\Stream\Stream $stream) {

	$facility=array('LOG_AUTH','LOG_AUTHPRIV','LOG_CRON','LOG_DAEMON','LOG_LOCAL0','LOG_LOCAL1');
	$severity=array('LOG_EMERG','LOG_ALERT','LOG_CRIT','LOG_ERR','LOG_WARNING','LOG_NOTICE','LOG_INFO','LOG_DEBUG');
	$programs=array('anacron','CRON','dhclient','kernel','laptop-mode','mtp-probe','NetworkManager','ntpd','rsyslogd');

	
while(1) {
	$delay = usleep(200000);

	$host = 'srv-'.sprintf('%02d',rand(0,9));
	$timestamp = time();
	$loc_severity=$severity[rand(0,count($severity)-1)];
	$loc_facility=$facility[rand(0,count($facility)-1)];
	$loc_progname=$programs[rand(0,count($programs)-1)];
	$tag = $loc_progname.sprintf("[%d]",rand(12000,64000));
	$message = "";
	for ($i = 1; $i < rand(20,50); $i++) {
		$message .= chr(rand(97,122));
	}
	
	$text = "{";
	$text .= "rows: 0,";
	$text .= "timestamp: ".$timestamp.",";
	$text .= "received: ".$timestamp.",";
	$text .= "message: \"" .$message."\",";
	$text .= "host: \"" .$host."\",";
	$text .= "severity: \"" .$loc_severity."\",";
	$text .= "facility: \"" .$loc_facility."\",";
	$text .= "programname: \"" .$loc_progname."\",";
	$text .= "tag: \"" .$tag ."\"";
	$text .= "}\n";
	echo "------------------------\n".$text."-----------------------------\n";
}		
	
	//$stream->write('Antani');
	//$stream->end();
});

$loop->run();

?>
