<?php

/**
 * Do not use or reference this directly from your client-side code.
 * Instead, this should be required via the endpoint.php or endpoint-cors.php
 * file(s).
 */

class UploadHandler {

    public $allowedExtensions = array();
    public $sizeLimit = null;
    public $inputName = 'qqfile';
    public $chunksFolder = 'chunks';
    protected $_mkdir_mode = 0755;

    public $chunksCleanupProbability = 0.001; // Once in 1000 requests on avg
    public $chunksExpireIn = 604800; // One week

    protected $uploadName;

    /**
     * Get the original filename
     */
    public function getName(){
        if (isset($_REQUEST['qqfilename']))
            return $_REQUEST['qqfilename'];

        if (isset($_FILES[$this->inputName]))
            return $_FILES[$this->inputName]['name'];
    }

    public function getInitialFiles() {
        $initialFiles = array();

        for ($i = 0; $i < 5000; $i++) {
            array_push($initialFiles, array("name" => "name" + $i, uuid => "uuid" + $i, thumbnailUrl => "/test/dev/handlers/vendor/fineuploader/php-traditional-server/fu.png"));
        }

        return $initialFiles;
    }

    /**
     * Get the name of the uploaded file
     */
    public function getUploadName(){
        return $this->uploadName;
    }

    public function combineChunks($uploadDirectory, $name = null) {
        $uuid = $_POST['qquuid'];
        if ($name === null){
            $name = $this->getName();
        }
        $targetFolder = $this->chunksFolder.DIRECTORY_SEPARATOR.$uuid;
        $totalParts = isset($_REQUEST['qqtotalparts']) ? (int)$_REQUEST['qqtotalparts'] : 1;

        $targetPath = join(DIRECTORY_SEPARATOR, array($uploadDirectory, $uuid, $name));
        $this->uploadName = $name;

        if (!file_exists($targetPath)){
            mkdir(dirname($targetPath), 0777, true);
        }
        $target = fopen($targetPath, 'wb');

        for ($i=0; $i<$totalParts; $i++){
            $chunk = fopen($targetFolder.DIRECTORY_SEPARATOR.$i, "rb");
            stream_copy_to_stream($chunk, $target);
            fclose($chunk);
        }

        // Success
        fclose($target);

        for ($i=0; $i<$totalParts; $i++){
            unlink($targetFolder.DIRECTORY_SEPARATOR.$i);
        }

        rmdir($targetFolder);

        if (!is_null($this->sizeLimit) && filesize($targetPath) > $this->sizeLimit) {
            unlink($targetPath);
            http_response_code(413);
            return array("success" => false, "uuid" => $uuid, "preventRetry" => true);
        }

        return array("success" => true, "uuid" => $uuid);
    }

