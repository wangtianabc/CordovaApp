//命名空间
//定义一些共用函数和方法
//AMD规范，适配requireJs
/// <reference path="jquery-1.12.4.js">
(function (window, undefined) {
    core_version = "0.0.1";

    var my_Util = (function () {
        var my_Util = function () {
            return new my_Util.prototype.init();
        }
        my_Util.fn = my_Util.prototype = {
            my_Util: core_version,
            constructor: my_Util,
            //构造函数
            init: function () {
                return this;
            },
            //实例方法添加处
            objectfunc: function () {
                console.log("实例方法");
            }
        }

        my_Util.fn.init.prototype = my_Util.fn;

        //照搬jQuery,可忽略
        my_Util.extend = my_Util.fn.extend = function () {
            var src, copyIsArray, copy, name, options, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

            // Handle a deep copy situation
            // target 是传入的第一个参数
            // 如果第一个参数是布尔类型，则表示是否要深递归，
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                // 如果传了类型为 boolean 的第一个参数，i 则从 2 开始
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            // 如果传入的第一个参数是 字符串或者其他
            if (typeof target !== "object" && !my_Util.isFunction(target)) {
                target = {};
            }

            // extend my_Util itself if only one argument is passed
            // 如果参数的长度为 1 ，表示是 my_Util 静态方法
            if (length === i) {
                target = this;
                --i;
            }

            // 可以传入多个复制源
            // i 是从 1或2 开始的
            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                // 将每个源的属性全部复制到 target 上
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        // src 是源（即本身）的值
                        // copy 是即将要复制过去的值
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        // 防止有环，例如 extend(true, target, {'target':target});
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        // 这里是递归调用，最终都会到下面的 else if 分支
                        // my_Util.isPlainObject 用于测试是否为纯粹的对象
                        // 纯粹的对象指的是 通过 "{}" 或者 "new Object" 创建的
                        // 如果是深复制
                        if (deep && copy && (my_Util.isPlainObject(copy) || (copyIsArray = my_Util.isArray(copy)))) {
                            // 数组
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && my_Util.isArray(src) ? src : [];

                                // 对象
                            } else {
                                clone = src && my_Util.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            // 递归
                            target[name] = my_Util.extend(deep, clone, copy);

                            // Don't bring in undefined values
                            // 最终都会到这条分支
                            // 简单的值覆盖
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            // 返回新的 target
            // 如果 i < length ，是直接返回没经过处理的 target，也就是 arguments[0]
            // 也就是如果不传需要覆盖的源，调用 $.extend 其实是增加 my_Util 的静态方法
            return target;
        }

        my_Util.extend({
            //静态方法
            staticfunc: function () {
                console.log($.fn.jquery);
            }

        })

        my_Util.prototype.init.prototype = my_Util.prototype;

        //添加AMD规范，适配requireJS
        if (typeof define === "function" && define.amd) {
            define("util", ['jquery'], function ($) {
                return my_Util;
            });
        }

        return my_Util;//命名空间（自定义）用来隔离方法和变量
    })();

    window.my_Util = window.my_$ = my_Util;

})(window);