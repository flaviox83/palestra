<?php

namespace MyApp;

class Logger {
	protected $facility;
	protected $progname;
	protected $detailed_log;
	public function __construct() {
		$this->facility = LOG_LOCAL0;
		$this->progname = 'mielantor';
		$this->detailed_log = true;
		$this->level = LOG_DEBUG;
		$this->OpenLog ();
	}
	protected function OpenLog() {
		openlog ( $this->progname, LOG_PID, $this->facility );
	}
	protected function ProcessLine($msg) {
		if ($this->detailed_log) {
			$msg .= "[" . __FILE__ . "/" . __LINE__ . "]";
		}
		return $msg;
	}
	public function SetFacility($facility) {
		$this->facility = $facility;
	}

	public function SetLevel($level) {
		$this->level = $level;
	}
	
	public function SetDetails($flag) {
		if ($flag) {
			$this->detailed_log = true;
		} else {
			$this->detailed_log = false;
		}
	}
	
	// Constant Description
	// LOG_EMERG system is unusable
	// LOG_ALERT action must be taken immediately
	// LOG_CRIT critical conditions
	// LOG_ERR error conditions
	// LOG_WARNING warning conditions
	// LOG_NOTICE normal, but significant, condition
	// LOG_INFO informational message
	// LOG_DEBUG debug-level message
	public function Debug($msg) {
		if ($this->level >= LOG_DEBUG) {
			syslog ( LOG_DEBUG, $this->ProcessLine ( $msg ) );
		}
	}
	public function Info($msg) {
		if ($this->level >= LOG_INFO) {
			syslog ( LOG_INFO, $this->ProcessLine ( $msg ) );
		}
	}
	public function Notice($msg) {
		if ($this->level >= LOG_NOTICE) {
			syslog ( LOG_NOTICE, $this->ProcessLine ( $msg ) );
		}
	}
	public function Warning($msg) {
		if ($this->level >= LOG_WARNING) {
			syslog ( LOG_WARNING, $this->ProcessLine ( $msg ) );
		}
	}
	public function Error($msg) {
		if ($this->level >= LOG_ERR) {
			syslog ( LOG_ERR, $this->ProcessLine ( $msg ) );
		}
	}
	public function Critical($msg) {
		if ($this->level >= LOG_CRIT) {
			syslog ( LOG_CRIT, $this->ProcessLine ( $msg ) );
		}
	}
	public function Alert($msg) {
		if ($this->level >= LOG_ALERT) {
			syslog ( LOG_ALERT, $this->ProcessLine ( $msg ) );
		}
	}
	public function Emergency($msg) {
		if ($this->level >= LOG_EMERG) {
			syslog ( LOG_EMERG, $this->ProcessLine ( $msg ) );
		}
	}
}