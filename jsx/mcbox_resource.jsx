import React from 'react';

//资源页导航栏
var SrcNav = React.createClass({
    render: function() {
        var click = this.props.click;
        return (
            <div className='rest_nav hd_res'>
                <ul>
                    {this.props.data.map(function (data,index) {
                        return (
                            <SrcNavli li={data} index={index} click={click}/>
                        );
                    })}
                </ul>
            </div>
        );
    }
});
var SrcNavli = React.createClass({
    render: function() {
        return (
            <li className={this.props.li.cur} onClick={this.props.click.bind(this,this.props.index,this.props.li['data-sort']) } >{this.props.li.title}</li>
        );
    }
});

var TipPop = React.createClass({
    getInitialState: function() {
        return {
            show: 'hidden',
            txt: '内容',
            btnTxt: '确定',
            celTxt: '取消',
            btnCb: function(){},
            celCb: function(){}
        }
    },
    show: function(para) {
        this.setState({
            show: 'show',
            txt: para.txt,
            btnCb: para.btnCb || function(){},
            celCb: para.celCb || function(){},
            btnTxt: para.btnTxt || "确定",
            celTxt: para.celTxt || "取消"
        });
    },
    hidden: function() {
        this.setState({
            show: 'hidden'
        });
        this.state.celCb();
    },
    firstBtn: function() {
        this.state.btnCb();
         this.setState({
            show: 'hidden'
        });
    },
    render: function() {
        return (
            <div className={'tipShadow '+this.state.show}>
            <div className='tipPop'>
                <p className='title'>提示</p>
                <p className='content'>{this.state.txt}</p>
                <span className='tip_btn_done' onClick={this.firstBtn}>{this.state.btnTxt}</span><span className='tip_btn_cal' onClick={this.hidden}>{this.state.celTxt}</span>
            </div>
            </div>
        )
    }
})



//资源详情
var SrcDetal = React.createClass({
    body:'',
    getInitialState: function() {
        return {
            status: '2',
            progress:'0%',
            show:'hidden',
            cln:'detail_pause'
        }
    },
    componentWillMount: function() {
        this.body = <div className='done_tit'>{this.props.obj.name}</div>;
    },
    componentWillReceiveProps: function(nextProps) {
        var Style = {
                width:nextProps.obj.progress
            };
        this.setState({status:nextProps.obj.srcState});
        this.setState({progress:nextProps.obj.progress});
        switch(nextProps.obj.srcState) {
            case '5' ://可下载状态  4:错误状态   2:下载中   0:暂停
            this.body = <div className='done_tit'>{nextProps.obj.name}</div>;
            this.setState({cln:'detail_dow'});
            break;
            case '3' ://完成
            this.body = <div className='done_tit'>{nextProps.obj.name}</div>;
            this.setState({cln:'detail_del',progress:nextProps.obj.name});
            break;
            case '2' ://下载中
            this.body = <div className='progress'><span className="rate" style={Style}></span><span className="done" >{nextProps.obj.progress}</span></div>;
            this.setState({cln:'detail_pause'});
            break;
            case '0' ://暂停
            this.body = <div className='progress'><span className="rate" style={Style}></span><span className="done" >{nextProps.obj.progress}</span></div>;
            this.setState({cln:'detail_dow'});
            break;
        };
    },
    handleClick: function(type) {
        switch(type) {
            case 'detail_dow' ://可下载状态
            this.downLoad();
            break;
            case 'detail_pause' ://暂停
            mcAction.stopDownloadSrc(this.props.obj.id,this.props.obj.type);
            break;
            case 'detail_del' ://完成
            this.onTipDel();
            break;
        };
    },
    downLoad: function() {
        //通知原生触发下载
        mcAction.downloadSrc(this.props.obj.id,this.props.obj.type,this.props.obj,this.props.ismy);
        this.setState({status:"2"});
    },
    delete: function() {
        let delObj = {
            values: []
        };
        delObj.values.push({
            id: this.props.obj.id,
            type: this.props.obj.type
        });
        mcAction.delSrc(delObj);
    },
    onTipDel: function() {
        var that = this;
        this.refs.tip.show({
            txt: '确定要删除所选资源',
            btnCb: that.delete
        });
    },
    render: function() {
        var type ='',
            des = '';
        switch(this.props.obj.type) {
            case '1' :
            type = "MOD";
            break;
            case '2' :
            type = "存档";
            break;
            case '3' :
            type = "材质";
            break;
        };
        return (
            <div className={"src_detal "+this.props.showdetal}>
                <TipPop ref='tip' />
                <h1>
                    <p onClick={this.props.hiddenDetal}>
                        <i className='arrow'></i>
                        <span>返回</span>
                    </p>
                </h1>
                <div className="src_detal_head">
                    <img src='css/img/src_detail_head.png'/>
                    <span className={"detail_btn "+this.state.cln} onClick={this.handleClick.bind(this,this.state.cln)}></span>
                    {this.body}
                </div>
                <div className="detal_info">
                    <p><span className='tit'>类型 : </span><span>{type}</span></p>
                    <p><span className='tit'>适用版本 : </span><span>{this.props.obj.mcver}</span></p>
                    <p><span className='tit'>描述 : </span><span>{this.props.obj.description}</span></p>
                </div>
            </div>

        );
    }
});

