jQuery.validator.addMethod('un_method', function (value) {
    let rule = /^[\u4e00-\u9fa5]{1,7}$/
    if (rule.test(value)) {
        return true
    }
    return false
}, '用户名为7个中文')

jQuery.validator.addMethod('tel_method', function (value) {
    let rule = /^1[345789]\d{9}$/
    if (rule.test(value)) {
        return true
    }
    return false
}, '手机号格式不正确')

jQuery.validator.addMethod('pas_method', function (value) {
    let rule = /[0-9A-Za-z,\.]{8,14}/
    if (rule.test(value)) {
        return true
    }
    return false
}, '密码长度为8到14位')

$('#registry-form').validate({
    rules: {
        username: {
            required: true,
            un_method: true
        },
        tel: {
            required: true,
            tel_method: true
        },
        password: {
            required: true,
            pas_method: true
        },
        passwordcomf: {
            required: true,
            equalTo: '#pas'
        }
    },
    messages: {
        username: {
            required: '请输入用户名'
        },
        tel: {
            required: '请输入完整手机号'
        },
        passwordcomf: {
            required: '请再次输入密码',
            equalTo: '您输入的密码不相同'
        }
    },
    submitHandler: function () {
        // console.log($('.username').val());
        $.ajax({
            url: '../api/registry.php',
            method: 'post',
            data: {
                username: $('.username').val(),
                password: $('.password').val(),
                tel: $('.tel').val()
            },
            success: function (res) {
                var code = JSON.parse(res)
                if (code.code == 1) {
                    alert('您已注册成功,请登录您的账号');
                    window.location.href = "./login.html";
                } else {
                    alert('该用户名已被注册');
                    window.location.reload();
                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

})
