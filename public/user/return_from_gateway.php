<?php
include '../../services/server.php';
require_once constant('MODULES_DIR') . '/user_documents.php';
// $_POST['Referencenumber'] = '6107d7c1f0cf21627903937';
// $_POST['ReturnStatus'] = 'Success';
if(isset($_POST['Referencenumber']))
{
	if($_POST['ReturnStatus']=="Success")
		{	
			
			$reference_no = $_POST['Referencenumber'];
			//get reference details
			$path = str_replace('\\', '/', constant('DOC_FOLDER'));
			$rs = db_query_single("concat('" . $path . "',cms_files.module_id, '/', cms_files.primary_id, '/', cms_files.filename) AS filepath
                             , concat('" . $path . "',cms_files.module_id, '/', cms_files.primary_id) AS path
                             , cms_files.id
							 , cms_files.primary_id
                             , cms_files.filename
							 , cms_user_documents.secret_key as doc_key
							 , cms_user_documents_approvals.id as approval_key",
                            "cms_files
							 LEFT JOIN cms_user_documents on cms_user_documents.doc_no = cms_files.primary_id
							 LEFT JOIN cms_user_documents_approvals on cms_user_documents_approvals.doc_no = cms_user_documents.doc_no",
                            "JSON_EXTRACT(cms_files.json_field, '$.reference_number') = '".$reference_no."'");

			$folder = $rs['path'];
			$Encrypted_Signed_Data_file = fopen($folder."/Encrypted_Signed_Data.txt", "w");
			$txt = $_POST['Returnvalue'];
			if($txt=="")
			{
				//Your e-sign not activated yet
				echo 'Your e-sign not activated yet';
			}
			else
			{
				fwrite($Encrypted_Signed_Data_file, $txt);
				fclose($Encrypted_Signed_Data_file);
				
				digital_sign_decrypt($folder, $rs['filepath']);
				
				// $params = (object) array('id' => $rs['approval_key'],'doc_no' => $rs['primary_id']);
				// verify_document($params);

				$data[':id']        = $rs['approval_key'];
				$data[':is_verified'] = 1;
				$data[':verified_at'] = get_current_date();
				$data = add_timestamp_to_array($data,0,1);
				db_update($data, 'cms_user_documents_approvals', 'id');

				$redirect_url = ROOT_URL.'/user/document/'.$rs['doc_key'].'/'.$rs['approval_key'].'&status=verified';
				echo '<script type="text/javascript">
						window.location = "'.$redirect_url.'"
					</script>';
				//success
			}
			
		}
		else
		{
			echo "<h1>E-sign Failed</h1>";
			echo $_POST['ErrorMessage'];
				

		}
}
else
{
	?>
		<h2>Something went wrong. Please Try again later</h2>
		
		<?php
}
?>