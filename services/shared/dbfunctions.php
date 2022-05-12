<?php
/**
 * @author 		Jamal
 * @date 		17-Jun-2012
 * @Note  		Please follow the indentation
 *         		Please follow the naming convention
 */

include_once 'helperfunctions.php';

function db_query_list($field_names, $tbl_name, $where='', $start_index = 0, $limit = MAX_NO_OF_RECORDS, $orderby = '', $sortorder = 'asc', $optional_sql = false, $db = NULL)
{
	try
	{
		$sql = '';
		if($optional_sql != false)
		{
			$sql = $optional_sql;
		}
		
		$sql .= "SELECT " 	. $field_names 	. " " .
				"FROM "		. $tbl_name 	. " ";

		if($where != "")
			$sql.= "WHERE ". $where;

		if($orderby!='')
			$sql .= " ORDER BY " . $orderby . " " . $sortorder;

		if($db === NULL)
			$db =& init_read_connection();

		$sql .= ' limit ' . $start_index . ',' . $limit;

		if(LOG_TRANS)
			log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);
		
		$stmt	 = $db->query($sql);
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (!$results)
		{
		    $err = $db->errorInfo();
			if($err[0] != '00000')
            {
                 throw new Exception(implode(":",$db->errorInfo()));
                 close_read_con($db);
                 die;
            }
		}

		if($db != NULL)
			close_read_con($db);

		$results = array
		(
			'list' 		=> $results,
			'rec_index' => ($start_index + $limit)
		);

		return $results;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_query($field_names,
				      $tbl_name,
				      $where		= '',
				      $limit		= '',
				      $index		= 0,
				      $orderby		= '',
				      $sortorder	= 'asc',
				      $db 			= NULL)

{
	try
	{
		$sql = "SELECT " 	. $field_names 	. " " .
			   "FROM "		. $tbl_name 	. " ";

		if($where != "")
			$sql.= "WHERE ". $where;

		if($orderby!='')
			$sql .= " ORDER BY " . $orderby . " " . $sortorder;

		if($db === NULL)
			$db =& init_read_connection();

		if($limit != '')
			$sql .= ' limit ' .$index . ',' . $limit;

		if(LOG_TRANS)
			log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);
		
		$stmt	 = $db->query($sql);
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (!$results)
		{
       		 $err = $db->errorInfo();
			 if($err[0] != '00000')
             {
                 throw new Exception(implode(":", $db->errorInfo()));
                 close_read_con($db);
                 die;
             }
		}

		if($db != NULL)
			close_read_con($db);

		return $results;

	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_query_single($field_names,
							$tbl_name,
							$where		= '',
							$limit		= '',
							$index		= 0,
							$orderby	= '',
							$sortorder	= 'asc',
							$db 		= NULL)
		
{
	try
	{
		$sql = "SELECT " 	. $field_names 	. " " .
				"FROM "		. $tbl_name 	. " ";
		
		if($where != "")
			$sql.= "WHERE ". $where;
			
		if($orderby!='')
			$sql .= " ORDER BY " . $orderby . " " . $sortorder;
				
		if($db === NULL)
			$db =& init_read_connection();
			
		if($limit != '')
			$sql .= ' limit ' .$index . ',' . $limit;
			
		if(LOG_TRANS)
			log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);
			
		$stmt	 = $db->query($sql);
		$results = $stmt->fetch(PDO::FETCH_ASSOC);
		if (!$results)
		{
			$err = $db->errorInfo();
			if($err[0] != '00000')
			{
				throw new Exception(implode(":", $db->errorInfo()));
				close_read_con($db);
				die;
			}
		}
					
		if($db != NULL)
			close_read_con($db);
			
		return $results;
								
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

//use only for deletion
function db_execute_sql($sql)
{
	try
	{
		if(LOG_TRANS)
			log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);

		$db 	=& init_connection();
		$stmt	= $db->query($sql);
		if (!$stmt->rowCount())
		{
       		 $err = $db->errorInfo();
			 if($err[0] != '00000')
             {
                 throw new Exception(implode(":", $db->errorInfo()));
                 close_con($db);
                 die;
             }
		}
		
		$row_count = $stmt->rowCount();
		close_con($db);
		return $row_count;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_query_new($field_names, 
						$tbl_name, 
						$where 		= '',
						$param			,
						$limit		= '',
						$index		= 0,
						$orderby	= '',
						$sortorder	= 'asc',
						$fetch_type = PDO::FETCH_ASSOC,
						$db = NULL)
{
	try
	{
			
			$sql = "SELECT $field_names FROM  $tbl_name";
			
			if($where != "")
				$sql	.= " WHERE ". $where;
			
			if($orderby	!= '')
				$sql 	.= " ORDER BY " . $orderby . " " . $sortorder;
				
			if($limit != '')
				$sql 	.= ' limit ' .$index . ',' . $limit;
			
			if(LOG_TRANS)
				log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);
			
			if($db === NULL)
				$db =& init_read_connection();

			$stmt		= $db->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$stmt		->execute($param);
			$results  	= $stmt->fetchAll($fetch_type);
			if (!$results)
			{
				$err = $db->errorInfo();
				if($err[0] != '00000')
				{
					throw new Exception(implode(":", $db->errorInfo()));
					close_read_con($db);
					die;
				}
			}
			
			if($db != NULL)
				close_read_con($db);
				
			return $results;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_execute_custom_sql($sql,$fetch_type = PDO::FETCH_ASSOC)
{
    try
    {
        if(LOG_TRANS)
            log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);

        $db 	  =& init_connection();
        $stmt	  = $db->query($sql);
        $results  = $stmt->fetchAll($fetch_type);
		if (!$results)
		{
       		 $err = $db->errorInfo();
			 if($err[0] != '00000')
             {
                 throw new Exception(implode(":", $db->errorInfo()));
                 close_con($db);
                 die;
             }
		}

		if($db != NULL)
			close_con($db);

		return $results;
    }
    catch(Exception $e)
    {
        handle_exception($e);
    }
}

function db_execute_multiple_query($sql)
{
	try
	{
		if(LOG_TRANS)
			log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);

		$db 	=& init_connection();
		$stmt	= $db->query($sql);
		$stmt	->nextRowset();
		$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (!$results)
		{
			 $err = $db->errorInfo();
			 if($err[0] != '00000')
             {
                 throw new Exception(implode(":", $db->errorInfo()));
                 close_con($db);
                 die;
             }
		}
		
		close_con($db);
		return $results;
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_add($array_data, $tbl_name)
{
	try
	{
		foreach ( $array_data as $key => $value)
		{
			$col_array[] 	= str_replace(":","",$key);
			$bind_array[]	= $key;
			$bind_value[]	= "'" . $value . "'";

			
		}

		$cols 	= implode(",",$col_array);
	  	$binds  = implode(",",$bind_array);

$sql = <<<EOSQL
  		INSERT INTO $tbl_name
		($cols)
  		VALUES
  		($binds)
EOSQL;

		
		log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n " . print_r($array_data,true),SERVICE_LOG);

		$db	 		= &init_connection();
		$query		= $db->prepare($sql);
		$results 	= $query->execute($array_data);
		log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n " . print_r($array_data,true) . " \r\n Result " . $results,SERVICE_LOG);

		if (!$results)
		{
       	  	$err = $db->errorInfo();
			if($err[0] != '00000')
            {
                log_trans("Error at " . __FUNCTION__ . "function : Error detail" . implode(":",$db->errorInfo()),ERROR_LOG_FILE);
                throw new Exception(implode(":", $db->errorInfo()));
                close_con($db);
                die;
            }
		}
		else
		{
			$last_insert_id 	= $db->lastInsertId();
			$effected_row_count	= $query->rowCount();
			close_con($db);
			$data 				= array
			(
				':id'				=> get_db_UUID(),
				':primary_no'		=> $last_insert_id,
				':user_ip'			=> isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
				':module_id'		=> 0,
				':user_action'		=> 'ADD',
				':sql_statement'	=> str_replace(array_keys($array_data), array_values($bind_value), $sql),
				':emp_id'			=> $array_data[':created_by'],
				':created_date'		=> get_current_date()
			);
			db_add_audit_logs($data);
			return $last_insert_id ? $last_insert_id : $effected_row_count;
			
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_add_batch($data, $tbl_name)
{
	try
	{
		
		$rows_sql 		= array();							//Will contain SQL snippets.
		$to_bind 		= array();							//Will contain the values that we need to bind.
		$min_index		= min(array_keys($data));			//Get a list of column names to use in the SQL statement.
		$column_names 	= array_keys($data[$min_index]);	// $columnNames = array_keys($data[0]);

		foreach($data as $array_index => $row)				//Loop through our $data array.
		{
			$params = array();
			foreach($row as $column_name => $column_value)
			{
				$param 			= ":" . $column_name . $array_index;
				$params[] 		= $param;
				$to_bind[$param]= $column_value;
			}
			$rows_sql[] 		= "(" . implode(", ", $params) . ")";
		}
		
		$sql 	= "INSERT INTO `$tbl_name` (" . implode(", ", $column_names) . ") VALUES " . implode(", ", $rows_sql); //Construct our SQL statement
		$db	 	= &init_connection();
		$query	= $db->prepare($sql);
		
		foreach($to_bind as $param => $val) 		//Bind our values.
		{
			$query->bindValue($param, $val);
		}
		
		$results = $query->execute();
		close_con($db);
		
		
		log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n " . $sql . " \r\n Result " . $results,SERVICE_LOG);
	}
	catch(Exception $e)
	{
		log_trans('Error:' . $sql , ERROR_LOG_FILE);
		handle_exception($e);
	}
	
}

function db_update($array_data, $tbl_name, $primary_key,$second_key = false)
{
	try
	{
		$values = array();
		$and    = '';
		
		foreach ( $array_data as $key => $value)
		{
			$col_array[] = str_replace(':','',$key) . ' = ' . $key;
		}

		$cols 	= implode(", ", $col_array);

		if($second_key != false)
		{
			$and = " AND $second_key = :$second_key";
		}
		
		
		$sql = <<<EOSQL
  		UPDATE $tbl_name SET $cols WHERE $primary_key = :$primary_key 
EOSQL;
		$sql	.= $and;
		log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n " . print_r($sql,true),SERVICE_LOG);
		
		$db 		= &init_connection();
		$query		= $db->prepare($sql);
		$results 	= $query->execute($array_data);

		log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n " . print_r($array_data,true) . " \r\n Result " . $results,SERVICE_LOG);

		if (!$results)
		{
			$err = $db->errorInfo();
			if($err[0] != '00000')
            {
                log_trans("Error at " . __FUNCTION__ . "function : Error detail" . implode(":",$db->errorInfo()),ERROR_LOG_FILE);
                throw new Exception(implode(":",$db->errorInfo()));
                close_con($db);
                die;
            }
		}
		else
		{
			close_con($db);
			return $results;
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_replace($array_data, $tbl_name)
{
	try
	{
		foreach ( $array_data as $key => $value)
		{
			$col_array[] 	= str_replace(":","",$key);
			$bind_array[]	= $key;
		}
		$cols 	= implode(",",$col_array);
		$binds  = implode(",",$bind_array);

		$sql = <<<EOSQL
  		REPLACE INTO $tbl_name
		($cols)
  		VALUES
  		($binds)
EOSQL;
		$db 		=& init_connection();
		$query		= $db->prepare($sql);
		$results 	= $query->execute($array_data);

		log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n " . print_r($array_data,true) . " \r\n Result " . $results,SERVICE_LOG);

		if (!$results)
		{
			$err = $db->errorInfo();
			if($err[0] != '00000')
            {
                log_trans("Error at " . __FUNCTION__ . "function : Error detail" . implode(":",$db->errorInfo()),ERROR_LOG_FILE);
                throw new Exception(implode(":",$db->errorInfo()));
                close_con($db);
                die;
            }
		}
		else
		{
			close_con($db);
			return $results;
		}
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_json_search($json_field,$one_or_all,$search_string,$field_in_json,$replace_val,$field_as,$table,$where,$where_value)
{
	try
	{
// 		if(LOG_TRANS)
// 			log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n" . $sql, SERVICE_LOG);
			
// 			db_query("REPLACE(JSON_UNQUOTE(JSON_SEARCH(json_field, 'all', '1', NULL, '$.attachment[*].is_visible')),'.is_visible','') as attachment","cms_employees","id = " . $id);
			
			$rs = db_query("REPLACE(JSON_UNQUOTE(JSON_SEARCH($json_field, '$one_or_all', '$search_string', NULL, '$field_in_json')),'$replace_val','') as $field_as","$table","$where = " . $where_value);
			
			if(substr($rs[0][$field_as],0,1)== '[')
			{
				$index  	= substr($rs[0][$field_as], 1, -1);
				$rs_json	= db_query("JSON_EXTRACT($json_field, $index) as $field_as",$table,"$where = " . $where_value);
			}
			else
			{
				$index		= '"' . $rs[0][$field_as] . '"';
				$rs_json	= db_query("JSON_ARRAY(JSON_EXTRACT($json_field, $index)) as $field_as",$table,"$where = " . $where_value);
			}
			
			return $rs_json;
			
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function db_json_update($json_field,$unique_search_string,$field_in_json,$replace_val,$field_as,$overwrite_field,$overwrite_val,$table,$where,$where_value)
{
	try
	{

		$rs 	= db_query("REPLACE(JSON_UNQUOTE(JSON_SEARCH($json_field, 'one', '$unique_search_string', NULL, '$field_in_json')),'$replace_val','') as $field_as","$table","$where = '" . $where_value. "'");
		
		$index 	= $rs[0][$field_as] . "." . $overwrite_field;
		
		$sql 	= "UPDATE $table SET $json_field = IFNULL(JSON_REPLACE($json_field,'$index','$overwrite_val'),$json_field) WHERE $where = '" . $where_value. "'";
		
		$result = db_execute_sql($sql);
		return $result;
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}


function db_get_sql($field_names, $tbl_name, $where='', $start_index = 0, $limit = MAX_NO_OF_RECORDS, $orderby = '', $sortorder = 'asc', $optional_sql = false)
{
	try
	{
		$sql = '';
		if($optional_sql != false)
		{
			$sql = $optional_sql;
		}
		
		$sql .= "SELECT " 	. $field_names 	. " " .
				"FROM "		. $tbl_name 	. " ";
		
		if($where != "")
		$sql.= "WHERE ". $where;
		
		if($orderby!='')
		$sql .= " ORDER BY " . $orderby . " " . $sortorder;

		$sql .= ' limit ' . $start_index . ',' . $limit;
		
		return $sql;
					
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

function &init_connection()
{
	try
	{
// 		log_trans("Function Details: " . __FUNCTION__, SERVICE_LOG);
		static $slave_db;
		$db_constant    = json_decode(constant('SLAVE_DB'));
		$config         = $db_constant[array_rand($db_constant)];
		if(!$slave_db)
		{
			$slave_db 	= new PDO("mysql:host="   . $config->host .
					";port="   . $config->port .
					";dbname=" . $config->dbname .
					";charset=utf8",
					$config->username, $config->password);
			$slave_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		return $slave_db;
	}
	catch(PDOException $e)
	{
		handle_exception($e);
		print_r($e);
		echo "unable to connect to database server";die;
	}
}

function &init_read_connection()
{
	try
	{
// 		log_trans("Function Details: " . __FUNCTION__, SERVICE_LOG);
		static $slave_db;
		$db_constant    = json_decode(constant('SLAVE_DB'));
		$config         = $db_constant[array_rand($db_constant)];
		if(!$slave_db)
		{
			$slave_db 	= new PDO("mysql:host="   . $config->host .
					";port="   . $config->port .
					";dbname=" . $config->dbname .
					";charset=utf8",
					$config->username, $config->password);
			$slave_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		return $slave_db;
	}
	catch(PDOException $e)
	{
		handle_exception($e);
		print_r($e);
		echo "unable to connect to database server";die;
	}
}

function close_read_con($db)
{
	$slave_db = null;
}

function close_con($db)
{
	$db = null;
}

function db_add_audit_logs($array_data)
{
	try
	{
		foreach ( $array_data as $key => $value)
		{
			$col_array[] 	= str_replace(":","",$key);
			$bind_array[]	= $key;
		}
		
		$cols 	= implode(",",$col_array);
		$binds  = implode(",",$bind_array);
		
		$sql = <<<EOSQL
		INSERT INTO cms_audit_logs
		($cols)
  		VALUES
  		($binds)
EOSQL;
		
		
		log_trans("Function Details: " . __FUNCTION__ . "\r\n Param Details: \r\n " . print_r($array_data,true),SERVICE_LOG);
		
		$db	 		= &init_connection();
		$query		= $db->prepare($sql);
		$results 	= $query->execute($array_data);
		
		if (!$results)
		{
			$err = $db->errorInfo();
			if($err[0] != '00000')
			{
				log_trans("Error at " . __FUNCTION__ . "function : Error detail" . implode(":",$db->errorInfo()),ERROR_LOG_FILE);
				throw new Exception(implode(":", $db->errorInfo()));
				close_con($db);
				die;
			}
		}
		close_con($db);
		
	}
	catch(Exception $e)
	{
		handle_exception($e);
	}
}

?>
