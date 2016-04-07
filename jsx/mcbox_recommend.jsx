import React, {Component} from 'react';

//推荐tab
let Tab = React.createClass({
    render: function() {
        var click = this.props.click;
        return (
            <ul>
                {this.props.data.map(function (data,index) {
                    return (
                        <Li li={data} index={index} click={click}/>
                    );
                })}
            </ul>
        );
    }
});
let Li = React.createClass({
    render: function() {
        return (
            <li className={this.props.li.cur} onClick={this.props.click.bind(this,this.props.index,this.props.li['sort']) } >{this.props.li.title}</li>
        );
    }
});


//推荐tab列表
let Tabbody = React.createClass({
    render: function () {
        var zx = this.props.ret.zixun.list.map(function (data) {
                return (
                    <TabbodyText data={data} />
                );
            }),
            sp = this.props.ret.videos.list.map(function (data) {
                return (
                    <TabbodyVideo data={data} />
                );
            }),
            jy = this.props.ret.bbs.list.map(function (data,index) {
                if (index > 2) return false;
                return (
                    <TabbodyText data={data} />
                );
            }),
            xz = this.props.ret.down.list.map(function (data) {
                return (
                    <TabbodyText data={data} />
                );
            });
        return (
            <div className = 'list' >
            <ul className='mc_zx'>{zx}</ul>
            <ul className='mc_sp'>{sp}</ul>
            <ul className='mc_jy'>{jy}<a className='mc_jy_money_btn' href='http://mcbbs.aipai.com/forum.php?mod=forumdisplay&fid=62'>我要赚钱</a><a className='mc_jy_people_btn' href='http://mcbbs.aipai.com/forum.php?mod=forumdisplay&fid=63'>我要聘人</a></ul>
            <ul className='mc_xz'>{xz}</ul>
            </div>
        );
    }
});

let TabbodyVideo = React.createClass({
    render: function() {
        return (
            <li>
                <a className="pics" href={this.props.data.url}>
                    <img src={this.props.data.pic} alt="" />
                    <span className="time">{this.props.data.duration}</span>
                </a>
                <h3><a href={this.props.data.url}>{this.props.data.title}</a></h3>
            </li>
        );
    }
});

let TabbodyText = React.createClass({
    render: function() {
        return (
                <h3 className='text'><span>[{this.props.data.tag}] </span><a href={this.props.data.url}>{this.props.data.title}</a></h3>
        );
    }
});


//推荐资讯
let Info = React.createClass({
    getInitialState: function() {
        return {
            show: 'zx',
            index:'0',
            moreUrl:''
        }
    },
   imgLoadError:function(){
        this.getDOMNode().querySelector('img').src = 'css/img/s.png';
   },
    componentWillReceiveProps: function(nextProps) {
        //初始化moreUrl值
        if (this.state.moreUrl == '') {
            this.setState({moreUrl:nextProps.ret.zixun.more});
        }
    },
    handleClick: function(index,sort) {
        mcAction.liCur($('.mod_info .nav li'),index);
        this.setState({show:sort,index:index});
        switch (index) {
            case 1:
                this.setState({moreUrl:this.props.ret.videos.more});
                break;
            case 2:
                this.setState({moreUrl:this.props.ret.bbs.more});
                break;
            case 3:
                this.setState({moreUrl:this.props.ret.down.more});
                break;
            case 0:
                this.setState({moreUrl:this.props.ret.zixun.more});
                break;
        }
    },
    render: function () {
        var errorImg = 'javascript:this.src=css/img/s.png';
        return (
            <div className="mod_info">
                <div className="con_l">
                    <div className="hd_nav">
                        <div className="nav">
                            <Tab data={this.props.data.infoTab} click={this.handleClick} />
                        </div>
                        <a className="more" href={this.state.moreUrl}>更多{this.props.data.infoTab[this.state.index].title}</a>
                    </div>
                    <div className="bd_tab">
                        <div className={"tab_con "+this.state.show}>
                            <Tabbody data={this.props.data} ret={this.props.ret}/>
                        </div>
                    </div>
                </div>
                <div className="con_r bbs">
                    <a href={this.props.ret.ad.list[0].url}>
                        <img src={this.props.ret.ad.list[0].pic}/>
                    </a>
                </div>
            </div>
        );
    }
});

//焦点图
let Focus = React.createClass({
    componentDidMount: function() {
        setTimeout(function(){
            $('#mod_focus').dsTab({
                itemEl        : '.con li',
                btnElName     : 'tabTip',
                btnItem       : 'li',
                prev          : '.prev',
                next          : '.next',
                currentClass  : 'cur',
                maxSize       : 5,
                changeType    : 'fade',
                change        : true,
                changeTime    : 5000,
                autoCreateTab : true
            });
        },1000);
    },
    render: function() {
        return (
            <div id="mod_focus" className="mod_focus1">
                <a href="javascript:void(0);" className="prev"></a>
                <a href="javascript:void(0);" className="next"></a>
                <ul className="con">
                    {this.props.data.list.map(function (data,index) {
                        return (
                            <Focusli li={data} index={index} />
                        );
                    })}
                </ul>
            </div>
        );
    }
});


let Focusli = React.createClass({
    render: function() {
        var divImage = {
            backgroundImage:'url('+ this.props.li.pic +')'
        };
        return (
            <li className={this.props.li.cur} >
                <a href={this.props.li.url} title="">
                    <img src='css/img/default_focus.png' width="670" height="230"  />
                    <div className="pic_con" style={divImage} ></div>
                </a>
            </li>
        );
    }
});

//推荐tab模块
let RecomBox = React.createClass({
    getInitialState: function() {
        return {
            data: {
                sevrNav:[[],[],[]]
            },
            ret:{
                focus:{
                    list:[]
                },
                zixun:{
                    list:[],
                    more:''
                },
                down:{
                    list:[]
                },
                bbs:{
                    list:[]
                },
                ad: {
                    list:[{url:'',pic:''}]
                },
                videos: {
                    list:[]
                }
            }
        };
    },
    componentWillMount: function() {
        this.setState({data: staticData});
        $.ajax({
            url: 'https://dl.aipai.com/zuihuiwan/apps/mc.php',
            dataType: 'jsonp',
            jsonpCallback: 'mc',
            cache: true,
            success: function(data) {
                this.setState({ret: data.data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleClick: function(index,sort) {
        //处理tab切换
        mcAction.liCur($('.sevr_nav li'),index);
        this.setState({show:sort});
    },
    render: function () {
        return (
            <section className = "mc_recommend mc_focus" >
                < Focus data={this.state.ret.focus} />
                < Info data={this.state.data} ret={this.state.ret} />
            </section>
        );
    }
});

export default RecomBox;