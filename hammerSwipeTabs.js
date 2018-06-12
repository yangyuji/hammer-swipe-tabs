/*
* author: "oujizeng",
* license: "MIT",
* github: "https://github.com/yangyuji/hammer-swipe-tabs",
* name: "hammerSwipePanel.js",
* version: "1.1.0"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root['hammerSwipeTabs'] = factory();
    }
}(this, function () {
    'use strict'

    var _translate = function (el, attr, val) {
        var vendors = ['', 'Webkit', 'ms', 'Moz', 'O'],
            body = document.body || document.documentElement;

        [].forEach.call(vendors, function (vendor) {
            var styleAttr = vendor ? vendor + attr : attr.charAt(0).toLowerCase() + attr.substr(1);
            if (typeof body.style[styleAttr] === 'string') {
                el.style[styleAttr] = val;
            }
        });
    }

    var hammerSwipeTabs = {

        init: function(opt) {

            var coefficient = 0.35,                         // 阻尼系数，0.2~0.5比较合适
                clientWidth = window.screen.width,
                clientHeight = window.screen.height,
                panelNum = 3,                               // 默认屏个数
                isSwipe = false,                            // 是否是swipe动作
                currentPanel = 1,                           // 当前所在屏
                currentMoveX = 0,                           // 横向动画已经滑动距离
                //currentMoveY = 0,                         // 竖向动画已经滑动距离

                scroller = document.querySelector(opt.scroller);   // 滚动容器

            var hammer = new Hammer(document.querySelector(opt.page));
            // 防止panstart不出现和干扰上下滚动的问题
            hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 });

            hammer.on('panstart panleft panright pancancel swipe panend', function(ev) {
                console.log(ev.type);
                if (ev.type === 'panstart') {
                    _translate(scroller, 'TransitionProperty', 'transform');
                    _translate(scroller, 'TransitionTimingFunction', 'cubic-bezier(0, 0, 0.25, 1)');
                    _translate(scroller, 'TransitionDuration', '0ms');
                }

                // 向右滑动
                if (ev.type == 'panright') {
                    // 已经到最左边了
                    if (currentMoveX === 0) {
                        // 加上阻尼效果
                        // var x = ev.deltaX > clientWidth ? clientWidth * coefficient : ev.deltaX * coefficient;
                        // 改为不限制滚动距离
                        var x = ev.deltaX * coefficient;
                        _translate(scroller, 'Transform', 'translateX(' + x + 'px)');
                    } else {
                        _translate(scroller, 'Transform', 'translateX(' + (currentMoveX + Math.abs(ev.deltaX)) + 'px)');
                    }
                }

                // 向左滑动
                if (ev.type == 'panleft') {
                    // 已经到最右边了
                    if (Math.abs(currentMoveX) >= (panelNum - 1) * clientWidth) {
                        // 加上阻尼效果
                        // var x = Math.abs(ev.deltaX) > clientWidth ? currentMoveX - (clientWidth * coefficient) : currentMoveX - (Math.abs(ev.deltaX) * coefficient);
                        // 改为不限制滚动距离
                        var x = currentMoveX - (Math.abs(ev.deltaX) * coefficient);
                        _translate(scroller, 'Transform', 'translateX(' + x + 'px)');
                    } else {
                        _translate(scroller, 'Transform', 'translateX(' + (currentMoveX - Math.abs(ev.deltaX)) + 'px)');
                    }
                }

                // swipe行为
                if (ev.type === 'swipe') {
                    // 因为swipe结束后肯定会触发panend，所以这个地方不做处理，统一放到panend里面做
                    isSwipe = true;
                }

                // 处理pancancel的情况
                if (ev.type === 'pancancel') {
                    _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                }

                if (ev.type === 'panend') {

                    // 放慢动画，避免卡
                    _translate(scroller, 'TransitionDelay', '0ms');
                    _translate(scroller, 'TransitionDuration', '350ms');

                    if (isSwipe) {
                        if (ev.deltaX < 0) {
                            // 已经是最后一屏
                            if (Math.abs(currentMoveX) == (panelNum - 1) * clientWidth) {
                                _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                            } else {
                                // 向左滑一屏
                                currentPanel += 1;
                                currentMoveX -= clientWidth;
                                _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                                // 配置panel的高度，避免被高的撑开
                                setTimeout(function () {
                                    for (var n = 0; n < scroller.children.length; n++) {
                                        if (n === currentPanel - 1) {
                                            scroller.children[n].style.height = 'auto';
                                        } else {
                                            scroller.children[n].style.height = clientHeight + 'px';
                                        }
                                    }
                                }, 0);
                            }
                        } else {
                            // 当前是第一屏
                            if (currentMoveX === 0) {
                                _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                            } else {
                                // 向右滑一屏
                                currentPanel -= 1;
                                currentMoveX += clientWidth;
                                _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                                // 配置panel的高度，避免被高的撑开
                                setTimeout(function () {
                                    for (var n = 0; n < scroller.children.length; n++) {
                                        if (n === currentPanel - 1) {
                                            scroller.children[n].style.height = 'auto';
                                        } else {
                                            scroller.children[n].style.height = clientHeight + 'px';
                                        }
                                    }
                                }, 0);
                            }
                        }

                        // 还原参数
                        isSwipe = false;

                    } else {
                        _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                    }
                }
            });
        }
    };

    return hammerSwipeTabs;
}));