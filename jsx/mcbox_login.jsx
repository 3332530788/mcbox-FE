import React from 'react';


let Login = React.createClass({
    getInitialState: function() {
        return {
            show: 'hidden',
            ulist: [],
            tip: 'hidden',
            random: '',
            tipTxt: '账号密码出错'
        }
    },
    componentDidMount() {
        this.init();
    },
    show: function(string) {
        mainWindow.showLoginDialog(string);
    },
    // show: function(type='login',cb) {
    //     let {_wrap} = this.props;
    //     this.rechargeYZM();
    //     $(_wrap+' .login_box .name').attr('value','');
    //     $(_wrap+' .login_box .pw').attr('value','');
    //     this.setState({
    //         show: type,
    //         tip: 'hidden',
    //         callback:cb
    //     });
    //     if (type == 'login') {
    //         this.autoLogin();
    //         $(_wrap+' .login_box .name').attr('placeholder','爱拍号 | 手机号 | 邮箱');
    //         $(_wrap+' .login_box .pw').attr('placeholder','密码');
    //     } else {
    //         $(_wrap+' .login_box .name').attr('placeholder','邮箱');
    //         $(_wrap+' .login_box .pw').attr('placeholder','密码');
    //     }
    //     return false;
    // },
    // close: function() {
    //     this.setState({
    //         show:'hidden',
    //         tip: 'hidden'
    //      });
    // },
    // autoLogin: function() {
    //     let _lastu = loginInfoHelper.getHistoricalLoginUserList().lastLoginUser,
    //         _listu = this.state.ulist,
    //         {_wrap} = this.props,
    //         _index = _.findIndex(_listu,{
    //                 userName: _lastu,
    //                 loginInfo:{
    //                     savePassword: true
    //                     }
    //                 }
    //         );
    //         if (_index >= 0) {
    //             $(_wrap+' .login_box .name').attr('value',_listu[_index].userName);
    //             $(_wrap+' .login_box .pw').attr('value','aipaiAutoPw');
    //             if (_listu[_index].loginInfo.savePassword == true && !$(_wrap+' .remember').is(':checked')) {
    //                 $(_wrap+' .remember').click();
    //             }
    //             if (_listu[_index].loginInfo.autoLogin == true && !$(_wrap+' .autologin').is(':checked')) {
    //                 $(_wrap+' .autologin').click();
    //             }
    //         }
    // },
    // login: function() {
    //     let {_wrap} = this.props;
    //     var _name = $(_wrap+' .login_box .name').attr('value'),
    //         _pw = $(_wrap+' .login_box .pw').attr('value'),
    //         _auto = $(_wrap+' .autologin').is(':checked'),
    //         _remember = $(_wrap+' .remember').is(':checked');
    //     loginHost.LogIn(_name,_auto,_remember,_pw);
    // },
    // register: function() {
    //     let {_wrap} = this.props;
    //     if (this.checkRegister()) {
    //         return false;
    //     }
    //      var _name = $(_wrap+' .login_box .name').attr('value'),
    //          _pw = $(_wrap+' .login_box .pw').attr('value'),
    //          _yzm = $(_wrap+' .login_box .check').attr('value');
    //      boxUserRegister.registerAccount(_name,_pw,_yzm);
    // },
    // checkRegister: function() {
    //     let {_wrap} = this.props;
    //     let _name = $(_wrap+' .login_box .name').attr('value'),
    //         _pw = $(_wrap+' .login_box .pw').attr('value'),
    //         pattern=/[%\&\+,\/;'\[\]]/im;
    //      if (!$(_wrap+' .res-set input').is(':checked')) {
    //         this.setState({
    //             tip:'show',
    //             tipTxt: '您还没同意爱拍服务协议!'
    //         });
    //         return true;
    //     }
    //     if (!_name.match("^[0-9a-z][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}[0-9a-z]\.){1,4}[a-z]{2,4}$")) {
    //         this.setState({
    //             tip:'show',
    //             tipTxt: '账号格式有误!'
    //         });
    //         return true;
    //     }
    //     if (_pw.length < 4 || _pw.length > 14 || pattern.test(_pw)) {
    //         this.setState({
    //             tip:'show',
    //             tipTxt: '密码需要大于4位和小于14位,且不包括特殊字符!'
    //         });
    //         return true;
    //     }
    // },
    // rechargeYZM: function() {
    //     let _random = Math.random(),
    //         {_wrap} = this.props;
    //     this.setState({
    //         random: "http://m.aipai.com/app/www/common/captcha.php?rid="+_random
    //     });
    //     $(_wrap+' .login_box .check').attr('value','');
    // },
    init: function() {
        let {successCallback, loginInit, callback} = this.props;
        var _cb = {
            loginSuccess: (string,name) => {
                this.setState({
                    show: 'hidden',
                    tip: 'hidden'
                });
                successCallback ? successCallback() : 0;
                loginInit ? loginInit() : 0;
                console.log(this.props.type,string);
                if (this.props.type == string) {
                    callback();
                }
            }
            // loginFaile: (ret, dec) => {
            //     this.setState({
            //         show: 'login',
            //         tip: 'show',
            //         tipTxt: dec
            //     });
            // }
            // registerSuccess: (ret, dec) => {
            //     this.setState({
            //         show: 'hidden',
            //         tip: 'hidden'
            //     });
            //     let pw = $(_wrap + ' .login_box .pw').attr('value');
            //     loginHost.LogIn(ret, false, true, pw);
            // },
            // registerFaile: (ret, dec) => {
            //     this.setState({
            //         tip: 'show',
            //         tipTxt: dec
            //     });
            // }
        };
        loginHost.loginSuccess.connect(_cb, 'loginSuccess');
        // loginHost.loginFailed.connect(_cb, 'loginFaile');
        // boxUserRegister.registerSuccess.connect(_cb, 'registerSuccess');
        // boxUserRegister.registerFailed.connect(_cb, 'registerFaile');
        // this.setState({
        //     ulist:loginInfoHelper.getHistoricalLoginUserList().userInfos
        // });
    },
    render: function() {
        // var {show,tip,tipTxt,random} = this.state;
        return (
            <p></p>
            // <section className = {'login_shadow '+show}>
            // <section className = {"login_box "+show}>
            //     <i className='close' onClick={this.close}></i>
            //     <i className="avatar">
            //         <div className='head'></div>
            //         <div className='body'></div>
            //     </i>
            //     <div className='ico-add'></div>
            //     <input className='name' type="text" placeholder='爱拍号 | 手机号 | 邮箱' />
            //     <input className='pw' type="password" placeholder='密码' />
            //     <div className='register_yzm'>
            //         <input className='check' type="text" maxLength='4' placeholder='验证码'/>
            //         <img src={random} onClick={this.rechargeYZM}/>
            //     </div>
            //     <div className='login-set'>
            //         <input className='autologin' type="checkbox"/><span>自动登录</span><input className='remember' type="checkbox"/><span>记住密码</span>
            //         <a href="http://www.aipai.com/getpass.php" target="_blank" className='forget'>忘记密码?</a>
            //     </div>
            //     <div className='res-set'>
            //         <input type="checkbox"/><span>同意<a href="http://www.aipai.com/about/srv.html" target="_blank">《爱拍原创服务协议》</a></span>
            //     </div>
            //     <p className={'tip '+tip}>{tipTxt}</p>
            //     <div className='login_btn' onClick={this.login}>登录</div>
            //     <div className='register_btn' onClick={this.register}>注册</div>
            //     <div className='login-tip'><a href="" onClick={this.show.bind(null,'register')}>注册帐号</a></div>
            //     <div className='register-tip'><a href="" onClick={this.show.bind(null,'login')}>已注册过了？马上登录</a></div>
            // </section>
            // </section>
        );
    }
});

export default Login;