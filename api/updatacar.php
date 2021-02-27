<?php
    $username = $_GET['username'];
    $goods_id = $_GET['goods_id'];
    $num = $_GET['goods_num'];


    $con = mysqli_connect('localhost','root','123456','xiaomi');

    $sql = "UPDATE `carlist` SET `goods_num` = '$num' WHERE `username`= '$username' AND `goods_id`='$goods_id'";

    $res = mysqli_query($con,$sql);

    if(!$res){
        die('数据库链接失败'. mysqli_error($con));
    }

    // print_r($res)
    print_r(json_encode(array('code'=>$res,'msg'=>'修改成功')));
?>