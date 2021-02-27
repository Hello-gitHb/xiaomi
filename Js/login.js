$('#xiaomi-login').validate({
    rules: {
        username: {
            required: true,
        },
        password: {
            required: true,
        }
    }, messages: {
        username: {
            required: '输入不能为空'
        },
        password: {
            required: '输入不能为空'
        }
    },
    submitHandler: function () {
        $.ajax({
            url: '../api/login.php',
            method: 'get',
            data: {
                username: $('.username').val(),
                password: $('.password').val()
            },
            dataType: 'json',
            success: function () {
                alert('登录成功')
                window.location.href = "../index.html";
                $.cookie('login', JSON.stringify($('.username').val()));
            },
            error: function () {
                alert('您输入的用户名或密码有误');
                window.location.reload();
            }
        })
    }

})
