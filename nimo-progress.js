(function () {
    var foo = {}
    var main = 251.32;
    var $Immediate = function (e) {
        new Promise(function (r) {
            r()
        }).then(e)
    }
    var Immediate = Immediate || window.setImmediate || window.requestAnimationFrame || setTimeout
    var append = function (elm) {
            var wrap = document.createElement('nimo-loader');
            wrap.createShadowRoot = wrap.attachShadow || wrap.createShadowRoot
            wrap = wrap.createShadowRoot({
                mode: 'closed'
            });

            wrap.innerHTML = foo.style
            var cover = document.createElement('nimo-loader-cover');
            // console.dir(wrap)
            wrap.appendChild(cover)
            cover.appendChild(elm)
            return wrap;
        },
        resolveQueue = function (queue, r) {
            return new Promise(function (_r) {
                _r = r || _r || new Function()
                queue = queue;
                r = r || new Function();
                if (0 >= queue.length) {
                    _r()
                    return true
                }
                var it = _t[queue[queue.length - 1][0]];
                if (it instanceof Function) {
                    var i = queue[queue.length - 1]
                    queue.pop()
                    it = it(i[1][0], i[1][1])
                    resolveQueue(queue, _r)
                }
            })
        },
        factor_invert = function (value, max, main) {
            // main = less than main (100)    (10,1000,100)
            main = main || 100;
            max = max == 0 ? value : max;
            var y = max;
            var x = value;
            var x = x * main,
                x = x / y;
            return x > main ? main : x;
        },
        toValidText = function (text) {
            text = text || 'loading'
            text = text.trim()
            text = text.toLowerCase()
            text = text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
            return text;
        },
        FakeArray = function () {
            this.length = 0;
            this.__proto__ = this.constructor
        },
        initRemover = function (elm) {
            elm.host.remove()
        },
        InitElement = function (text, svg) {
            text = toValidText(text)
            var elm = document.createElement('nimo-loader-body')
            var title = document.createElement('nimo-loader-text')
            var icon = document.createElement('nimo-loader-icon')
            title.innerText = text;
            elm.appendChild(title)
            elm.appendChild(icon)
            this.indeterminate = function () {
                icon.innerHTML = svg || `<svg class="nimo-progress-circular nimo-progress-circular--indeterminate"><circle class="nimo-progress-circular__background"/><circle class="nimo-progress-circular__primary nimo-progress-circular--indeterminate__primary"/><circle class="nimo-progress-circular__secondary nimo-progress-circular--indeterminate__secondary"/></svg>`
                return append(elm)
            }
            this.progress = function () {
                icon.setAttribute('progress')
                icon.innerHTML = `<svg class="nimo-progress-circular"><circle class="nimo-progress-circular__background" /><circle class="nimo-progress-circular__primary" style="stroke-dasharray: 0%, 251.32%" /></svg>`
                return append(elm)
            }
        },
        initAction = function (type, t) {
            return function (text, max) {
                var elm = new InitElement(text)[type]();
                if (foo.busy) {
                    items.push = items.__proto__.push
                } else {
                    items.push = push
                }
                var val = new Progress(type, max);
                val.__proto__ = {
                    node: elm
                }
                val.__proto__.index = items.length;
                items.push([type, arguments, elm, [], val])
                log.push([val, elm])
                val.__proto__.__proto__ = t;
                Object.freeze(val.__proto__)
                return val;
            }
        },

        Progress = function (type, config) {
            if ('number' === typeof config) {
                config = {
                    max: config
                }
            } else if (config instanceof Object) {
                //
            } else {
                config = {}
            }
            config.__proto__ = {
                max: 100,
                autoclear: true
            }
            config.max = Number(config.max) || config.__proto__.max
            this.clear = function () {
                if (!this.node.isConnected) {
                    if (items[this.index]) {
                        items[this.index][3].push('clear')
                    }
                    return;
                }
                var node = this.node.host;
                node.setAttribute('clear', 'true');
                delete log[this.index];
                node.removeAttribute('clear');
                var i = this.index;
                setTimeout(function () {
                    node.remove();
                    setTimeout(function () {
                        foo.busy = false
                        for (i; i < items.length; i++) {
                            if (items[i]) {
                                var d = items[i]
                                delete items[i]
                                push(d)
                                break;
                            }
                        }
                    }, 500);
                }, 500)
            }
            var text = function (inc) {
                text.text = ''
                return function (txt) {
                    var elm = this.node.querySelector('nimo-loader-body nimo-loader-text')
                    if (!text.text) {
                        text.text = elm.innerText;
                    }
                    if (inc) {
                        txt = text.text + txt;
                    } else {
                        txt = toValidText(txt)
                        text.text = txt
                    }
                    elm.innerText = txt;
                }
            }
            this.insertTitle = text(true)
            this.updateTitle = text(false)
            if (type === 'progress') {
                var value = function (inc) {
                    if (inc) {
                        value.num = 0
                    }
                    return function (num) {
                        var _t = this
                        num = Number(num) || 0;
                        if (inc) {
                            value.num = num = value.num + num
                        }

                        var prog = factor_invert(num, config.max, 100)
                        num = factor_invert(num, config.max, main)

                        var elm = this.node.querySelector('nimo-loader-body nimo-loader-icon svg .nimo-progress-circular__primary')
                        if (elm) {
                            elm.style.strokeDasharray = `${num}%, ${main}%`
                        }
                        var m = function (i) {
                            Immediate(function () {
                                if ('function' === typeof _t.onprogress) {
                                    _t.onprogress(Number(i.toFixed(1)), _t);
                                }
                            }, 0)
                        }

                        // var oldProg = this.progress
                        // if (condition) {
                        //    for (var i = oldProg; prog >= i; i++) {
                        m(prog)
                        // }
                        // }
                        this.progress = prog
                        setTimeout(function () {
                            if (prog >= 100) {
                                if ('function' === typeof _t.oncomplete) {
                                    _t.oncomplete(_t);
                                }
                                if (config.autoclear) {
                                    _t.clear()
                                }
                            }
                        }, 1000);
                    }
                }
                this.insertValue = value(true)
                this.updateValue = value(false)
                this.max = function (num) {
                    num = Number(num) || config.__proto__.max;
                    config.max = num
                    return num
                }
                this.oncomplete = null
                this.onprogress = null
                this.progress = new Number(0)
            }
            this.onload = null
        },
        push = function (argument) {
            foo.busy = true
            var name = argument[0],
                elm = argument[2],
                actions = argument[3],
                val = argument[4],
                argument = argument[1];
            var text = argument[0]
            append.init(elm)
            items.length += 1;
            Immediate(function () {
                if ('function' === typeof val.onload) {
                    val.onload(val)
                }
            }, 0)
            for (var i = 0; i < actions.length; i++) {
                var d = actions[i];
                val[d]()
            }
        }

    FakeArray.push = function (e) {
        this[this.length] = e
        this.length += 1;
        return this.length - 1
    }
    FakeArray.pop = function (e) {
        delete this[this.length -= 1]
        return this.length
    }
    var log = new FakeArray(),
        items = new FakeArray(),
        queue = [];

    append.init = function (elm) {
        elm = elm.host
        //document.documentElement.setAttribute('nimo-loader-is-active', 'true')
        document.documentElement.appendChild(elm)
    }


    function NimoLoader() {
        var _t = this
        this.clear = function (i) {
            if (i instanceof Object && i.index instanceof Number) {
                i = Number(i.index)
            }
            var e = log[i]
            e[0].clear()
            delete log[i];
        }
        this.indeterminate = initAction('indeterminate', this)
        this.progress = initAction('progress', this)
    }

    foo.style = `
    <style>
nimo-loader-cover[clear=true] {
    opacity: 0;
}

[nimo-loader-is-active=true] {
    pointer-events: none;
}

nimo-loader-cover {
    position: fixed;
    z-index: 9999999;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
}

nimo-loader-body {
    background: white;
    display: flex;
    align-items: center;
    flex-direction: row;
    border-radius: 8px;
    padding: 12px 18px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    -ms-border-radius: 8px;
    -o-border-radius: 8px;
    box-shadow: 0px 0px 6px -5px;
}

nimo-loader-text {
    overflow: hidden;
    text-overflow: ellipsis;
    color: #000000;
    margin-right: 20px;
    width: 220px;
    display: block;
    font-weight: 400;
    font-size: 14px;
    font-family: sans-serif;
    /* text-transform: capitalize; */
}

nimo-loader-icon {
    display: flex;
    width: 50px;
    height: 50px;
    align-items: center;
    /*stroke-width: 1px;*/
    stroke: currentColor;
    justify-content: flex-end;
}

ons-toolbar {
    z-index: 0;
}

.nimo-progress-circular {
    height: 35px;
    position: relative;
    width: 35px;
    transform: rotate(270deg);
    animation: none;
}

.nimo-progress-circular__background, .nimo-progress-circular__primary, .nimo-progress-circular__secondary {
    /*clean-cssignore:;     start*/
    cx: 50%;
    cy: 50%;
    r: 40%;
    /*clean-cssignore:;     end*/
    animation: none;
    fill: none;
    /*stroke-width: 5%;     */
    stroke-miterlimit: 10;
    -webkit-animation: none;
}

.nimo-progress-circular__background {
    /* transparent */
    /* stroke: var(--progress-circle-background-color); */
    opacity: 0;
}

nimo-loader-icon[progress] .nimo-progress-circular__background {
    opacity: 0.3;
}

.nimo-progress-circular__primary {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    /* --color-primary */
    /* stroke: var(--progress-circle-primary-color); */
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.nimo-progress-circular__secondary {
    /*  opec --color-primary */
    /* stroke: var(--progress-circle-secondary-color); */
    opacity: 0.5;
}

.nimo-progress-circular--indeterminate {
    animation: nimo-progress__rotate 2s linear infinite;
    transform: none;
    -webkit-animation: nimo-progress__rotate 2s linear infinite;
}

.nimo-progress-circular--indeterminate__primary {
    animation: nimo-progress__dash 1.5s ease-in-out infinite;
    -webkit-animation: nimo-progress__dash 1.5s ease-in-out infinite;
}

.nimo-progress-circular--indeterminate__secondary {
    display: none;
}

@keyframes nimo-progress__rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes nimo-progress__dash {
    0% {
        stroke-dasharray: 10%, 241.32%;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 201%, 50.322%;
        stroke-dashoffset: -100%;
    }

    100% {
        stroke-dasharray: 10%, 241.32%;
        stroke-dashoffset: -251.32%;
    }
}

</style>
    `;
    window.NimoProgress = NimoLoader
})();


/*** uncomment the following code ***/
// new NimoProgress().progress('saving file...', 100).onload = function (d) {
//     d.indeterminate('re-rendering items...').onload=function (d) {}
//     d.insertTitle(` (0/100%)`)
//     d.onprogress = function (e) {
//         d.insertTitle(` (${e}/100%)`)
//     }
//     d.oncomplete = function () {
//         d.updateTitle('done...')
//     }
//     d.insertValue(10)
//     setTimeout(() => { d.insertValue(2), setTimeout(() => { d.insertValue(15), setTimeout(() => { d.insertValue(40), setTimeout(() => { d.insertValue(13), setTimeout(() => { d.insertValue(20) }, 1e3) }, 1e3) }, 1e3) }, 1e3) }, 1000);
// }