//资源列表
var Srclist = React.createClass({
    initPage: function(nprops) {
        var {fetch,pageTotal} = nprops;
        if (nprops.show === 'my') {
            pageTotal = nprops.myRet.length;
        }
        if (pageTotal <= 90) {
            $(".down_con .pagetab").hide();
        } else {
            $(".down_con .pagetab").show().createPage({
                pageCount: Math.ceil(pageTotal/ 90),
                current: 1,
                backFn: function (p) {
                    fetch(p);
                }
            });
        }
    },
    componentWillReceiveProps:function (nextProps) {
        if (this.props.curType != nextProps.curType || this.props.limit != nextProps.limit || this.props.show != nextProps.show) {
            this.initPage(nextProps);
        }
    },
    render: function () {
        var {toDetal,itemCls,seleDel} = this.props,
            that = this,
            all = this.props.ret.map(function (data) {
                return (
                    <Src data={data} ismy={false} toDetal={toDetal} itemCls={itemCls}/>
                );
            }),
            my = this.props.myRet.map(function (data) {
                return (
                    <Src data={data} ismy={true} toDetal={toDetal} itemCls={itemCls} seleDel={seleDel}/>
                );
            });
        return (
            <div className={"clearfix down_con "+this.props.show }>
                <div className="all_src">{all}</div>
                <div className="my_src" >{my}</div>
                <div className="pagetab">
                </div>
            </div>
        );
    }
});
//资源
var Src = React.createClass({
    body: '',
    st: '',
    getInitialState: function() {
        return {
            status:'2',
            progress:this.props.data.progress,
            cln:''
        };
    },
    componentWillMount: function() {
        this.setState({status:this.props.data.srcState,progress:this.props.data.progress});
        switch(this.props.data.srcState) {
            case '5' ://初始可下载状态
            this.body =
                <span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} >
                    <dt className="tit">{this.props.data.name}</dt>
                    <dd className="con">
                        <p className="tip">{this.props.data.mcver}</p>
                    </dd>
                    <a className="btn_down" href="#"><span className='detail' onClick={this.props.toDetal.bind(this,this.props.data)}></span><span className='down' onClick={this.downLoad.bind(this,this.props.data.id,this.props.data.type,this.props.data,this.props.ismy)}></span></a>
                </span>;
            break;
            case '3' :// 下载成功状态
            this.body =
                <span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} >
                    <div className='tip_down'>已下载</div>
                    <dt className="tit">{this.props.data.name}</dt>
                    <dd className="con">
                        <p className="tip">{this.props.data.mcver}</p>
                    </dd>
                    <a className="btn_del" href="#"><span className='detail' onClick={this.props.toDetal.bind(this,this.props.data)}></span><span className='set' /*onClick={this.stopDownload.bind(this,this.props.data.id,this.props.data.type,this.props.data,this.props.ismy)}*/ ></span></a>
                </span>;
            break;
        };
    },
    // componentWillUpdate
    ,: function(nextProps) {
        var Style = {
                width: nextProps.data.progress
            };
        this.setState({status:nextProps.data.srcState,progress:nextProps.data.progress});
        switch(nextProps.data.srcState) {
            case '5' ://初始可下载状态
            this.body =
                <span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} >
                    <dt className="tit">{nextProps.data.name}</dt>
                    <dd className="con">
                        <p className="tip">{nextProps.data.mcver}</p>
                    </dd>
                    <a className="btn_down" href="#"><span className='detail' onClick={nextProps.toDetal.bind(this,nextProps.data)}></span><span className='down' onClick={this.downLoad.bind(this,nextProps.data.id,nextProps.data.type,nextProps.data,nextProps.ismy)}></span></a>
                </span>;
            break;
            case '0' ://暂停后的可下载状态
            this.body =
                <span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} >
                    <dt className="tit">{nextProps.data.name}</dt>
                    <dd className="con">
                        <p className="tip">{nextProps.data.mcver}</p>
                    </dd>
                    <a className="btn_down" href="#"><span className='detail' onClick={nextProps.toDetal.bind(this,nextProps.data)}></span><span className='down' onClick={this.downLoad.bind(this,nextProps.data.id,nextProps.data.type,nextProps.data,nextProps.ismy)}></span></a>
                </span>;
            break;
            case '4' ://出错 可下载状态
            this.body =
                <span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} >
                    <dt className="tit">{nextProps.data.name}</dt>
                    <dd className="con">
                        <p className="tip">{nextProps.data.mcver}</p>
                    </dd>
                    <a className="btn_down" href="#"><span className='detail' onClick={nextProps.toDetal.bind(this,nextProps.data)}></span><span className='down' onClick={this.downLoad.bind(this,nextProps.data.id,nextProps.data.type,nextProps.data,nextProps.ismy)}></span></a>
                </span>;
            break;
            case '3' :// 下载成功状态
            this.body =
                <span onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} >
                    <div className='tip_down'>已下载</div>
                    <dt className="tit">{nextProps.data.name}</dt>
                    <dd className="con">
                        <p className="tip">{nextProps.data.mcver}</p>
                    </dd>
                    <a className="btn_del" href="#"><span className='detail' onClick={this.props.toDetal.bind(this,this.props.data)}></span><span className='set' onClick={this.set.bind(this,nextProps.data.id,nextProps.data.type)} ></span></a>
                </span>;
            break;
            case '2' :// 下载中的状态
            this.body =
                <div className="progress" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                    <span className="rate" style={Style}></span>
                    <span className="done" >{nextProps.data.progress}</span>
                    <span className="pause" onClick={this.stopDownload.bind(this,nextProps.data.id,nextProps.data.type,nextProps.data,nextProps.ismy)}>删除</span>
                </div>;
            break;
        };
    },
    downLoad: function() {
        //通知原生触发下载
        mcAction.downloadSrc(this.props.data.id,this.props.data.type,this.props.data,this.props.ismy);
        this.setState({status:"2"});
    },
    stopDownload: function() {
        this.setState({
            cln:'',
            status:'5'
        });
        mcAction.stopDownloadSrc(this.props.data.id,this.props.data.type);
    },
    handleMouseOver: function(e) {
        //防止子组件误判父组件离开
        clearTimeout(this.st);
        if (this.state.status == '3') {
            this.setState({cln:'state_close'});
        }
        if (this.state.status == '2') {
            this.setState({cln:'state_pause'});
        }
        if (this.state.status == '5' || this.state.status == '4' || this.state.status == '0') {
            this.setState({cln:'state_down'});
        }
    },
    handleMouseOut: function() {
        var that = this;
        //防止子组件误判父组件离开
        this.st = setTimeout(function(){
                that.setState({cln:''});
            },100);
    },
    set: function(id, type) {
        resManager.applyResEvent(id, type);
    },
    seleDel: function() {
        if (this.props.ismy) {
            this.props.seleDel(this.props.data);
        }
    },
    render: function() {
        return (
            <dl className={"item "+this.state.cln+" "+this.props.itemCls+' '+this.props.data.seleCln } onClick={this.seleDel} data-id={this.props.data.id} data-type={this.props.data.type} >
                {this.body}
            </dl>
        );
    }
});

