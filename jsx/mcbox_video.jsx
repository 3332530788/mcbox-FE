import React from 'react';

//推荐tab
var Tab = React.createClass({
    render: function() {
        var {click, del} = this.props;
        return (
            <ul className='tab_nav'>
                {this.props.data.map((data, index) => {
                    return (
                        <Li li={data} index={index} click={click} del={del}/>
                    );
                }) }
            </ul>
        );
    }
});
var Li = React.createClass({
    render: function() {
        return (
            <div className='tab_li_box'>
                <li className={this.props.li.cur} onClick={this.props.click.bind(this, this.props.index, this.props.li['sort']) } >{this.props.li.title}<b onClick={(e) => this.props.del(e) } >X</b></li>
                <p></p>
            </div>
        );
    }
});

var Search = React.createClass({
    cleanInput: function() {
        $('.input_box input').val('');
        $('.clean').addClass('hidden');
    },
    keyup: function(e) {
        $('.clean').removeClass('hidden');
        if (e.keyCode == 13) {
            this.props.click($('.input_box input').val());
        }
        if (!$('.input_box input').val()) {
            $('.clean').addClass('hidden');
        }
    },
    render: function() {
        var {click, keywords} = this.props;
        return (
            <div className='input_box'>
                <input placeholder='输入关键字' maxLength='27' onKeyUp={this.keyup}/><span className='clean hidden' onClick={this.cleanInput}></span><i onClick={() => click($('.input_box input').val()) }>|</i>
                <p className='keywords_box'>
                    {keywords.map((data, index) => {
                        if (index >= 6) return false;
                        return (
                            <span onClick={() => click(data) } >{data}</span>
                        );
                    }) }
                </p>
            </div>
        )
    }
});
//每日推荐
var Suggestion = React.createClass({
    componentDidMount: function() {
        var _i = 0,
            _st = setInterval(() => {
                var pics = $('.suggestion_box .loop a'),
                    len = pics.length;
                pics.removeClass('cur').eq(_i).addClass('cur');
                _i++;
                if (_i == len) _i = 0;
            }, 3000);
            this.setState({
                _st: _st
            });
    },
    componentWillUnmount: function() {
        let _st = this.state._st;
        clearInterval(_st);
    },
    render: function() {
        var {data, click} = this.props;
        return (
            <div className='suggestion_box'>
                <div className='loop'>
                    {data.focus.map((data, index) => {
                        return (
                            <a href={data.url}>
                                <img src={data.img} />
                            </a>
                        );
                    }) }
                </div>
                <div className='show'>
                    <div className='daren'>
                        <p className='title'>今日达人</p>
                        {data.daren.map((data, index) => {
                            return (
                                <span onClick={() => click(data.title) }>
                                    <img src={data.img} />
                                    <p className='name'>{data.title}</p>
                                </span>
                            );
                        }) }
                    </div>
                    <div className='xinren'>
                        <p className='title'>今日新人</p>
                        {data.xinxiu.map((data, index) => {
                            return (
                                <span onClick={() => click(data.title) }>
                                    <img src={data.img} />
                                    <p className='name'>{data.title}</p>
                                </span>
                            );
                        }) }
                    </div>
                </div>
                <a href='http://mc.aipai.com' className='more_btn'>更多MC牛人<i></i></a>
            </div>
        )
    }
});
//精彩视频
var Hot = React.createClass({
    initPage: function(nprops) {
        var that = this,
            {videos, curSort} = nprops;
        if (!videos.total || videos.total < 8) {
            $(".hot_box .pagetab").hide();
        } else {
            $(".hot_box .pagetab").show();
            $(".hot_box .pagetab").createPage({
                pageCount: Math.ceil(videos.total / 8) >= 100 ? 100 : Math.ceil(videos.total / 8),
                current: 1,
                backFn: function(p) {
                    that.props.click(curSort, p, -1);
                }
            });
        }
    },
    componentWillReceiveProps: function(nprops) {
        if (nprops.curSort !== this.props.curSort) {
            this.initPage(nprops);
        }
    },
    render: function() {
        var {ohterVideo, click, videos} = this.props;
        return (
            <div className='hot_box'>
                <nav>
                    <span className='cur' onClick={() => click('', 1, 0) }>
                        <p>顶上来的作品</p>
                    </span>
                    <span onClick={() => click('class', 1, 1) }>
                        <p>精华作品</p>
                    </span>
                    <span onClick={() => click('id', 1, 2) }>
                        <p>最新作品</p>
                    </span>
                    <span onClick={() => click('flower', 1, 3) }>
                        <p>本周鲜花榜</p>
                    </span>
                    <span onClick={() => click('click', 1, 4) }>
                        <p>本周人气榜</p>
                    </span>
                    {ohterVideo.map((data, index) => {
                        if (index >= 3) { return false; }
                        return (
                            <span onClick={() => click('other', 1, index + 5, index) }>
                                <p>{data.title}</p>
                            </span>
                        );
                    }) }
                </nav>
                <div className='video_box'>
                    <div className={"loading " + this.props.load}>
                        <div className="loader">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    {videos.data[0].map((data, index) => {
                        if (!data.work) {
                            data.work = data;
                        }
                        return (
                            <a className='videos' href={data.work.url} key={data.id}>
                                <img src={data.work.middle}  alt={data.work.title}/>
                                <span>{data.work.totalTime}</span>
                                <p>{data.work.title}</p>
                            </a>
                        );
                    }) }
                    {videos.data[1].map((data, index) => {
                        if (!data.work) {
                            data.work = data;
                        }
                        return (
                            <a className='videos' href={data.work.url} key={data.id}>
                                <img src={data.work.middle}  alt={data.work.title}/>
                                <span>{data.work.totalTime}</span>
                                <p>{data.work.title}</p>
                            </a>
                        );
                    }) }
                    <div className="pagetab">
                    </div>
                </div>
            </div>
        )
    }
});