    /**
     * Process the upload.
     * @param string $uploadDirectory Target directory.
     * @param string $name Overwrites the name of the file.
     */
    public function handleUpload($uploadDirectory, $name = null){

        if (is_writable($this->chunksFolder) &&
            1 == mt_rand(1, 1/$this->chunksCleanupProbability)){

            // Run garbage collection
            $this->cleanupChunks();
        }

        // Check that the max upload size specified in class configuration does not
        // exceed size allowed by server config
        if ($this->toBytes(ini_get('post_max_size')) < $this->sizeLimit ||
            $this->toBytes(ini_get('upload_max_filesize')) < $this->sizeLimit){
            $neededRequestSize = max(1, $this->sizeLimit / 1024 / 1024) . 'M';
            return array('error'=>"Server error. Increase post_max_size and upload_max_filesize to ".$neededRequestSize);
        }

        /**
         * @author - Syed Anees
         * @description - created directory if not exists. Because we need to have
         * directories nameed after modules and employee id so need to create for new
         * modules and new employees
         */
        if (!is_dir($uploadDirectory)) {
            mkdir($uploadDirectory, 0777, true);
        }

        if ($this->isInaccessible($uploadDirectory)){
            return array('error' => "Server error. Uploads directory isn't writable",
        'directory_name' => $uploadDirectory);
        }

        $type = $_SERVER['CONTENT_TYPE'];
        if (isset($_SERVER['HTTP_CONTENT_TYPE'])) {
            $type = $_SERVER['HTTP_CONTENT_TYPE'];
        }

        if(!isset($type)) {
            return array('error' => "No files were uploaded.");
        } else if (strpos(strtolower($type), 'multipart/') !== 0){
            return array('error' => "Server error. Not a multipart request. Please set forceMultipart to default value (true).");
        }

        // Get size and name
        $file = $_FILES[$this->inputName];
        $size = $file['size'];
        if (isset($_REQUEST['qqtotalfilesize'])) {
            $size = $_REQUEST['qqtotalfilesize'];
        }

        if ($name === null){
            $name = $this->getName();
        }

        // check file error
        if($file['error']) {
            return array('error' => 'Upload Error #'.$file['error']);
        }
        	
        // Validate name
        if ($name === null || $name === ''){
            return array('error' => 'File name empty.');
        }

        // Validate file size
        if ($size == 0){
            return array('error' => 'File is empty.');
        }

        if (!is_null($this->sizeLimit) && $size > $this->sizeLimit) {
            return array('error' => 'File is too large.', 'preventRetry' => true);
        }

        // Validate file extension
        $pathinfo = pathinfo($name);
        $ext = isset($pathinfo['extension']) ? $pathinfo['extension'] : '';

        if($this->allowedExtensions && !in_array(strtolower($ext), array_map("strtolower", $this->allowedExtensions))){
            $these = implode(', ', $this->allowedExtensions);
            return array('error' => 'File has an invalid extension, it should be one of '. $these . '.');
        }

        // Save a chunk
        $totalParts = isset($_REQUEST['qqtotalparts']) ? (int)$_REQUEST['qqtotalparts'] : 1;

        $uuid = $_REQUEST['qquuid'];
        if ($totalParts > 1){
        # chunked upload

            $chunksFolder = $this->chunksFolder;
            $partIndex = (int)$_REQUEST['qqpartindex'];

            if (!is_writable($chunksFolder) && !is_executable($uploadDirectory)){
                return array('error' => "Server error. Chunks directory isn't writable or executable.");
            }

            $targetFolder = $this->chunksFolder.DIRECTORY_SEPARATOR.$uuid;

            if (!file_exists($targetFolder)){
                mkdir($targetFolder, 0777, true);
            }

            $target = $targetFolder.'/'.$partIndex;
            $success = move_uploaded_file($_FILES[$this->inputName]['tmp_name'], $target);

            return array("success" => true, "uuid" => $uuid);

        }
        else {
        # non-chunked upload

            $target = join(DIRECTORY_SEPARATOR, array($uploadDirectory, $uuid, $name));

            if ($target){
                $this->uploadName = basename($target);

                if (!is_dir(dirname($target))){
                    mkdir(dirname($target), 0777, true);
                }
                if (move_uploaded_file($file['tmp_name'], $target))
                {
                    $url = $this->get_server_protocol() . substr($_SERVER['REQUEST_URI'], 0, strrpos($_SERVER['REQUEST_URI'], "/")) . "/$uploadDirectory/$uuid/$name";
                    $object = new stdClass();
                    $object_data = new stdClass();
                    $object->token = $_REQUEST['token'];
                    $object->method = $_REQUEST['method'];
                    $object->service_url = $_REQUEST['url'];
                    $object_data->id = $uuid;
                    $object_data->primary_id = $_REQUEST['primary_id'];
                    $object_data->secondary_id = $_REQUEST['secondary_id'];
                    $object_data->module_id = $_REQUEST['module_id'];
                    $object_data->filename = $name;
                    // $object_data->filesize = $_REQUEST['qqtotalfilesize'];
                    $object_data->filesize = (isset($_REQUEST['qqtotalfilesize'])) ? $_REQUEST['qqtotalfilesize'] : $size;
                    $object_data->json_field = new stdClass();
                    $object_data->emp_id = $_REQUEST['emp_id'];
                    $object->data = $object_data;
                    // $data = $this->call_web_service($object);
                    return array('success'=> true, "uuid" => $uuid, "url" => $url);
                }
            }

            return array('error'=> 'Could not save uploaded file.' .
                'The upload was cancelled, or server error encountered');
        }
    }

