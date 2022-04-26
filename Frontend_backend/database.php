<?php
//database
    $hostname = "172.17.0.1:3306";
    $database = "mydb";
    $user = "root";
    $password = "password";
    $mysqli = new mysqli($hostname, $user, $password, $database);

    if($mysqli -> connect_error){
        echo "Errore Database".$mysqli-> connect_error;
    }
?>