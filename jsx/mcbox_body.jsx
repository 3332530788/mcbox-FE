import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RecomBox from './mcbox_recommend';
import ResourceBox from './mcbox_resource';
import VideoBox from './mcbox_video';
import SevrBox from './mcbox_server';
import SkinBox from './mcbox_skin';
import Login from './mcbox_login';

//主体的导航栏
var McNav = React.createClass({
    render: function() {
        var {click, curIndex} = this.props;
        return (
            <section className='mc_foot'>
                <nav className='foot_list'>
                    <ul>
                        {this.props.data.map(function(data, index) {
                            let _cur = '';
                            if (curIndex == index) {
                                _cur = 'cur'
                            }
                            return (
                                <li className={_cur + ' ' + data['data-sort']} onClick={click.bind(this, index, data['data-sort']) } ><a href="#"><span>{data.title}</span></a></li>
                            );
                        }) }
                    </ul>
                </nav>
            </section>
        );
    }
});


//Body的tab主体
var McMain = React.createClass({
    getInitialState: function() {
        return {
            show: 'recommend',
            curIndex: 0
            // show:'src'
        };
    },
    componentDidMount: function() {
        this.props.setStart(false, this.handleClick);
    },
    handleClick: function(index, sort) {
        //处理底部tab的切换与显示
        // mcAction.liCur($('.foot_list li'),index);
        this.setState({ show: sort, curIndex: index });
    },
    render: function() {
        let {
            getAddress,
            linkSele,
            initSele,
            setStart,
            data
        } = this.props,
            {
                show,
                curIndex
            } = this.state,
            _body = '';

        switch (show) {
            case 'recommend':
                _body = < RecomBox />;
                break;
            case 'sevr':
                _body = '';
                break;
            case 'src':
                _body = < ResourceBox />;
                break;
            case 'skin':
                _body = < SkinBox />;
                break;
            case 'video':
                _body = < VideoBox />;
                break;
            default:
                _body = < RecomBox />;
                break;
        }

        return (
            <div className={'mc_main ' + show}>
                {_body}
                < SevrBox getAddress={getAddress} linkSele={linkSele} initSele={initSele}  setStart={setStart}/>
                < McNav data={data.nav} curIndex={curIndex} click ={this.handleClick} />
            </div>
        );
    }
});


var McSideSelet = React.createClass({
    //是否为单机模式
    bOffline: false,
    getInitialState: function() {
        return {
            sele: window.localStorage.serverSele,
            show: 'hidden',
            url: this.props.url,
            id: this.props.data.id
        };
    },
    handleClick: function(li, index) {
        //处理下拉列表的闭合 与 填写
        mcAction.showOnly($('.server_list'), this.props.index);
        if (this.props.index === '0') {
            this.props.linkSele(li);
        } else if (this.props.index === '1') {
            window.localStorage.linksSele = li.name;
            window.localStorage.urlSele = li.url;
        }
        this.setState({ sele: li.name, url: li.url });
    },
    seleSevr: function(e) {
        //判断是否单机模式,来触发下拉列表
        if (!this.bOffline) {
            setTimeout(() => {
                mcAction.showOnly($('.server_list'), this.props.index);
            }, 100);
        }
        //返回 false 阻止冒泡
        // e.nativeEvent.stopPropagation();
        // return false;
    },
    componentWillUpdate: function(nextProps, nextState) {
        //判断是否为单机模式
        if (nextProps.offline.opacity === 0.1) {
            this.bOffline = true;
        } else {
            this.bOffline = false;
        }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({ sele: nextProps.seleServer, url: nextProps.url, id: nextProps.data.id });
    },
    render: function() {
        var that = this;
        return (
            <dl className='item' style={this.props.offline} >
                <dt className='tit sver_sele' data-url={this.state.url} data-id={this.state.id}><span onClick={this.seleSevr} >{this.state.sele}</span></dt>
                <dd className={'server_list hidden'} >
                    <ul>
                        {this.props.data.map(function(data, index) {
                            return (
                                < McSideSeletli li={data} click={that.handleClick} index={index} />
                            );
                        }) }
                    </ul>
                </dd>
            </dl>
        );
    }
});
var McSideSeletli = React.createClass({
    render: function() {
        return (
            < li onClick={this.props.click.bind(this, this.props.li, this.props.index) } >{this.props.li.name}</li>
        );
    }
});

