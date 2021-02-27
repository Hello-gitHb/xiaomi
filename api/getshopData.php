<?php
    $userName = $_POST['username'];
    $con = mysqli_connect('localhost','root','123456','xiaomi');

    $carSql = "SELECT * FROM `carlist` WHERE `userName` = '$userName'";
    $carRes = mysqli_query($con,$carSql);
    if(!$carRes){
        die('数据路链接错误' . mysqli_error($con));
    }
    $car = array();
    $carRow = mysqli_fetch_assoc($carRes);
    while($carRow){
        array_push($car,$carRow);
         $carRow = mysqli_fetch_assoc($carRes);
    }

    print_r(json_encode($car,JSON_UNESCAPED_UNICODE));
?>