    /**
     * Process a delete.
     * @param string $uploadDirectory Target directory.
     * @params string $name Overwrites the name of the file.
     *
     */
    public function handleDelete($uploadDirectory, $name=null)
    {
        if ($this->isInaccessible($uploadDirectory)) {
            return array('error' => "Server error. Uploads directory isn't writable" . ((!$this->isWindows()) ? " or executable." : "."));
        }

        $targetFolder = $uploadDirectory;
        $uuid = false;
        $method = $_SERVER["REQUEST_METHOD"];
	    if ($method == "DELETE") {
            $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $tokens = explode('/', $url);
            $uuid = $tokens[sizeof($tokens)-1];
        } else if ($method == "POST") {
            $uuid = $_REQUEST['qquuid'];
        } else {
            return array("success" => false,
                "error" => "Invalid request method! ".$method
            );
        }

        $target = join(DIRECTORY_SEPARATOR, array($targetFolder, $uuid));

        if (is_dir($target)){
            $this->removeDir($target);

            $object = new stdClass();
            $object_data = new stdClass();
            $object->token = $_REQUEST['token'];
            $object->method = $_REQUEST['method'];
            $object->service_url = $_REQUEST['url'];
            $object_data->id = $uuid;
            $object_data->emp_id = $_REQUEST['emp_id'];
            $object->data = $object_data;
            $data = $this->call_web_service($object);

            return array("success" => true, "uuid" => $uuid, "data" => $data);
        } else {
            return array("success" => false,
                "error" => "File not found! Unable to delete.".$url,
                "path" => $uuid
            );
        }

    }

    /**
     * Returns a path to use with this upload. Check that the name does not exist,
     * and appends a suffix otherwise.
     * @param string $uploadDirectory Target directory
     * @param string $filename The name of the file to use.
     */
    protected function getUniqueTargetPath($uploadDirectory, $filename)
    {
        // Allow only one process at the time to get a unique file name, otherwise
        // if multiple people would upload a file with the same name at the same time
        // only the latest would be saved.

        if (function_exists('sem_acquire')){
            $lock = sem_get(ftok(__FILE__, 'u'));
            sem_acquire($lock);
        }

        $pathinfo = pathinfo($filename);
        $base = $pathinfo['filename'];
        $ext = isset($pathinfo['extension']) ? $pathinfo['extension'] : '';
        $ext = $ext == '' ? $ext : '.' . $ext;

        $unique = $base;
        $suffix = 0;

        // Get unique file name for the file, by appending random suffix.

        while (file_exists($uploadDirectory . DIRECTORY_SEPARATOR . $unique . $ext)){
            $suffix += rand(1, 999);
            $unique = $base.'-'.$suffix;
        }

        $result =  $uploadDirectory . DIRECTORY_SEPARATOR . $unique . $ext;

        // Create an empty target file
        if (!touch($result)){
            // Failed
            $result = false;
        }

        if (function_exists('sem_acquire')){
            sem_release($lock);
        }

        return $result;
    }

    /**
     * Deletes all file parts in the chunks folder for files uploaded
     * more than chunksExpireIn seconds ago
     */
    protected function cleanupChunks(){
        foreach (scandir($this->chunksFolder) as $item){
            if ($item == "." || $item == "..")
                continue;

            $path = $this->chunksFolder.DIRECTORY_SEPARATOR.$item;

            if (!is_dir($path))
                continue;

            if (time() - filemtime($path) > $this->chunksExpireIn){
                $this->removeDir($path);
            }
        }
    }

