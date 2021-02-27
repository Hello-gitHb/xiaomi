<?php
    $username = $_GET['username'];
    $password = $_GET['password'];

    $con = mysqli_connect('localhost','root','123456','xiaomi');

    $sql = "SELECT * FROM `userlist` WHERE `username` = '$username' AND `password` = '$password'";

    $res = mysqli_query($con,$sql);

    if(!$res){
        die('数据库链接失败' . mysqli_error($con));
    }

    $check = mysqli_fetch_assoc($res);

    if($check){
        print_r(json_encode($sql));
    }

    mysqli_close($con);

?>