/**
* author: "oujizeng",
* license: "MIT",
* github: "https://github.com/yangyuji/hammer-swipe-tabs",
* name: "hammerSwipeTabs.js",
* version: "2.0.0"
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
        var vendors = ['', 'webkit', 'ms', 'Moz', 'O'],
            body = document.body || document.documentElement;

        [].forEach.call(vendors, function (vendor) {
            var styleAttr = vendor ? vendor + attr : attr.charAt(0).toLowerCase() + attr.substr(1);
            if (typeof body.style[styleAttr] === 'string') {
                console.log(styleAttr);
                el.style[styleAttr] = val;
            }
        });
    }

    var _transitionEnd = function (el, fun) {
        var vendors = ['webitTransitionEnd', 'transitionend', 'msTransitionEnd', 'oTransitionEnd'];
        var handler = function (e) {
            [].forEach.call(vendors, function (vendor) {
                el.removeEventListener(vendor, handler, false);
            });
            fun.apply(el, arguments);
        };
        [].forEach.call(vendors, function (vendor) {
            el.addEventListener(vendor, handler, false);
        });
    }

    var hammerSwipeTabs = {

        init: function(opt) {

            var coefficient = 0.35,                         // 阻尼系数，0.2~0.5比较合适
                clientWidth = window.screen.width,
                clientHeight = window.screen.height,
                panelNum = 3,                               // 默认屏个数
                currentPanel = 1,                           // 当前所在屏
                currentMoveX = 0,                           // 横向动画已经滑动距离
                //currentMoveY = 0,                         // 竖向动画已经滑动距离

                scroller = document.querySelector(opt.scroller);   // 滚动容器

            var hammer = new Hammer(document.querySelector(opt.page));
            hammer.get('pan').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 0 });

            hammer.on('swipe swipeleft swiperight', function(ev) {
                console.log(ev.type);
                if (ev.type === 'swipe') {
                    _translate(scroller, 'TransitionTimingFunction', 'cubic-bezier(0, 0, 0.25, 1)');
                    _translate(scroller, 'TransitionDuration', '350ms');
                }

                // 向右滑动一屏
                if (ev.type == 'swiperight') {
                    // 已经到最左边了，来一点动画
                    if (currentMoveX === 0) {
                        var x = ev.deltaX * coefficient;
                        _translate(scroller, 'TransitionTimingFunction', 'linear');
                        _translate(scroller, 'TransitionDuration', '100ms');
                        _translate(scroller, 'Transform', 'translateX(' + x + 'px)');
                        _transitionEnd(scroller, function (e) {
                            _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                        });
                        return;
                    } else {
                        // 向右滑一屏
                        currentPanel -= 1;
                        currentMoveX += clientWidth;
                        _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                        // 配置panel的高度，避免被高的撑开
                        _transitionEnd(scroller, function () {
                            for (var n = 0; n < scroller.children.length; n++) {
                                if (n === currentPanel - 1) {
                                    window.scrollTo(0, 0);
                                    scroller.children[n].style.height = 'auto';
                                } else {
                                    scroller.children[n].style.height = clientHeight + 'px';
                                }
                            }
                        });
                    }
                }

                // 向左滑动一屏
                if (ev.type == 'swipeleft') {
                    // 已经到最右边了，来一点动画
                    if (Math.abs(currentMoveX) >= (panelNum - 1) * clientWidth) {
                        var x = currentMoveX - (Math.abs(ev.deltaX) * coefficient);
                        _translate(scroller, 'TransitionTimingFunction', 'linear');
                        _translate(scroller, 'TransitionDuration', '100ms');
                        _translate(scroller, 'Transform', 'translateX(' + x + 'px)');
                        _transitionEnd(scroller, function (e) {
                            _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                        });
                        return;
                    } else {
                        // 向左滑一屏
                        currentPanel += 1;
                        currentMoveX -= clientWidth;
                        _translate(scroller, 'Transform', 'translateX(' + currentMoveX + 'px)');
                        // 配置panel的高度，避免被高的撑开
                        _transitionEnd(scroller, function () {
                            for (var n = 0; n < scroller.children.length; n++) {
                                if (n === currentPanel - 1) {
                                    window.scrollTo(0, 0);
                                    scroller.children[n].style.height = 'auto';
                                } else {
                                    scroller.children[n].style.height = clientHeight + 'px';
                                }
                            }
                        });
                    }
                }
            });
        }
    };

    return hammerSwipeTabs;
}));