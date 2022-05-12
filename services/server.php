<?php if (php_sapi_name() == 'cli' || php_sapi_name() == 'cgi-fcgi') {
    $host = strtolower(php_uname("n"));
} else {
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '';
}
$host = explode(":", $host) [0];
switch ($host) {
    case 'portal.msphitect.com.my':
    case 'vanilla.sfdns.net':
        $env = 'PROD';
    break;
    case 'msphitect.ddns.net':
    case 'www.msphitect.ddns.net':
        $env = 'STAGING';
    break;
    default:
        $env = 'DEVELOPMENT';
    break;
}
define('API_ENV', isset($_SERVER['API_ENV']) ? $_SERVER['API_ENV'] : $env);

if (API_ENV === 'PROD') {
    require_once (dirname(__FILE__) . '/config/config-prod.inc.php');
} else if (API_ENV === 'STAGING') {
    require_once (dirname(__FILE__) . '/config/config-staging.inc.php');
} else {
    require_once (dirname(__FILE__) . '/config/config-dev.inc.php');
}
require_once (constant('SHARED_DIR') . '/dbfunctions.php');