    /**
     * Removes a directory and all files contained inside
     * @param string $dir
     */
    protected function removeDir($dir){
        foreach (scandir($dir) as $item){
            if ($item == "." || $item == "..")
                continue;

            if (is_dir($item)){
                $this->removeDir($item);
            } else {
                unlink(join(DIRECTORY_SEPARATOR, array($dir, $item)));
            }

        }
        rmdir($dir);
    }

    /**
     * Converts a given size with units to bytes.
     * @param string $str
     */
    protected function toBytes($str){
	$str = trim($str);
        $last = strtolower($str[strlen($str)-1]);
	$val;
	if(is_numeric($last)) {
		$val = (int) $str;
	} else {
		$val = (int) substr($str, 0, -1);
	}
        switch($last) {
            case 'g': case 'G': $val *= 1024;
            case 'm': case 'M': $val *= 1024;
            case 'k': case 'K': $val *= 1024;
        }
        return $val;
    }

    /**
     * Determines whether a directory can be accessed.
     *
     * is_executable() is not reliable on Windows prior PHP 5.0.0
     *  (http://www.php.net/manual/en/function.is-executable.php)
     * The following tests if the current OS is Windows and if so, merely
     * checks if the folder is writable;
     * otherwise, it checks additionally for executable status (like before).
     *
     * @param string $directory The target directory to test access
     */
    protected function isInaccessible($directory) {
        $isWin = $this->isWindows();
        $folderInaccessible = ($isWin) ? !is_writable($directory) : ( !is_writable($directory) && !is_executable($directory) );
        return $folderInaccessible;
    }

    /**
     * Determines is the OS is Windows or not
     *
     * @return boolean
     */

    protected function isWindows() {
    	$isWin = (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
    	return $isWin;
    }

    public function getFilesFromServices($param){
        
        $data = json_decode($param);
        $object = new stdClass();
        $object_data = new stdClass();
        $object->token = $data->token;
        $object->method = $data->method;
        $object->service_url = $data->data->url;
        
        $object_data->id = $this->if_property_exist($data->data,"id",'');
        $object_data->primary_id = $this->if_property_exist($data->data,"primary_id",'');
        $object_data->secondary_id = $this->if_property_exist($data->data, "secondary_id",'');
        $object_data->module_id = $this->if_property_exist($data->data, "module_id",'');
        $object_data->filename = $this->if_property_exist($data->data, "filename",'');
        $object_data->json_field = new stdClass();
        $object_data->emp_id = 1;
        $object->data = $object_data;
        $return_data =  $this->call_web_service($object);

        return $return_data['data'];
    }

    public function call_web_service($param)
	{
		$rest_url 	= $param->service_url;		 
		$ch 		= curl_init(); 

		curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json")); 
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS,  json_encode($param));
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);	
		curl_setopt($ch, CURLOPT_URL, $rest_url);
		 
		$result = curl_exec($ch);
		
		if (curl_errno($ch)) 
			$error = array('status'=> 'ERROR', 'err'=> 'cURL: ' . curl_error($ch));
		
		curl_close($ch);
		
        $return_data = json_decode($result,true);			
		return $return_data;	
	}

    public function if_property_exist($object, $key, $return_val_if_empty = NULL)
    {
        if(isset($object->$key))
        {
            return $object->$key;
        }
        else if(empty($object->$key))
        {
            return $return_val_if_empty;
        }
        else if(is_null($object->$key))
        {
            return $return_val_if_empty;
        }
        else
        {
            return $return_val_if_empty;
        }
    }

    protected function get_server_protocol()
    {
        if (isset($_SERVER['HTTPS']) &&
            ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) ||
            isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
            $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
        return 'https:';
        }
        else {
        return  'http:';
        }
    }

}
