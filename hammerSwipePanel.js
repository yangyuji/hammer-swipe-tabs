/*
* author: "oujizeng",
* license: "MIT",
* name: "hammerSwipeTabs.js",
* version: "1.0.1"
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.returnExportsGlobal = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root['HammerSwipePanel'] = factory();
    }
}(this, function () {

    var getEle = function (str) {
        return document.querySelector(str);
    };

    var HammerSwipePanel = {

        init: function(opt) {

            var coefficient = 0.35,                         // 阻尼系数，0.2~0.5比较合适
                clientWidth = window.screen.width,
                clientHeight = window.screen.height,
                panelNum = 3,                               // 默认屏个数
                isSwipe = false,                            // 是否是swipe动作
                currentPanel = 1,                           // 当前所在屏
                currentMoveX = 0,                           // 横向动画已经滑动距离
                //currentMoveY = 0,                           // 竖向动画已经滑动距离

                scroller = getEle(opt.scroller),            // 滚动容器
                page = getEle(opt.page);                    // 主容器

            var hammer = new Hammer(page);
            hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 }); // 防止panstart不出现和干扰上下滚动的问题
            hammer.on('panstart panleft panright pancancel swipe panend', function(ev) {
                console.log(ev.type);
                if (ev.type === 'panstart') {
                    scroller.style.transitionProperty = 'transform';
                    scroller.style.transitionTimingFunction = 'cubic-bezier(0, 0, 0.25, 1)';
                    scroller.style.transitionDuration = '0ms';
                }

                // 向右滑动
                if (ev.type == 'panright') {
                    // 已经到最左边了
                    if (currentMoveX === 0) {
                        // 加上阻尼效果
                        // var x = moveX > clientWidth ? clientWidth * coefficient : moveX * coefficient;
                        // 改为不限制滚动距离
                        var x = ev.deltaX * coefficient;
                        scroller.style.transform = 'translate3d(' + x + 'px,0,0)';
                    } else {
                        scroller.style.transform = 'translate3d(' + (currentMoveX + Math.abs(ev.deltaX)) + 'px,0,0)';
                    }
                }

                // 向左滑动
                if (ev.type == 'panleft') {
                    // 已经到最右边了
                    if (Math.abs(currentMoveX) >= (panelNum - 1) * clientWidth) {
                        // 加上阻尼效果
                        // var x = Math.abs(moveX) > clientWidth ? currentMoveX - (clientWidth * coefficient) : currentMoveX - (Math.abs(moveX) * coefficient);
                        // 改为不限制滚动距离
                        var x = currentMoveX - (Math.abs(ev.deltaX) * coefficient);
                        scroller.style.transform = 'translate3d(' + x + 'px,0,0)';
                    } else {
                        scroller.style.transform = 'translate3d(' + (currentMoveX - Math.abs(ev.deltaX)) + 'px,0,0)';
                    }
                }

                // swipe行为
                if (ev.type === 'swipe') {
                    // 因为swipe结束后肯定会触发panend，所以这个地方不做处理，统一放到panend里面做
                    isSwipe = true;
                }

                // 处理pancancel的情况
                if (ev.type === 'pancancel') {
                    scroller.style.transform = 'translate3d(' + currentMoveX + 'px,0,0)';
                }

                if (ev.type === 'panend') {

                    // 放慢动画，避免卡
                    scroller.style.transitionDuration = '350ms';

                    if (isSwipe) {
                        if (ev.deltaX < 0) {
                            // 已经是最后一屏
                            if (Math.abs(currentMoveX) == (panelNum - 1) * clientWidth) {
                                scroller.style.transform = 'translate3d(' + currentMoveX + 'px,0,0)';
                            } else {
                                // 向左滑一屏
                                currentPanel += 1;
                                currentMoveX -= clientWidth;
                                scroller.style.transform = 'translate3d(' + currentMoveX + 'px,0,0)';
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
                                scroller.style.transform = 'translate3d(' + currentMoveX + 'px,0,0)';
                            } else {
                                // 向右滑一屏
                                currentPanel -= 1;
                                currentMoveX += clientWidth;
                                scroller.style.transform = 'translate3d(' + currentMoveX + 'px,0,0)';
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
                        scroller.style.transform = 'translate3d(' + currentMoveX + 'px,0,0)';
                    }
                }
            });
        }
    };

    return HammerSwipePanel;
}));