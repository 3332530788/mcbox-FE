import React from 'react';
import Login from './mcbox_login';

//服务器导航栏
var SevrNav = React.createClass({
    render: function() {
        var click = this.props.click,
            getTabClass = this.props.getTabClass,
            cls = 'hidden',
            btn = userProfile.joinServerBtnInfo() || {
                status: 0,
                link: 'http://aipai.com',
                text: '服主加盟'
            };
        if (btn.status == 0) {
            cls = 'show';
        }
        return (
            <nav className='sevr_nav'>
                <ul>
                    {this.props.data.map(function (data,index) {
                        return (
                            <li className={getTabClass(index)} onClick={click.bind(this,index,data['data-sort']) } ><a href="#">{data.title}</a></li>
                        );
                    })}
                </ul>
                <a href={btn.link} className={'fzjm_btn '+cls}>{btn.name}</a>
            </nav>
        );
    }
});

//启动中的样式
var SevrShadow = React.createClass({
    render: function() {
        return (
            <div className={'start_shadow '+this.props.show}>
                 <div className="load8">
                     <p className='txt'>启动中</p>
                     <div className="loader">Loading...</div>
                 </div>
                 <p className='progress_txt'>{this.props.txt}</p>
            </div>
        );
    }
});

var TipPop = React.createClass({
    render: function() {
        return (
            <div className={'tipShadow '+this.props.show}>
            <div className='tipPop'>
                <p className='title'>提示</p>
                <p className='content'>你确定要删除此服务器吗?</p>
                <span className='tip_btn_done' onClick={this.props.btn1}>删除</span><span className='tip_btn_cal' onClick={this.props.btn2}>取消</span>
            </div>
            </div>
        )
    }
})


