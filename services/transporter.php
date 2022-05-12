<?php

	if(constant('LOG_TRANS') == true)
		log_trans("SENT = " . $rec_data, constant('SERVICE_LOG'));
		
	$ch 		= curl_init();
	curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json")); 
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS,  $rec_data);
	curl_setopt($ch, CURLOPT_HEADER, false);		// added to see incoming from web service
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);	// added to see incoming from web service
	curl_setopt($ch, CURLOPT_URL, constant('SERVICE_URL'));
     
	header("Content-Type: application/json");
	$data = curl_exec($ch);
			
	if (curl_errno($ch)) 
        print curl_error($ch);
     else 
        curl_close($ch);
	 
   	if(constant('LOG_TRANS') == true)	// added to log incoming from web service
   		log_trans("RECEIVED = " . $data, constant('SERVICE_LOG'));	
	
   	if(!$data)
   	{
   		echo handle_fail_response('Please provide valid method');
   	}
   	else
   	{
		echo $data;
   	}	
	// return $data;   was taken out to see whats is coming from server
	
?>