var SearchVideos = React.createClass({
    getInitialState: function() {
        return {
            tipId: 0
        }
    },
    initPage: function(nprops) {
        var {changePage, videos, curKey} = nprops;
        if (videos.total < 8) {
            $(".key_box .pagetab").hide();
        } else {
            $(".key_box .pagetab").show().createPage({
                pageCount: Math.ceil(videos.total / 10) >= 100 ? 100 : Math.ceil(videos.total / 10),
                current: 1,
                backFn: function(p) {
                    changePage(curKey, p);
                }
            });
        }
    },
    closeTip: function() {
        $('.key_box .info_box').hide();
    },
    componentWillReceiveProps: function(nprops) {
        if (nprops.curKey !== this.props.curKey) {
            this.initPage(nprops);
        }
        if (nprops.videos.data.length == 0) {
            $('.key_box .video_box').hide();
            $('.key_box .video_null').show();
        } else {
            if (nprops.info === true) {
                var tipId = this.state.tipId;
                clearTimeout(tipId);
                $('.key_box .info_box').show();
                tipId = setTimeout(function() { $('.key_box .info_box').hide(); }, 3500);
                this.setState({
                    tipId: tipId
                });
            }
            $('.key_box .video_box').show();
            $('.key_box .video_null').hide();
        }
    },
    render: function() {
        var {click, videos, keywords, curKey} = this.props;
        return (
            <div className='key_box'>
                <div className={"loading " + this.props.load}>
                    <div className="loader">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div className='info_box' onClick={this.closeTip}>
                    <p className="info">(约有<span className='org'>{videos.total}</span>个符合<span className='org'>{curKey}</span>的作品) </p>
                </div>
                <div className='video_box'>
                    <div>
                        {videos.data.map((data, index) => {
                            return (
                                <a className='videos' key={data.id} href={data.url}>
                                    <img src={data.big.replace(/400.jpg/, 'big.jpg') }  alt={data.title}/>
                                    <span>{data.totalTime}</span>
                                    <p>{data.title}</p>
                                </a>
                            );
                        }) }
                    </div>
                    <div className="pagetab">
                    </div>
                </div>
                <div className='video_null'>
                    <p>暂无视频, 看看热门关键词吧</p>
                    <div>
                        {keywords.map((data, index) => {
                            if (index > 3) {
                                return false;
                            }
                            return (
                                <span onClick={() => click(data, 1) } >{data}</span>
                            );
                        }) }
                    </div>
                </div>
            </div>
        )
    }
});