//资源模块
var SrcMod = React.createClass({
    srcMyObj:'',
    srcAllObj:'',
    getInitialState: function() {
        return {
            limitty:'0',
            limitvr:'0',
            page: 0,
            total: 0,
            show: 'hidden',
            delbox: 'del_hidden',
            delBtn: 'show',
            delBtnAble: 'disable',
            itemCls: 'normal',
            ret: [],
            myRet:[]
        };
    },
    fetch: function(page,type, ver) {
        var _type = typeof type === "undefined" ? this.state.limitty : type,
            _ver = typeof ver === "undefined" ? this.state.limitvr || 0 : ver;
        $.ajax({
            url: 'https://dl.aipai.com/zuihuiwan/apps/mc_action-resource_type-'+_type+'_sort-hot_page-'+page+'_ver-'+_ver+'.html',
            dataType: 'jsonp',
            success: function(data) {
                if (data.code == -1) return;
                this.srcAllObj = data.resource.mod;
                this.srcAllObj = this.srcAllObj.concat(data.resource.map,data.resource.resourcepack);
                this.srcAllObj.forEach(function(obj,i){
                    obj.progress = '即将开始下载';
                    obj.srcState = '5';
                });
                this.getMyRet(_type,page,_ver);
                $('.del_box .check-box').attr('checked',false);
                this.setState({
                    ret: this.srcAllObj,
                    total:data.resource.total,
                    limitty:_type,
                    limitvr:_ver,
                    page: page,
                    delbox:'del_hidden',
                    itemCls:'normal',
                    delBtnAble:'disable'
                });
            }.bind(this),
            error: function(xhr, status, err) {
            }.bind(this)
        });
    },
    addData: function(a,b) {
        if (b == '101') {
            return false;
        }
        var _type = this.state.limitty,
            _page = this.state.page,
            _ver = this.state.limitvr;
        var new_srcMyObj = {},
            index = 0;

        _.remove(new_srcMyObj, function(n) { //待删除
            return n.type == 101;
        });
        index = _.findIndex(this.srcAllObj, { 'id': a.toString(), 'type': b.toString() });
        new_srcMyObj = Object.assign({},this.srcAllObj[index]);
        new_srcMyObj.progress = "即将下载";
        new_srcMyObj.srcState = "3";
        new_srcMyObj.seleCln = "unsele";
        this.srcMyObj.push(new_srcMyObj);
        this.setState({myRet: this.srcMyObj});
    },
    delData: function(delObj) {
        _.remove(this.srcMyObj, function(n) {
            var _b = false;
            delObj.values.forEach((m)=>{
                if (m.id == n.id && m.type == n.type) {
                    _b = true;
                }
            });
            return _b;
        });
        $('.del_box .check-box').attr('checked',false);
        this.setState({
            myRet: this.srcMyObj,
            delbox:'del_hidden',
            itemCls:'normal',
            delBtnAble:'disable'
        });
        this.checkMySrcNo(this.srcMyObj);
        if (delObj.code != 0) {
            this.refs.tip.show({
                txt: delObj.status,
                btnCb: function(){},
                celCb: function(){}
            });
        }
    },
    //监听数据
    getData: function() {
        var that = this;
        resManager.installStatusChanged.connect(function(a,b,c,d) {
            //同步2个资源的最新状态
            var allIndex = _.findIndex(that.srcAllObj, { 'id': a.toString(), 'type': b.toString() }),
                myIndex = _.findIndex(that.srcMyObj, { 'id': a.toString(), 'type': b.toString() });
            try {
                that.srcAllObj[allIndex].srcState = d.toString();
            } catch(e) {
            }
            try {
                that.srcMyObj[myIndex].srcState = d.toString();
            } catch(e) {
            }
            that.setState({ret: that.srcAllObj,myRet: that.srcMyObj});
            that.checkMySrcNo(that.srcMyObj);
            that.props.forUpDetal(a+b+c+d);
        });
        resManager.installProgressChanged.connect(function(a,b,c) {
            //同步2个资源的最新进度
            var allIndex = _.findIndex(that.srcAllObj, { 'id': a.toString(), 'type': b.toString() }),
                myIndex = _.findIndex(that.srcMyObj, { 'id': a.toString(), 'type': b.toString() });

            try {
                that.srcAllObj[allIndex].progress = c+"%";
            } catch(e) {
            }
            try {
                that.srcMyObj[myIndex].progress = c+"%";
            } catch(e) {
            }
            that.setState({ret: that.srcAllObj,myRet: that.srcMyObj});
            that.props.forUpDetal(a+b+c);
        })
    },
    getMyRet: function(type,page,ver) {
        var _type = typeof type === "undefined" || !type ? this.state.limitty : type,
            _page = typeof page === "undefined" || !page ? this.state.page : page,
            _ver = typeof ver === "undefined" || !ver ? this.state.limitvr || 0 : ver;
        //客户端获取本地我的资源
        let srcMyObj = resManager.localResJson(_type,_page,_ver);
        this.srcMyObj = srcMyObj.resource.mod;
        this.srcMyObj = this.srcMyObj.concat(srcMyObj.resource.map,srcMyObj.resource.resourcepack);
        _.remove(this.srcMyObj, function(n) { //待删除
            return n.type == 101;
        });
        this.srcMyObj.forEach(function(obj){
            if(obj.progress == undefined) {
                obj.progress = '即将开始下载';
            }
            if(obj.srcState == undefined) {
                obj.srcState = '3';
            }
            if(obj.seleCln == undefined) {
                obj.seleCln = 'unsele';
            }
        });
        this.checkMySrcNo(this.srcMyObj);
        this.setState({myRet: this.srcMyObj});
    },
    componentWillMount: function() {
        this.fetch(1,1);
        //触发监听
        this.getData();
        mcAction.litenSrc(this.addData,this.delData,this.getMyRet);
    },
    handleClickTy: function(index,sort) {
        //处理筛选类型
        console.log(this.props.data);
        // mcAction.liCur($('.ty_list .con'),index);
        this.fetch(1,sort);
    },
    handleClickVr: function(index,sort) {
        //处理筛选版本
        var _type;
        console.log(this.props.data);
        mcAction.liCur($('.ver_list .con'),index);
        this.fetch(1,_type,sort);
    },
    showdelbox: function() {
        this.setState({
            delbox:'show',
            itemCls:'sele_del_state'
        });
    },
    checkMySrcNo: function(srcMyObj) {
        if (srcMyObj.length >= 1) {
            this.setState({
                delBtn: 'show-delbtn'
            });
        } else {
            this.setState({
                delBtn: 'hidden-delbtn'
            });
        }
    },
    hidedelbox: function() {
        $('.del_box .check-box').attr('checked',false);
        this.srcMyObj.forEach(function(obj){
                obj.seleCln = 'unsele';
        });
        this.setState({
            delbox:'del_hidden',
            itemCls:'normal',
            delBtnAble:'disable'
        });
    },
    seleAll: function(e) {
        let _b = $('.del_box .check-box').attr('checked'),
            ableDelBtn = 'disable';
        if (e.target.classList[0] == 'check-box') {
            if (_b) {
                _b = false;
            } else {
                _b = true;
            }
        }
        if (_b) {
            $('.del_box .check-box').attr('checked',false);
            this.srcMyObj.forEach(function(obj){
                obj.seleCln = 'unsele';
            });
            ableDelBtn = 'disable';
        } else {
            $('.del_box .check-box').attr('checked',true);
            this.srcMyObj.forEach(function(obj){
                obj.seleCln = 'sele';
            });
            ableDelBtn = 'enable';
        }
        this.setState({
            myRet: this.srcMyObj,
            delBtnAble: ableDelBtn
        });
    },
    // onHiddenTip: function() {
    //     this.setState({show:'hidden'});
    //     this.downLoad();
    // },
    onTipDel: function() {
        var that = this,
        seleDom = $('.sele_del_state.sele');
        if (seleDom.length <=0 ) {
            return false;
        }
        this.refs.tip.show({
            txt: '确定要删除所选资源',
            btnCb: that.delete
        });
    },
    delete: function() {
        let delObj = {
            values: []
        },
        seleDom = $('.sele_del_state.sele');
        seleDom.each(function(i,dom){
            delObj.values.push({
                id: $(dom).attr('data-id'),
                type: $(dom).attr('data-type')
            })
        });
        mcAction.delSrc(delObj);
    },
    seleDel: function(data) {
        let ableDelBtn = 'disable';
        if (this.state.itemCls == 'normal') {
            return false;
        }
         this.srcMyObj.forEach(function(obj){
            if(obj.id == data.id) {
                if (obj.seleCln == 'unsele') {
                    obj.seleCln = 'sele';
                    ableDelBtn = 'enable';
                } else {
                    $('.del_box .check-box').attr('checked',false);
                    obj.seleCln = 'unsele';
                    if ($('.sele_del_state.sele').length == 1) {
                        ableDelBtn = 'disable';
                    } else {
                        ableDelBtn = 'enable';
                    }
                }
            }
        });
        this.setState({
            myRet: this.srcMyObj,
            delBtnAble: ableDelBtn
        });
    },
    render: function() {
        var clickvr = this.handleClickVr,
            clicktp = this.handleClickTy,
            toDetal = this.props.toDetal;
        let {
            show,
            data
        } = this.props;
        return (
            <div className='bd_res'>
                <TipPop ref='tip' />
                <div className="res_tabcon" >
                    <span className={"src_del "+ show +' '+this.state.delBtn} onClick={this.showdelbox}>管理</span>
                    <div className={'del_box '+ this.state.delbox +' '+show}>
                        <input type="checkbox" className='check-box' onClick={(e)=>this.seleAll(e)} /><span className='sele_all' onClick={this.seleAll}>全选</span>
                        <span className={'del_btn '+this.state.delBtnAble} onClick={this.onTipDel}>删除</span>
                        <span className='cal_btn' onClick={this.hidedelbox} >取消</span>
                    </div>
                    <div className="rest_select select_con">
                        <div className="clearfix list ty_list">
                            <ul>
                                <li className="ti">类型：</li>
                                {data.srclimittp.map(function (data,index) {
                                    return (
                                        <SrcLimitli li={data} index={index} click={clicktp}/>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="clearfix list ver_list">
                            <ul>
                                <li className="ti">版本：</li>
                                {data.srclimitvr.map(function (data,index) {
                                    return (
                                        <SrcLimitli li={data} index={index} click={clickvr}/>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <Srclist ret={this.state.ret} myRet={this.state.myRet} pageTotal={this.state.total} show={this.props.show} curType={this.state.limitty} limit={this.state.limitvr} toDetal={toDetal} fetch={this.fetch} itemCls={this.state.itemCls} seleDel={this.seleDel} />
                </div>
            </div>
        );
    }
});

var SrcLimitli = React.createClass({
    render: function() {
        return (
            <li className={"con "+this.props.li.cls} onClick={this.props.click.bind(this,this.props.index,this.props.li.sort)}>{this.props.li.title}</li>
        );
    }
});




//资源tab模块
let ResourceBox = React.createClass({
    getInitialState: function() {
        return {
            data: staticData,
            showdetal:'hidden',
            show:'all',
            obj:{},
            justforup:""
        };
    },
    handleClick: function(index,sort) {
        //处理点击导航栏,切换不同tab
        mcAction.liCur($('.mc_resource .rest_nav li'),index);
        this.setState({show:sort});
    },
    toDetal: function(obj) {
        //切换到服务器详情页
        this.setState({showdetal:'show',obj:obj});
    },
    onHiddenDetal: function() {
        //隐藏服务器详情页
        this.setState({showdetal:'hidden'});
    },
    forUpDetal: function(n) {
        this.setState({
            justforup:n
        });
    },
    render: function () {
        return (
            <section className = "mc_src mc_resource" >
                < SrcDetal showdetal={this.state.showdetal} hiddenDetal={this.onHiddenDetal} obj={this.state.obj} justforup={this.state.justforup}/>
                < SrcNav data={this.state.data.srcNav} click={this.handleClick} />
                < SrcMod data={this.state.data} show={this.state.show} toDetal={this.toDetal} forUpDetal={this.forUpDetal}/>
            </section>
        );
    }
});

export default ResourceBox;