//推荐服务器详情
var SevrDetal = React.createClass({
    getInitialState: function() {
        var vPic = 'css/img/s.png';
            if(this.props.obj.videoPic !== ''){
                vPic = this.props.obj.videoPic;
            }
        return {
            vPic  : vPic,
            online: '获取异常'
        }
    },
    componentWillReceiveProps: function(nextProps) {
        var newObj;
        if(!!nextProps.obj.id && !!nextProps.obj.address) {
            mcAction.checkServerStatus(nextProps.obj.id,nextProps.obj.address);
            newObj = serverChecker.serverState(nextProps.obj.id);
        }
        if (!!newObj && newObj.code === 0) {
            this.setState({online:newObj.online});
        } else {
            this.setState({online:"获取异常"});
        }
    },
    render: function() {
        return (
            <div className={"sevr_detal "+this.props.showdetal}>
                <h1>
                    <p onClick={this.props.hiddenDetal}>
                        <i className='arrow'></i>
                        <span>返回</span>
                    </p>
                </h1>
                <div className="detal_info">
                    <p>
                        游戏类型 : {this.props.obj.gametype}
                    </p>
                    <p>
                        游戏版本 : {this.props.obj.ver}
                    </p>
                    <p>
                        在线人数 : {this.state.online}
                    </p>
                    <p>
                        网络 : {this.props.obj.network}
                    </p>
                </div>
                <div className="sevr_detal_body game_pic">
                    <img src={this.props.obj.pic} alt="" />
                </div>
                <div className="sevr_detal_video">
                    <a href={this.props.obj.video || 'javascript:void(0)'}>
                        <img src={this.props.obj.videoPic || 'css/img/s.png'} alt="" />
                        <span>12:00</span>
                    </a>
                    <div className="video_info">
                        <p>
                            {this.props.obj.name}
                        </p>
                        <p>
                            {this.props.obj.detail}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
});

//服务器游戏列表
var SevrGameBox = React.createClass({
    getInitialState: function() {
        return {
            allRet: [],
            modRet: [],
            myRet:[],
            pureRet:[],
            redManRet:[],
            debug:boxEnv.isDebugMode(),
            reflash:''
        }
    },
    showLogin: function(cb) {
        this.refs.login.show('login',cb);
    },
    componentWillMount: function() {
        var that = this;
        //请求服务器数据
        ajaxAllserver();
        ajaxModserver();
        ajaxMyserver();
        ajaxPureserver();
        ajaxRedManserver();
        function ajaxAllserver() {
            $.ajax({
                url: 'https://dl.aipai.com/zuihuiwan/apps/mc_action-allServer.html',
                dataType: 'jsonp',
                jsonpCallback: 'mc_allserver',
                cache: true,
                success: function(data) {
                    if (data.code == -1) return;
                    that.setState({allRet: data.server});
                    that.props.initSele(data);
                }.bind(this),
                error: function(xhr, status, err) {
                    ajaxAllserver();
                }.bind(this)
            });
        }
        function ajaxModserver() {
            $.ajax({
                url: 'https://dl.aipai.com/zuihuiwan/apps/mc_action-allServer_type-64.html',
                dataType: 'jsonp',
                jsonpCallback: 'mc_modeserver',
                success: function(data) {
                    if (data.code == -1) return;
                    that.setState({modRet: data.server});
                    that.props.initSele(data);
                }.bind(this),
                error: function(xhr, status, err) {
                    ajaxModserver();
                }.bind(this)
            });
        }
        function ajaxPureserver() {
            $.ajax({
                url: 'https://dl.aipai.com/zuihuiwan/apps/mc_action-allServer_type-64.html',
                dataType: 'jsonp',
                jsonpCallback: 'mc_pureserver',
                success: function(data) {
                    if (data.code == -1) return;
                    that.setState({pureRet: data.server});
                    that.props.initSele(data);
                }.bind(this),
                error: function(xhr, status, err) {
                    ajaxPureserver();
                }.bind(this)
            });
        }
        function ajaxRedManserver(){
            $.ajax({
                url:'https://dl.aipai.com/zuihuiwan/apps/mc_action-allServer_type-64.html',
                dataType:'jsonp',
                jsonpCallback:'mc_redManserver',
                success: function(data) {
                    if (data.code == -1) return;
                    that.setState({redManRet:data.server});
                    that.props.initSele(data);
                }.bind(this),
                error: function(xhr,status,err){
                    ajaxRedManserver();
                }.bind(this)
            })
        }
        function ajaxMyserver() {
            $.ajax({
                url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php?action=myServers&bid='+userProfile.userProfileJson().bid+'',
                dataType: 'jsonp',
                jsonpCallback: 'mc_myserver',
                success: function(data) {
                    if (data.code == -1) return;
                    that.setState({myRet: data.data});
                    that.props.getAddress(data.data);
                }.bind(this),
                error: function(xhr, status, err) {
                    ajaxMyserver();
                }.bind(this)
            });
        }
    },
    ajaxMyserver: function() {
        $.ajax({
                url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php?action=myServers&bid='+userProfile.userProfileJson().bid,
                dataType: 'jsonp',
                jsonpCallback: 'mc_myserver',
                success: (data)=> {
                    if (data.code == -1) return;
                    this.setState({myRet: data.data});
                    this.props.getAddress(data.data);
                },
                error: (xhr, status, err)=> {
                    ajaxMyserver();
                }
            });
    },
    delMyserver: function(id) {
        var that = this;
        console.log(id,2233123123);
        $.ajax({
            url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php?action=delServer&serverId='+id,
            dataType: 'jsonp',
            jsonpCallback: 'mc_delserver',
            success: function(data) {
                console.log(44444);
                if (data.code == -1) {return};
                console.log(3333,data);
                setTimeout(() => {
                    $.ajax({
                        url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php?action=myServers&bid='+userProfile.userProfileJson().bid,
                        dataType: 'jsonp',
                        jsonpCallback: 'mc_myserver',
                        success: function(data) {
                            console.log(data,1111);
                            if (data.code == -1) data.data=[];
                            console.log(22);
                            that.setState({myRet: data.data});
                        }.bind(this),
                        error: function(xhr, status, err) {
                            console.log(err,111323);
                            ajaxMyserver();
                        }.bind(this)
                    });
                }, 1000);
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },
    render: function () {
        var that = this,
            toDetal = this.props.toDetal,
            funhandleStart = this.props.handleStart;
        var hotgame = this.state.allRet.map(function (data) {
                if (data.status == 1 ||(!that.state.debug&&data.status == 2)) return;
                return (
                    <SevrGame data={data} toDetal={toDetal} />
                );
            }),
            puregame = this.state.pureRet.map(function(data,index){
                if(data.status == 1 || (!that.state.debug && data.status == 2)) return;
                return (
                    <SevrGame data={data} toDetal={toDetal} />
                )
            }),
            modgame = this.state.modRet.map(function (data) {
                    if (data.status == 1 ||(!that.state.debug&&data.status == 2)) return;
                    return (
                        <SevrGame data={data} toDetal={toDetal} />
                    );
            }),
            redMangame = this.state.redManRet.map(function(data,index){
                if(data.status == 1 || (!that.state.debug && data.status == 2)) return;
                return (
                    <SevrGame data={data} toDetal={toDetal} />
                )
            }),
            mygame = this.state.myRet.map(function (data,index) {
                if (data.status == 1 ||(!that.state.debug&&data.status == 2)) return;
                return (
                    <MyGame data={data} index={index}  handleStart={funhandleStart} delMyserver={that.delMyserver}/>
                );
            });
        return (
            <div className = {"sevr_body "+this.props.show} >
                < Login ref='login' successCallback={this.ajaxMyserver} />
                < HotSeverGame />
                <div className='pure_sevr' >{puregame}</div>
                <div className='mod_sevr' >{modgame}</div>
                <div className='redMan_sevr' >{redMangame}</div>
                <div className='my_sevr' >{mygame}</div>
            </div >
        );
    }
});
// 推荐服务器
var HotSeverGame = React.createClass({
    render:function(){

        return (
            <div className="hot_sevr" >
                <h3 className="hot_title">官方小游戏服</h3>
                <div className="hot_info">
                    <h4>游戏嘉年华</h4>
                    <p>MC最会玩推出的小游戏服，内含饥饿游戏、起床游戏、战桥、 空岛战争、速建各类游戏玩法！等什么？来战斗吧！</p>
                    <div className="hot_tips">
                        <span>官方</span>
                    </div>
                </div>
                <div className="hot_inner">
                    < SubHotSevr />
                    < SubHotSevr />
                    < SubHotSevr />
                    < SubHotSevr />
                </div>
            </div>
        )
    }
})
var SubHotSevr = React.createClass({
    render:function(){
        return (
            <div className="sevr">
                <h3>热门服推荐：</h3>
                <div className="hot_sevr_btn"><span>游戏服2游戏服2.1</span></div>
                <div className="hot_sevr_btn"><span>游戏服2.1</span></div>
            </div>
        )
    }
})
//服务器
var SevrGame = React.createClass({
    render: function() {
        return (
            <div className='sevr_game ' onClick={this.props.toDetal.bind(this,this.props.data)}>
                <div className={'tag '+this.props.data.tag}><img src={this.props.data.vpic} alt="pic" /></div>
                <p className='name'>
                    {this.props.data.name}
                </p>
                {/* <p className='link'>
                     {this.props.data.network}
                 </p> */}
            </div>
        );
    }
});


var McSideSelet = React.createClass({
    getInitialState: function() {
        return {
            links: '',
            nowlink:''
            // show:'hidden'
        };
    },
    componentWillMount: function() {
        var links = [],nowlink={};
        _.forIn(this.props.data.address, function(val, key) {
            links.push({name:key,url:val});
        });
        nowlink = {
            name:links[0].name,
            url:links[0].url
        };
        this.props.setMyUrl(links[0].url);
        this.setState({links:links,nowlink:nowlink});
    },
    handleClick: function(li,index) {
        //处理下拉列表的闭合 与 填写
        mcAction.showOnly($('.mylink_list'),this.props.index);
        window.localStorage.serverSele=this.props.data.name;
        window.localStorage.serverSeleId=this.props.data.id;
        window.localStorage.linksSele=li.name;
        window.localStorage.urlSele=li.url;
        nowlink = {
            name:li.name,
            url:li.url
        };
        this.props.setMyUrl(li.url);
        this.setState({nowlink:nowlink});
    },
    seleSevr: function(e) {
        setTimeout(() => {
            mcAction.showOnly($('.mylink_list'),this.props.index);
        }, 100);
        return false;
    },
    render: function() {
        var that = this;
        return (
            <dl className='item_mylink' style={this.props.offline} >
                <dt className='tit_mylink' onClick={this.seleSevr}><span >{this.state.nowlink.name}</span></dt>
                <dd className={'mylink_list hidden'} >
                    <ul>
                        {this.state.links.map(function (data,index) {
                            return (
                                < McSideSeletli li={data} click={that.handleClick} index={index} />
                            );
                        })}
                    </ul>
                </dd>
            </dl>
        );
    }
});
var McSideSeletli = React.createClass({
    render: function() {
        return (
            < li onClick={this.props.click.bind(this,this.props.li,this.props.index)} >{this.props.li.name}</li>
        );
    }
});


var McSideSetting = React.createClass({
    seleSetting: function(e) {
        setTimeout(() => {
            mcAction.showOnly($('.setting_list'),this.props.index);
        }, 100);
        return false;
    },
    render: function() {
        return (
            <dl className='item_setting' >
                <dt onClick={this.seleSetting} ><i className='set_btn'></i></dt>
                <dd className={'setting_list hidden'} >
                    <ul>
                        <li className="set_del" onClick={this.props.onSet} >资源配置</li>
                        <li className="set_del" onClick={this.props.onDel} >删除服务器</li>
                    </ul>
                </dd>
            </dl>
        );
    }
});

//我的服务器
var MyGame = React.createClass({
    getInitialState: function() {
        return {
            status:{},
            nowlinkUrl:'',
            show:'hidden'
        };
    },
    componentDidMount: function() {
        mcAction.checkServerStatus(this.props.data.id,this.props.data.address);
        // var newStatus = mcAction.changeStatus("l3ve");
    },
    componentWillReceiveProps: function(nextProps) {
        var newObj;
            newObj = serverChecker.serverState(nextProps.data.id);
            this.setState({status:newObj});
    },
    setMyUrl: function(url) {
        this.setState({nowlinkUrl:url});
    },
    onTipDel: function() {
        this.setState({show:"show"});
    },
    onHiddenTip: function() {
        this.setState({show:'hidden'});
    },
    delMyserver: function() {
        this.props.delMyserver(this.props.data.id);
        this.setState({show:'hidden'});
    },
    onSetting: function() {
        instManager.showResourceConfigWnd(this.props.data.id,this.props.data);
    },
    render: function() {
        return (
            <div className='mysevr_game'>
                <TipPop  show={this.state.show} btn1={this.delMyserver} btn2={this.onHiddenTip} />
                <div className="game_pic" >
                    <img className='my_sevr_cover' src={this.props.data.cover} alt="game" />
                    <div className='start_btn' onClick={this.props.handleStart.bind(this,this.props.data,this.state.nowlinkUrl,false)}></div>
                    <i className={"capacity light"+this.state.status.lag}>{this.state.status.online}/{this.state.status.max}</i>
                </div>
                <span className='name'>
                    {this.props.data.name}
                </span>
                <span className='link'>
                    {this.props.data.network}
                </span>
                <span className='set_and_close'>
                    <McSideSelet data={this.props.data} index={this.props.index} setMyUrl={this.setMyUrl}/>
                    <McSideSetting onDel={this.onTipDel} onSet={this.onSetting} index={this.props.index} />
                </span>
            </div>
        );
    }
});


//服务器tab模块
let SevrBox = React.createClass({
    getInitialState: function() {
        return {
            show:'hot',
            showdetal:'hidden',
            showshadow:'hidden',
            newStatus:[],
            proTxt:'初始',
            text:'',
            obj:{},
            curIndex:0
        };
    },
    componentWillMount: function() {
        //获取客户端默认数据
        this.setState({data: staticData});
        this.props.setStart(this.handleStart);
        //监听客户端数据变化
        mcAction.litenInstance(this.onChangeTxtOninstance,this.onChangeStatus,this.onHideenShadow);
    },
    onChangeTxtOninstance: function(id,state) {
        //改变游戏的进度提示(文字)
        this.setState({proTxt:state});
    },
    onChangeStatus: function(id) {
        //监听客户端的数据更新
        this.setState({text:true});
    },
    onHideenShadow: function(id) {
        //取消 启动游戏中 的效果
        // this.setState({showshadow:'hidden'});
        // $('.btn_start').removeClass('btn_starting');
    },
    handleStart: function(obj,link,skip) {
        var arr = [];
        if (!userProfile.userProfileJson().bid || skip) {
            this.refs.SevrGameBox.showLogin(()=>{});
            return false;
        }
        if (!obj) {
            return false;
        }
        //启动游戏
        instManager.startInstance(obj.id,obj,link);
        _.forIn(obj.address, function(val, key) {
            arr.push({name:key,url:val});
        });
        window.localStorage.serverSele = obj.name;
        window.localStorage.serverSeleId = obj.id;
        window.localStorage.linksSele=arr[0].name;
        window.localStorage.urlSele=arr[0].url;
        $.ajax({
            url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php?action=addServer&serverId='+obj.id,
            dataType: 'jsonp',
            jsonpCallback: 'mc_addserver',
            success: function(data) {
                setTimeout(() => {
                    this.refs.SevrGameBox.ajaxMyserver();
                }, 1000);
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
        // $('.btn_start').addClass('btn_starting');
    },
    getTabClass:function(index){
        // 判断点击的选项卡下标是否与编号相同
        return index === this.state.curIndex ? "cur" :"";
    },
    handleClick: function(index,sort) {
        var that = this;
        if (sort == 'my' && !userProfile.userProfileJson().bid) {
            this.refs.SevrGameBox.showLogin(() => {
                that.setState({
                    show:sort,
                    curIndex:index
                });
            });
            return false;
        }
        //处理tab切换
        //mcAction.liCur($('.sevr_nav li'),index);
        this.setState({
            show:sort,
            curIndex:index
        });
    },
    toDetal: function(obj) {
        //切换到服务器详情页
        this.setState({showdetal:'show'});
        this.setState({obj:obj});
        this.props.linkSele(obj,true);
        setTimeout(() => {
            this.props.getAddress(obj,'add');
        }, 1000);
    },
    onHiddenDetal: function() {
        //隐藏服务器详情页
        this.setState({showdetal:'hidden'});
    },
    render: function () {
        return (
            <section className = "mc_server" >
                < SevrShadow show={this.state.showshadow} txt={this.state.proTxt} />
                < SevrDetal showdetal={this.state.showdetal} hiddenDetal={this.onHiddenDetal} obj={this.state.obj} />
                < SevrNav data={this.state.data.sevrNav} click={this.handleClick} getTabClass={this.getTabClass}/>
                < SevrGameBox ref='SevrGameBox' show={this.state.show} toDetal={this.toDetal} handleStart={this.handleStart} getAddress={this.props.getAddress} initSele={this.props.initSele}/>
            </section>
        );
    }
});

export default SevrBox;