//视频模块
let VideoBox = React.createClass({
    getInitialState: function() {
        return {
            show: 'suggestion',
            nav: {
                videoNav: []
            },
            ohterVideo: [

            ],
            curSort: 'init',
            indexData: {
                daren: [],
                xinxiu: [],
                focus: []
            },
            info: true,
            curKey: 'fuck',
            searchVideos: { data: [] },
            videos: {
                data: [[], []]
            },
            load: 'show',
            random: [],
            hotKey: [],
            keywords: []
        };
    },
    componentWillMount: function() {
        this.setState({ nav: staticData });
        $.ajax({
            url: 'http://www.aipai.com/zuihuiwan/apps/mcvideo_action-index.html',
            dataType: 'jsonp',
            jsonpCallback: 'mcvideo_index',
            cache: true,
            success: function(data) {
                this.setState({
                    indexData: data.data,
                    random: data.data.keywords.sort(function() { return 0.5 - Math.random() }),
                    keywords: data.data.keywords.concat([])
                }, () => this.handleKey());
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        $.ajax({
            url: 'http://www.aipai.com/zuihuiwan/apps/mcvideo_action-video.html',
            dataType: 'jsonp',
            jsonpCallback: 'mcvideo_video',
            cache: true,
            success: function(data) {
                this.setState({ ohterVideo: data.videoTypes });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        this.getVideo('', 1);

    },
    getVideo: function(sort, page) {
        this.setState({
            load: 'show'
        });
        var data = JSON.stringify({
            "gameid": 34513,
            "page": page,
            "pageSize": 8,
            "totalPage": 1,
            "sort": sort
        });
        $.ajax({
            url: 'http://www.aipai.com/app/www/apps/gameAreaInfo.php?action=getWork&from=mcbox&data=' + data,
            dataType: 'jsonp',
            jsonpCallback: 'mcvideo_areainfo',
            cache: true,
            success: function(data) {
                this.setState({ videos: data, curSort: sort });
                setTimeout(() => {
                    this.setState({
                        load: 'hidden'
                    });
                }, 500);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getSearch: function(key, _page, cb) {
        this.setState({
            load: 'show'
        });
        $.ajax({
            url: 'http://so.aipai.com/api/search_gameid-34513_key-' + key + '_page-' + _page + '_rows-10.html',
            dataType: 'jsonp',
            jsonpCallback: 'mcvideo_search',
            cache: true,
            success: function(data) {
                this.setState({ searchVideos: data, curKey: key, info: false });
                setTimeout(() => {
                    this.setState({
                        load: 'hidden'
                    });
                }, 500);
                cb ? cb() : 1;
                mcAction.liCur($('.video_tab_box .tab_nav li'), 2);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleClick: function(index, sort) {
        //处理tab切换
        mcAction.liCur($('.video_tab_box .tab_nav li'), index);
        this.setState({ show: sort });
    },
    //隐藏自由索搜tab
    del: function(e) {
        e.stopPropagation();
        var _nav = this.state.nav;
        _nav.videoNav.pop();
        this.setState({
            nav: _nav,
            show: 'suggestion',
            curKey: ''
        }, () => {
            mcAction.liCur($('.video_tab_box .tab_nav li'), 0);
        });
    },
    handleKey: function(key) {
        var _key = window.localStorage.searchKey,
            _arrKey = [],
            _backKey = this.state.random,
            _finKey = [];
        //保存搜索记录
        if (_key) {
            _arrKey = _key.split(',');
        } else {
            window.localStorage.searchKey = 'MC,';
            _arrKey = ['MC'];
        }
        _backKey.forEach((arr, index) => {
            if (arr == key) {
                _backKey.splice(index, 1);
            }
        });
        if (key) {
            _arrKey.length >= 3 ? _arrKey.pop() : 0;
            _arrKey.unshift(key);
            _key = _arrKey.join(',');
            window.localStorage.searchKey = _key;
        } else {
            _finKey = _.uniq(_arrKey.concat(_backKey)).slice(0, 6);
            this.setState({
                hotKey: _finKey
            });
        }
    },
    handlerSearch: function(data, page) {
        if (!data) {
            $('.mc_video .input_box input').addClass('red');
            return false;
        }
        $('.mc_video .input_box input').removeClass('red');

        var _page = page || 1,
            _nav = this.state.nav;
        //过滤重复点击
        if (this.state.curKey == data) {
            return false;
        }
        data = data.substring(0, 27);
        //处理搜索记录
        this.handleKey(data);

        //保存第三个自由tab的名字
        if (!_nav.videoNav[2]) {
            _nav.videoNav.push({
                "title": data,
                "sort": "key",
                "cur": "cur"
            });
        } else {
            _nav.videoNav[2].title = data;
            _nav.videoNav[2].sort = 'key';
            _nav.videoNav[2].cur = '';
        }
        $('.clean').removeClass('hidden');
        $('.input_box input').val(data);
        //执行查询
        this.getSearch(data, _page, () => {
            this.setState({
                show: "key",
                nav: _nav,
                info: true
            });
        });
    },
    switchTab: function(sort, page, index, oindex) {
        if (index !== -1) {
            mcAction.liCur($('.hot_box nav span'), index);
        }
        if (sort == 'other') {
            this.setState({
                videos: this.state.ohterVideo[oindex],
                curSort: oindex
            });
        } else {
            this.getVideo(sort, page);
        }
    },
    render: function() {
        return (
            <section className = "mc_video" >
                <Search keywords={this.state.hotKey} click={this.handlerSearch}/>
                <div className={'video_tab_box ' + this.state.show}>
                    <Tab data={this.state.nav.videoNav} click={this.handleClick} del={this.del}/>
                    <Suggestion data={this.state.indexData} click={this.handlerSearch} />
                    <Hot load={this.state.load} click={this.switchTab} curSort={this.state.curSort} ohterVideo={this.state.ohterVideo} videos={this.state.videos} />
                    <SearchVideos load={this.state.load} videos={this.state.searchVideos} keywords={this.state.keywords} click={this.handlerSearch} changePage={this.getSearch} curKey={this.state.curKey} info={this.state.info}/>
                </div>
            </section>
        );
    }
});

export default VideoBox;