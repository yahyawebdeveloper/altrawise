<?php

error_reporting(E_ALL | E_STRICT);

require_once('../config/config-dev.inc.php');
require_once(constant('SHARED_DIR')     . '/dbfunctions.php');
require('UploadHandler.php');

$params             = array();
$upload_path        = get_upload_path();
$file_name          = get_file_name();
$item_data          = get_data();
$overwrite_status   = get_overwrite_status();

if ($upload_path)
{
    $params['upload_dir'] = constant('DOC_FOLDER') . $upload_path;
    $params['upload_url'] = constant('UPLOAD_DIR_URL') . $upload_path;
}
if ($file_name)
{
    $params['filename'] = $file_name;
}
if ($item_data)
{
	$params['item_data'] = $item_data;
}
if ($overwrite_status)
{
    $params['overwrite_status'] = $overwrite_status;
}


/**
 * Get upload path sent by client. It handles two reading method from
 * $_REQUEST (using when upload) and from $_GET (using when deletion)
 * @return string - upload path
 */
function get_upload_path()
{
    if (isset($_REQUEST['upload_path']))
    {
        return $_REQUEST['upload_path'];
    }
    else if (isset($_GET['upload_path']))
    {
        return $_GET['upload_path'];
    }
    return '';
}

/**
 * Get file name sent by client. This will be the new file name when the file is uploaded
 * @return string - new file name
 */
function get_file_name()
{
    if (isset($_REQUEST['file_name']))
    {
        return $_REQUEST['file_name'];
    }
    else if (isset($_GET['file_name']))
    {
        return $_GET['file_name'];
    }
    return '';
}

function get_data()
{
	if (isset($_REQUEST['item_data']))
	{
		return $_REQUEST['item_data'];
	}
	else if (isset($_GET['item_data']))
	{
		return $_GET['item_data'];
	}
	return '';
}

function get_overwrite_status()
{
    if (isset($_REQUEST['overwrite']))
    {
        return $_REQUEST['overwrite'];
    }
    else if (isset($_GET['overwrite']))
    {
        return $_GET['overwrite'];
    }
    return false;
}



$upload_handler = new UploadHandler($params);
