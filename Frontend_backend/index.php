<?php
    $method = $_SERVER['REQUEST_METHOD'];
    require("datalayer.php");
    header('Content-Type: application/json');
    $page = @$_GET["page"] ?? 0;
    $size = @$_GET["size"] ?? 20;
    $id = @$_GET["id"] ?? 0;
    $count = countRow();
    $last = ceil($count/$size) -1;
    $baseurl = "http://localhost:8085/index.php";
    $arrayJSON = array ();

    $arrayJSON['_embedded'] = array(
        "employees" => array(
            
        )
    );

    $arrayJSON['_links'] = links($page, $size, $last, $baseurl);

    $arrayJSON['pages'] = array (
        "size" => $size,
        "totalElements" => $count,
        "totalPages" => $last,
        "number" => $page
    );

    function href($baseurl, $page, $size){
        return $baseurl . "?page=" . $page . "&size=" . $size;
    }
    function links($page, $size, $last, $baseurl){
        $links = array(
            "first" => array ( "href" => href($baseurl, 0, $size)),
            "self" => array ( "href" => href($baseurl, $page, $size), "templated" => true),
            "last" => array ( "href" => href($baseurl, $last, $size))
        );
        if($page > 0){
            $links["prev"] = array( "href" => href($baseurl, $page - 1, $size));
        }
        if($page < $last){
            $links["next"] = array ( "href" => href($baseurl, $page + 1, $size));
        }       
        return $links;
    }

    switch($method){
        case 'GET':
            if($id != 0){
                $arrayJSON['_embedded']['employees'] = GET_BY_ID($id);
                echo json_encode($arrayJSON);
            }else{
                $arrayJSON['_embedded']['employees'] = GET($page*$size, $size);
                echo json_encode($arrayJSON);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            POST($data["first_name"], $data["last_name"], $data["gender"]);

            echo json_encode($data);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents('php://input'), true);
            PUT($data["first_name"], $data["last_name"], $data["gender"], $id);

            echo json_encode($data);
            break;
        case 'DELETE':
            DELETE($id);
            if(($key = array_search('id: '. $id, $arrayJSON)) !== false){
                unset($arrayJSON[$key]);
            }
            echo json_encode($arrayJSON);
            break;
        //in caso di richiesta negativa
        default:
            header("HTTP/1.1 400 BAD REQUEST");
            break;
    }
?>