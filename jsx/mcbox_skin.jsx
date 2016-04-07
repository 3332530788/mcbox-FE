
import React from 'react';
import Login from './mcbox_login';
import MSP from '../lib/minimal';

//资源页导航栏
var SkinNav = React.createClass({
    render: function() {
        var click = this.props.click;
        return (
            <div className='rest_nav hd_res'>
                <ul>
                    {this.props.data.map(function (data,index) {
                        return (
                            <SkinNavli li={data} index={index} click={click}/>
                        );
                    })}
                </ul>
            </div>
        );
    }
});
var SkinNavli = React.createClass({
    render: function() {
        return (
            <li className={this.props.li.cur} onClick={this.props.click.bind(this,this.props.index,this.props.li['data-sort']) } >{this.props.li.title}</li>
        );
    }
});


//资源模块
var SkinMod = React.createClass({
    st:0,
    getInitialState: function() {
        return {
            limitty:'5',
            limitth:'0',
            theme:{5:[],6:[]},
            allSkin:[],
            mySkin:{5:[],6:[]},
            showMoreCls:'show',
            isLoading:false,
            userInfo:{
                curSkins:{
                    cape:{
                        id:-1
                    },
                    skin:{
                        id:-1
                    }
                }
            },
            path:userProfile.userExternJson().skinsPath,
            myCanvas:false,
            showSkin:{
                id:'',
                url:''
            },
            modPage:2,
            czPage:2,
            mapPage:2

        };
    },
    componentWillMount: function() {
        var that = this;
        that.loopAjax(1,null,null,()=>{
            this.initPage();
        });
        this.getMySkin();
    },
    getMySkin: function() {
        if (!userProfile.userProfileJson().bid) {
            return false;
        }
        var that = this,
            allSkin = this.state.allSkin;
            $.ajax({
                url: 'http://www.aipai.com/zuihuiwan/apps/mc.php?action=getFav&bid='+userProfile.userProfileJson().bid,
                dataType: 'jsonp',
                jsonpCallback: 'my_skin',
                success: function(data) {
                    if (data.code == 0) {
                        var favSkin = data.data.skins;
                        favSkin[5].forEach(function(i){
                            i.fav = 1;
                            let index = _.findIndex(allSkin, {'id': i.id});
                            if (index>=0) {
                                allSkin[index].fav = 1;
                            }
                        });
                        favSkin[6].forEach(function(i){
                            i.fav = 1;
                            let index = _.findIndex(allSkin, {'id': i.id});
                            if (index>=0) {
                                allSkin[index].fav = 1;
                            }
                        });
                        that.setState({mySkin:favSkin,allSkin:allSkin});
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                }.bind(this)
            });
        $.ajax({
                url: 'http://mcbox.aipai.com/api/skin.php?action=getSkin&bid='+userProfile.userProfileJson().bid,
                dataType: 'jsonp',
                jsonpCallback: 'my_curSkin',
                success: function(data) {
                    if (data.code == 0) {
                        that.setState({
                                path:userProfile.userExternJson().skinsPath,
                                userInfo: {
                                    curSkins:data.data
                                }
                        });
                        that.state.myCanvas.setPara({
                            skinURL:"file:///"+userProfile.userExternJson().skinsPath+'/'+data.data.skin.id+'.png'
                        });
                        that.state.myCanvas.setPara({
                            capeURL:"file:///"+userProfile.userExternJson().skinsPath+'/'+data.data.cape.id+'.png'
                        });
                    }
                }.bind(this),
                error: function(xhr, status, err) {
                }.bind(this)
        });
    },
    initAllFavSkin: function() {
        if (!userProfile.userProfileJson().bid) {
            return false;
        }
        var that = this,
            allSkin = this.state.allSkin;
        var favSkin = this.state.mySkin;
            favSkin[5].forEach(function(i){
                i.fav = 1;
                let index = _.findIndex(allSkin, {'id': i.id});
                if (index>=0) {
                    allSkin[index].fav = 1;
                }
            });
            favSkin[6].forEach(function(i){
                i.fav = 1;
                let index = _.findIndex(allSkin, {'id': i.id});
                if (index>=0) {
                    allSkin[index].fav = 1;
                }
            });
            that.setState({mySkin:favSkin,allSkin:allSkin});
    },
    loopAjax: function(p,type,theme,cb) {
        var _type = type || this.state.limitty,
            _theme = theme==0?theme:(theme || this.state.limitth);
        $.ajax({
            url: 'http://www.aipai.com/zuihuiwan/apps/mc_action-skins_type-'+_type+'_theme-'+_theme+'_page-'+p+'.html',
            dataType: 'jsonp',
            jsonpCallback: 'mc_skin',
            success: function(data) {
                if (data.code == -1) return;
                if (this.state.theme[5] == 0) {
                    this.setState({theme:data.data.theme});
                }
                this.setState({allSkin:data.data.skins[this.state.limitty],total:data.data.total},()=>{
                    this.initAllFavSkin();
                });
                cb?cb():0;
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },
    delallSkin:function(json){
        var userInfo = this.state.userInfo,
            userInfoObj = {};
        if (json.type == 6) {
            userInfo.curSkins.cape.id = json.id;
            userInfo.curSkins.cape.pic = json.pic;
            userInfo.curSkins.cape.picOri = json.picOri;
        }
        if (json.type == 5) {
            userInfo.curSkins.skin.id = json.id;
            userInfo.curSkins.skin.pic = json.pic;
            userInfo.curSkins.skin.picOri = json.picOri;
        }
        this.setState({userInfo:userInfo});
    },
    componentDidMount: function(){
        var that = this;
        resManager.installStatusChanged.connect(function(id,type,o,n) {
            if (n === 3) {
                if (type===5) {
                    that.state.myCanvas.setPara({
                        skinURL:"file:///"+that.state.path+'/'+id+'.png'
                    });
                } else if (type===6){
                    that.state.myCanvas.setPara({
                        capeURL:"file:///"+that.state.path+'/'+id+'.png'
                    });
                }
            }
        });
        this.initCanvas(this.state.userInfo);
    },
    initCanvas: function(info) {
        if(this.state.myCanvas) return false;
        var that = this,
            myMSP;
        myMSP = new MSP({
            skinURL: "file:///"+that.state.path+"/"+info.curSkins.skin.id+".png",
            capeURL: "file:///"+that.state.path+"/"+info.curSkins.cape.id+".png",
            distance: 35,
            canvasWidth: 324,
            canvasHeight: 290,
            container: $("#skinpreview")
        });
        that.setState({myCanvas:myMSP});
    },
    handleClickTy: function(index,sort) {
        //处理筛选类型
        mcAction.liCur($('.ty_list .skin_con'),index-1);
        //对应type 5 和 6
        if (this.state.theme[index+4].length>6){
            this.setState({showMoreCls:'show'});
        } else {
            this.setState({showMoreCls:'hidden'});
        }
        this.setState({limitty:sort},()=>{

        });
        $('.skin_more').hide();
        $('.ver_list .skin_con').eq(0).click();
    },
    handleClickVr: function(index,sort) {
        //处理筛选主题
        mcAction.liCur($('.ver_list .skin_con'),index);
        this.setState({limitth:sort},()=>{
            this.loopAjax(1,null,sort,()=>{
                this.initPage();
                this.initAllFavSkin();
            });
        });
        $('.skin_more').hide();
        $('.skin_con_more').removeClass('cur');
    },
    handleMoreTheme: function(type) {
        if (type == 'on') {
            clearTimeout(this.st);
            $('.skin_more').show();
            $('.skin_con_more').addClass('cur');
        } else {
            this.st = setTimeout(function () {
                $('.skin_more').hide();
                $('.skin_con_more').removeClass('cur');
            },100);
        }
    },
    handleFav: function(id,fav,type) {
        var allSkin = this.state.allSkin,
            mySkin = this.state.mySkin,
            index = _.findIndex(allSkin, {'id': id}),
            index2 = _.findIndex(mySkin[type], {'id': id});
            if (fav == 0) {
                allSkin[index].fav = 0;
                if (index2 != -1) {
                    mySkin[type].splice(index2,1);
                }
            } else {
                allSkin[index].fav = 1;
                if (index2 != -1) {
                    mySkin[type][index2].fav = 1;
                } else {
                    mySkin[type].push(allSkin[index]);
                }
            }
            this.setState({allSkin:allSkin,mySkin:mySkin});
    },
    clickskin: function (id,url,type,json) {
        resManager.installRes(id, type, json);
        $(".skins").removeClass('cur');
        $('.skin'+id).addClass('cur');
        this.setState({showSkin:json});
    },
    initPage: function() {
        var that = this,
            {videos,curSort} = this.props,
            pageCount = Math.ceil(that.state.total[that.state.limitty]/ 90);
        if (pageCount === 1) {
            $(".skin_box  .pagetab").html('');
        } else {
            $(".skin_box  .pagetab").html('');
            $(".skin_box  .pagetab").createPage({
                pageCount: pageCount,
                current: 1,
                backFn: function (p) {
                    $('.skin_box  .skinall').scrollTop('0');
                    that.loopAjax(p,that.state.limitty,that.state.limitth);
                }
            });
        }
    },
    showLogin: function(cb) {
        this.refs.login.show('login',cb);
    },
    render: function() {
        var clickvr = this.handleClickVr,
            clicktp = this.handleClickTy,
            clickskin = this.clickskin,
            clickmore = this.handleMoreTheme,
            toDetal = this.props.toDetal;
        return (
            <div className='bd_res'>
                <div className={"res_tabcon "+ this.props.show}>
                    <div className="rest_select select_con">
                        <div className="clearfix list ty_list">
                            <ul>
                                <li className="ti">类型：</li>
                                {this.props.data.skinlimittp.map(function (data,index) {
                                    return (
                                        <SkinLimitli li={data} index={index} click={clicktp}/>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="clearfix list ver_list">
                            <ul>
                                <li className="ti">主题：</li>
                                <li className="con skin_con cur" onClick={clickvr.bind(null,0,0)}>全部</li>
                                {this.state.theme[this.state.limitty].map(function (data,index) {
                                    if (index > 4) return false;
                                    return (
                                        <SkinLimitli li={data} index={index} click={clickvr}/>
                                    );
                                })}
                                <li className={"con skin_con_more "+ this.state.showMoreCls} onMouseOver={clickmore.bind(this,'on')} onMouseOut={clickmore.bind(this,'off')}>更多</li>
                                <div className='skin_more clearfix hidden' onMouseOver={clickmore.bind(this,'on')} onMouseOut={clickmore.bind(this,'off')} >
                                    {this.state.theme[this.state.limitty].map(function (data,index) {
                                        if (index <= 4) return false;
                                        return (
                                            <SkinLimitli li={data} index={index} click={clickvr}/>
                                        );
                                    })}
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div className="skin_box ">
                        < Login ref='login' successCallback={this.getMySkin} loginInit={this.props.loginInit} _wrap='.mc_skin'/>
                        <CanvasSkin click={this.clickskin} skin={this.state.showSkin} myCanvas={this.state.myCanvas} handleFav={this.handleFav} delallSkin={this.delallSkin} type={this.state.limitty}/>
                        <SkinAll skin={this.state.allSkin} clickskin={clickskin} type={this.state.limitty} info={this.state.userInfo} />
                        <SkinMy skin={this.state.mySkin[this.state.limitty]} clickskin={clickskin} type={this.state.limitty} info={this.state.userInfo}/>
                        <SkinUp />
                    </div>
                </div>
            </div>
        );
    }
});

var SkinLimitli = React.createClass({
    render: function() {
        return (
            <li className={this.props.li.id+" con skin_con "+this.props.li.cls} onClick={this.props.click.bind(this,this.props.index+1,this.props.li.id)}>{this.props.li.themeName}</li>
        );
    }
});

var SkinAll = React.createClass({
    render: function() {
        var clickskin = this.props.clickskin,
        info = this.props.info,
        page = this.props.page,
        that = this;
        if (!this.props.skin.map) {
            return false;
        }
        return (
            <div className="skinall">
                    {this.props.skin.map(function (data,index) {
                        return (
                            <Skin li={data} index={index} click={clickskin} info={info}/>
                        );
                    })}
                    <div className="pagetab">
                    </div>
            </div>
        )
    }
});
var SkinMy = React.createClass({
    render: function() {
        var clickskin = this.props.clickskin,
                info = this.props.info;
        return (
            <div className="skinmy">
                    {this.props.skin.map(function (data,index) {
                        return (
                            <Skin li={data} index={index} click={clickskin} info={info}/>
                        );
                    })}
            </div>
        )
    }
});
var SkinUp = React.createClass({
    render: function() {
        return (
            <div className="skinup">
                    <label for="name">名&nbsp;&nbsp;称</label>
                    <input type="text" name="name" value="" /><br/>
                    <label for="author">作&nbsp;&nbsp;者</label>
                    <input type="text" name="author" value="" /><br/>
                    <label for="uper">上传者</label>
                    <input type="text" name="uper" value="" /><br/>
                    <div className='pic_upload'>
                        <label for="file">图&nbsp;&nbsp;片</label>
                        <input className='pic_up' type="file" name="file" value="" />
                        <span className='pic_up_txt'>浏览</span>
                        <label className='pic_tip' for="file">尺寸 : 64*32</label>
                    </div>
                    <span className='upload_btn'>提交</span>
            </div>
        )
    }
});

var Skin = React.createClass({
    render: function() {
        var useCls = '';
        if (this.props.info.curSkins.cape && this.props.info.curSkins.skin) {
            if (this.props.li.id == this.props.info.curSkins.cape.id || this.props.li.id == this.props.info.curSkins.skin.id) {
                useCls = 'useSkinTxt';
            }
        }
        return (
            <div className={"skins s"+this.props.li.themeId+" skin"+this.props.li.id+" type"+this.props.li.type} onClick={this.props.click.bind(this,this.props.li.id,this.props.li.pic,this.props.li.type,this.props.li)}>
                <p className={useCls+" use"}></p>
                <img src={this.props.li.pic} />
                <p className="name">{this.props.li.name}</p>
                <span className={"fav"+this.props.li.fav}></span>
            </div>
        );
    }
});

var CanvasSkin = React.createClass({
    getInitialState: function() {
        return {
            actTxt:'跑步',
            favTxt:'收藏',
            favcls:'',
            isUseSkin: false,
            fav: 0
        };
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.skin.fav==1) {
            this.setState({favTxt:'取消收藏',favcls:'unfav_btn',fav:nextProps.skin.fav});
        } else {
            this.setState({favTxt:'收藏',favcls:'',fav:nextProps.skin.fav});
        }
    },
    useSkin: function() {
        if ($('.skins.cur').length ===0 || !userProfile.userProfileJson().bid || this.state.isUseSkin) return false;
        var that = this;
        this.setState({
            isUseSkin: true
        });
        setTimeout(() => {
            this.setState({
                isUseSkin: false
            });
        }, 5000);
        $.ajax({
            url: 'http://mcbox.aipai.com/api/skin.php?action=setSkin&bid='+userProfile.userProfileJson().bid+'&token='+userProfile.userExternJson().aptoken+'&skin='+that.props.skin.id+'&type='+that.props.skin.type,
            dataType: 'jsonp',
            jsonpCallback: 'mc_setskin',
            success: function(data) {
                if (data.code == -1) return;
                that.props.delallSkin(that.props.skin);
                this.setState({
                    isUseSkin: false
                });
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
        this.fav(false);
    },
    fav: function(skip) {
        var that = this;
        if (!userProfile.userProfileJson().bid) {
            return false;
        }
        if (this.state.fav == 1 && skip) {
            $.ajax({
                url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php?action=delFav&id='+that.props.skin.id,
                dataType: 'jsonp',
                jsonpCallback: 'mc_delfav',
                success: function(data) {
                    if (data.code == -1) return;
                    that.setState({favTxt:'收藏',favcls:'',fav:0});
                    that.props.handleFav(that.props.skin.id,0,that.props.type);
                }.bind(this),
                error: function(xhr, status, err) {
                }.bind(this)
            });
        } else {
            $.ajax({
                url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php?action=addFav&id='+that.props.skin.id,
                dataType: 'jsonp',
                jsonpCallback: 'mc_addfav',
                success: function(data) {
                    if (data.code == -1) return;
                    that.setState({favTxt:'取消收藏',favcls:'unfav_btn',fav:1});
                    that.props.handleFav(that.props.skin.id,1,that.props.type);
                }.bind(this),
                error: function(xhr, status, err) {
                }.bind(this)
            });
        }
    },
    act: function() {
        var skinAct = {
            isRunning:false
        };
        if (this.state.actTxt==='跑步') {
            this.setState({actTxt:'行走'});
            var skinAct = {
                isRunning:true
            };
        } else {
            this.setState({actTxt:'跑步'});
            var skinAct = {
                isRunning:false
            };
        }
        this.props.myCanvas.setPara(skinAct);
    },
    render: function() {
        return (
            <div id='skinpreview'>
                <div className='skin_btn'>
                    <span className={'fav_btn '+ this.state.favcls} onClick={this.fav.bind(this,true)} >{this.state.favTxt}</span>
                    <span className='act_btn' onClick={this.act}>{this.state.actTxt}</span>
                    <span className='use_btn' onClick={this.useSkin}>使用</span>
                </div>
            </div>
        )
    }
})

//资源tab模块
let SkinBox = React.createClass({
    srcMyObj:'',
    srcAllObj:'',
    getInitialState: function() {
        return {
            ret: [],
            myRet:[],
            data: staticData,
            showdetal:'hidden',
            show:'all',
            obj:{}
        };
    },
    handleClick: function(index,sort) {
        if (sort == 'my' && !userProfile.userProfileJson().bid) {
            this.refs.SkinMod.showLogin(function(){
                $('.mc_skin .rest_nav li').click();
            });
            return false;
        }
        //处理点击导航栏,切换不同tab
        mcAction.liCur($('.mc_skin .rest_nav li'),index);
        this.setState({show:sort});
    },
    render: function () {
        return (
            <section className = "mc_skin" >
                <SkinNav data={this.state.data.skinNav} click={this.handleClick} />
                <SkinMod ref='SkinMod' data={this.state.data}  show={this.state.show} loginInit={this.props.loginInit}/>
            </section>
        );
    }
});

export default SkinBox;