//Body的边侧栏(个人info)
var McSide = React.createClass({
    getInitialState: function() {
        return {
            data: [],
            user: {
                big: './css/img/default_avatar.png'
            },
            isLogin: 'show',
            nowObj: false,
            offline: {
                opacity: 1
            }
        };
    },
    componentWillMount: function() {
        if (userProfile.userProfileJson().big) {
            this.setState({ user: userProfile.userProfileJson() });
        }
    },
    loginInit: function() {
        this.setState({
            user: userProfile.userProfileJson(),
            isLogin: "hidden"
        });
    },
    componentWillReceiveProps: function(nextProps) {
        setTimeout(() => {
            let nowObj,
                _name = $('.server_con .sver_sele span').eq(0).html();
            nowObj = nextProps.data[_.findIndex(nextProps.data, { 'name': _name })];
            this.setState({ nowObj: nowObj });
        }, 200);
    },
    handleClick: function(index) {
        //判断是否为多人或者单机模式 传值offline
        mcAction.liCur($('.side_foot .type li'), index);
        if (index === 0) {
            this.setState({ offline: { opacity: 0.1 } });
        } else {
            this.setState({ offline: { opacity: 1 } });
        }
        //闭合所有下拉
        mcAction.hiddenAll($('.server_list'));
    },
    logOut: function() {
        //通知客户端登出
        loginHost.LogOut();
    },
    login: function() {
        if (!userProfile.userProfileJson().bid) {
            console.log(123);
            this.refs.login.show('index');
            return false;
        }
    },
    handleStart: function(obj) {
        //启动游戏;
        var link = $('.sver_sele').eq(1).attr('data-url');
        this.props.setStart(obj, link);
        this.props.showsrc('1', 'sevr');
    },
    render: function() {
        var that = this;
        return (
            <div className='mc_side'>
                < Login ref='login' successCallback={this.loginInit} type='index' />
                <div className="user_info">
                    <div className="pic"><img src={this.state.user.big} width="66" height="66" alt="" /></div>
                    <div className="info">
                        <p><a className="user_name" href="#">{this.state.user.nickname}</a></p>
                    </div>
                    <div onClick={()=>this.login()} className={'loginBtn ' + this.state.isLogin}>
                        登录
                    </div>
                </div>
                <div className="side_foot">
                    <div className="type clearfix">
                        <ul>
                            <li className='hidden' onClick={this.handleClick.bind(this, 0) } >单机</li>
                            <li className="cur" onClick={this.handleClick.bind(this, 1) } >多人</li>
                        </ul>
                    </div>
                    <div className="server_con">
                        < McSideSelet data={this.props.data} offline={that.state.offline} linkSele={this.props.linkSele} index= '0'  seleServer={this.props.seleServer[0]}/>
                        < McSideSelet data={this.props.links} offline={that.state.offline} index= '1' seleServer={this.props.seleServer[1]} url={this.props.seleServer[2]}/>
                    </div>
                    <a className="btn_start" onClick={this.handleStart.bind(this, this.state.nowObj) } href="#">启动</a>
                </div>
            </div>
        );
    }
});

//MC盒子主体
window.McBody = React.createClass({
    getInitialState: function() {
        return {
            data: staticData,
            address: [],
            links: [],
            setStart: function() { },
            showsrc: function() { },
            seleServer: [window.localStorage.serverSele, window.localStorage.linksSele, window.localStorage.urlSele, window.localStorage.serverSeleId],
            stt: ''
        };
    },
    componentDidMount: function() {
        loginHost.logouted.connect(() => {
            window.location.reload()
        });
        //自动登录
        // let _lastu = loginInfoHelper.getHistoricalLoginUserList().lastLoginUser,
        //     _listu = loginInfoHelper.getHistoricalLoginUserList().userInfos,
        //     _index = _.findIndex(_listu, {
        //         userName: _lastu,
        //         loginInfo: {
        //             autoLogin: true
        //         }
        //     });
        // if (_index >= 0) {
        //     loginHost.LogIn(_listu[_index].userName, true, true, 'aipaiAutoPw');
        // }
    },
    initSele: function(serverObj) {
        var index = 0;
        index = _.findIndex(serverObj.server, { 'name': window.localStorage.serverSele });
        this.linkSele(serverObj.server[index]);
    },
    hiddenAll: function(e) {
        //闭合所有下拉
        mcAction.hiddenAll($('.server_list'));
        mcAction.hiddenAll($('.mylink_list'));
        mcAction.hiddenAll($('.setting_list'));
    },
    onGetaddress: function(mySver, type) {
        let {address} = this.state,
            _address = [];
        if (type == 'add') {
            mySver = [mySver];
        }
        _address = _.unionWith(address, mySver, _.isEqual);
        this.setState({
            address: _address
        });
    },
    setStart: function(callback, showsrc) {
        callback ? this.setState({ setStart: callback }) : "";
        showsrc ? this.setState({ showsrc: showsrc }) : "";
    },
    linkSele: function(links, skip) {
        var arr = [];
        if (!links) {
            return;
        }
        _.forIn(links.address, function(val, key) {
            arr.push({ name: key, url: val });
        });
        $('.sver_sele').eq(1).attr("data-url", arr[0].url);
        this.setState({ links: arr, seleServer: [links.name, arr[0].name, arr[0].url, links.id] });
        if (!skip) {
            window.localStorage.serverSele = links.name;
            window.localStorage.serverSeleId = links.id;
            window.localStorage.linksSele = arr[0].name;
            window.localStorage.urlSele = arr[0].url;
        }
    },
    loginInit: function() {
        this.refs.McSide.loginInit();
    },
    render: function() {
        return (
            <div className = "container" onClick={this.hiddenAll}>
                < McMain data={this.state.data} getAddress={this.onGetaddress} linkSele={this.linkSele} initSele={this.initSele} setStart={this.setStart} loginInit={this.loginInit}/>
                < McSide ref='McSide' data={this.state.address} tempSer={this.state.tempSer} links={this.state.links} linkSele={this.linkSele} seleServer={this.state.seleServer} setStart={this.state.setStart} showsrc={this.state.showsrc}/>
            </div>
        );
    }
});
ReactDOM.render(
    <McBody />,
    document.getElementById('warpper')
);