<?php
    //funzione per il countRow
    function countRow(){
        require("database.php");
        $query = "SELECT count(*) FROM employees";
        $result = $mysqli-> query($query);
        $row = $result-> fetch_row();
        return $row[0];
    }    
    //funzione per il get
    function GET($page, $lenght){
        require("database.php");
        $query = "SELECT * FROM employees ORDER BY id LIMIT $page, $lenght";
        $rows = array();
        if($result = $mysqli-> query($query)){
            while($row = $result-> fetch_assoc()){
                $rows[] = $row;
            }
        }
        return $rows;
    }
    //funzione per il delete
    function DELETE($id){
        require("database.php");
        $query = "DELETE FROM employees WHERE id = $id";
        $result = $mysqli-> query($query);
    }
    //funzione per il post
    function POST($firstN, $lastN, $g){
        require("database.php");
        $query = "INSERT INTO employees (first_name, last_name, gender) VALUES ($firstN, $lastN, $g)";
        $result = $mysqli-> query($query);
    }
    //funzione per il put
    function PUT($firstN, $lastN, $g, $id){
        require("database.php");
        $query = "UPDATE employees SET first_name = $firstN, last_name = $lastN, gender = $g WHERE id = $id";
        $result = $mysqli-> query($query);
    }
    //funzione per il get_by_id 
    function GET_BY_ID($id){
        require("database.php");
        $query = "SELECT * FROM employees WHERE id = $id";
        $rows = array();
        if($result = $mysqli-> query($query)){
            while($row = $result-> fetch_assoc()){
                $rows[] = $row;
            }
        }
        return $rows;
    }
?>