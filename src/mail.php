<?php

function sendMail($subject , $body , $to , $name){

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,"http://luggagepark.in/droid_pay/api/v1/mail.php");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "subject={$subject}&body={$body}&to={$to}&name={$name}");

// In real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS, 
//          http_build_query(array('postvar1' => 'value1')));

// Receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

curl_close ($ch);

// Further processing ...
if ($server_output == "OK") { 
    return true ; 
} else {
    return false ;
 }

}
?>