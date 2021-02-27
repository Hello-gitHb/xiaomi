<?php
    $username = $_POST['username'];
    $password = $_POST['password'];
    $tel = $_POST['tel'];

    $con = mysqli_connect('localhost','root','123456','xiaomi');

    $sql_user = "SELECT *  FROM `userlist` WHERE `username` = '$username'";

    $res_user = mysqli_query($con,$sql_user);

    if(!$res_user){
        die('数据库链接错误' . mysqli_error($con));
    }
        
    $check = mysqli_fetch_assoc($res_user);

    if(!$check){
        $sql = "INSERT INTO `userlist` (`id`, `username`, `password`, `tel`) VALUES (null, '$username', '$password', '$tel')";

        $res = mysqli_query($con,$sql);

            
        if(!$res){
                die('数据库链接错误' . mysqli_error($con));
        }
        
        print_r(json_encode(array('code'=>1,'msg'=>'添加成功'),JSON_UNESCAPED_UNICODE));

    }else{
        print_r(json_encode(array('code'=>2,'msg'=>'失败'),JSON_UNESCAPED_UNICODE));
        exit;
    }

    mysqli_close($con);
?>