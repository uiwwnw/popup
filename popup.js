var Popup = (function (Popup) {
    var options = [],
        option = {
            animation: true,
            classNameArea: 'popup',
            classNameBox: 'popup--box',
            classNameHeader: 'popup--header',
            classNameContainer: 'popup--container',
            classNameContent: 'popup--content',
            classNameFooter: 'popup--footer',
            classNameDim: 'popup--dim',

            classNameButtonClose: 'popup--button__close',
            classNameButtonCancel: 'popup--button__cancel',
            classNameButtonConfirm: 'popup--button__confirm',

            styleBoxWidth: 'auto',
            styleBoxHeight: 'auto',
            styleBoxHorizonMargin: 80,
            styleBoxVerticalMargin: 80,
            styleBoxShadow: 5,

            styleHeaderHeight: 30,
            styleHeaderBorderWidth: 1,
            styleHeaderBorderColor: '#ddd',
            styleHeaderVerticalMargin: 8,
            styleHeaderHorizonMargin: 10,
            styleHeaderTextAlign: 'left',

            styleContentHeight: 'auto',
            styleContentVerticalMargin: 8,
            styleContentHorizonMargin: 10,
            styleContentTextAlign: 'center',

            styleFooterHeight: 30,
            styleFooterBorderWidth: 1,
            styleFooterBorderColor: '#ddd',
            styleFooterVerticalMargin: 8,
            styleFooterHorizonMargin: 10,
            styleFooterTextAlign: 'left',
            styleFooterButtonBorderWidth: 1,
            styleFooterButtonBorderColor: '#ddd',

            styleButtonCloseSize: 20
        },
        contents = {
            textHeader: 'Notice',
            textContent: '',
            textConfirm: '',
            textCancel: ''
        },
        fn = {
            fnConfirm: function () { },
            fnCancel: function () { }
        };

    function assign(x, y) {
        var _option = {};
        for (var a of Object.keys(x)) {
            if (y[a]) {
                _option[a] = y[a];
            } else {
                _option[a] = x[a];
            }
        }
        return _option;
    }
    function equals(x, y) {
        if (x === y) return true;
        if (!(x instanceof Object) || !(y instanceof Object)) return false;

        if (x.constructor !== y.constructor) return false;

        for (var p in x) {
            if (!x.hasOwnProperty(p)) continue;
            x.constructor === y.constructor
            if (!y.hasOwnProperty(p)) return false;

            if (x[p] === y[p]) continue;
            if (typeof (x[p]) !== "object") return false;
            if (!equals(x[p], y[p])) return false;
        }

        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        }
        return true;
    }

    function makeElement() {
        var body = document.body,
            template = document.createElement('template'),
            html = `
                <div id="${this.id}" js-ref="${this.selector}" class="${this.option.classNameArea}">
                    <div class="${this.option.classNameBox}">
                        <button class="${this.option.classNameButtonClose}">팝업닫기</button>
                        <div class="${this.option.classNameHeader}"></div>
                        <div class="${this.option.classNameFooter}"><button class="${this.option.classNameButtonConfirm}">${this.contents.textConfirm}</button><button class="${this.option.classNameButtonCancel}">${this.contents.textCancel}</button></div>
                        <div class="${this.option.classNameContainer}">
                            <div class="${this.option.classNameContent}"></div>
                        </div>
                    </div>
                    <i class="${this.option.classNameDim}"></i>
                </div>
            `;
        template.innerHTML = html;
        body.append(template.content.cloneNode(true));
        this.elementPopup = document.querySelector(`div[js-ref="${this.selector}"]`);
        this.elementClose = this.elementPopup.querySelector(`.${this.option.classNameButtonClose}`);
        this.elementCancel = this.elementPopup.querySelector(`.${this.option.classNameButtonCancel}`);
        this.elementConfirm = this.elementPopup.querySelector(`.${this.option.classNameButtonConfirm}`);
        this.elementHeader = this.elementPopup.querySelector(`.${this.option.classNameHeader}`);
        this.elementContent = this.elementPopup.querySelector(`.${this.option.classNameContent}`);
        this.elementBox = this.elementPopup.querySelector(`.${this.option.classNameBox}`);
        this.elementDim = this.elementPopup.querySelector(`.${this.option.classNameDim}`);
    }

    function makeStyle(scoped) {
        var body = document.body,
            template = document.createElement('template'),
            scoped = scoped ? `[js-ref="${scoped}"]` : '',
            html = `
                <style js-ref="${this.selector}">
                    ${scoped}.${this.option.classNameArea} {
                        z-index: 1000;
                        position: fixed;
                        display: none;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        align-items: center;
                    }
                    ${scoped} .${this.option.classNameBox} {
                        position: relative;
                        margin: auto;
                        background: #fff;
                        animation: open-box ${this.option.animation ? '.3' : '0'}s;
                    }
                    ${scoped} .${this.option.classNameHeader} {
                        position: absolute;
                        left: 0;
                        top: 0;
                        overflow: hidden;
                        width: 100%;
                        height: ${this.option.styleHeaderHeight}px;
                        padding: ${this.option.styleHeaderVerticalMargin}px ${this.option.styleHeaderHorizonMargin}px; 
                        text-align: ${this.option.styleHeaderTextAlign};
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        line-height: ${this.option.styleHeaderHeight - (this.option.styleHeaderVerticalMargin * 2)}px;
                        box-sizing: border-box;
                        border-bottom: ${this.option.styleHeaderBorderWidth}px solid ${this.option.styleHeaderBorderColor};
                        box-shadow: 0 0 ${this.option.styleBoxShadow}px rgba(0,0,0,0.3);
                        background: #fff;
                    }
                    ${scoped} .${this.option.classNameHeader}:empty {
                        display: none;
                    }
                    ${scoped} .${this.option.classNameHeader}:empty ~ .${this.option.classNameContainer} {
                        margin-top: 0;
                    }
                    ${scoped} .${this.option.classNameFooter}:empty + .${this.option.classNameContainer} {
                        margin-bottom: 0;
                    }
                    ${scoped} .${this.option.classNameFooter} {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        display: flex;
                        width: 100%;
                        text-align: ${this.option.styleFooterTextAlign};
                        line-height: ${this.option.styleFooterHeight - (this.option.styleFooterVerticalMargin * 2)}px;
                        box-sizing: border-box;
                        border-top: ${this.option.styleFooterBorderWidth}px solid ${this.option.styleFooterBorderColor};
                        box-shadow: 0 0 ${this.option.styleBoxShadow}px rgba(0,0,0,0.3);
                        background: #fff;
                    }
                    ${scoped} .${this.option.classNameFooter}:after {
                        position: absolute;
                        left: 0;
                        bottom: 100%;
                        width: 100%;
                        height: ${this.option.styleBoxShadow}px;
                        margin-bottom: ${this.option.styleFooterBorderWidth}px;
                        background: #fff;
                        content: '';
                    }
                    ${scoped} .${this.option.classNameContainer} {
                        overflow-y: auto;
                        max-width: calc(100vw - ${this.option.styleBoxHorizonMargin}px);
                        max-height: calc(100vh - ${this.option.styleBoxVerticalMargin - (this.option.styleHeaderHeight / 2) + this.option.styleFooterHeight}px);
                        min-width: 200px;
                        width: ${this.option.styleBoxWidth === 'auto' ? 'auto' : this.option.styleBoxWidth + 'px'};
                        height: ${this.option.styleBoxHeight === 'auto' ? 'auto' : this.option.styleBoxHeight + 'px'};
                        margin-top: ${this.option.styleHeaderHeight}px;
                        margin-bottom: ${this.option.styleFooterHeight}px;
                        box-shadow: 0 0 ${this.option.styleBoxShadow}px rgba(0,0,0,0.3);
                    }
                    ${scoped} .${this.option.classNameContainer}:after {
                        position: absolute;
                        left: 0;
                        top: ${this.option.styleHeaderHeight}px;
                        width: 100%;
                        height: ${this.option.styleBoxShadow}px;
                        background: #fff;
                        content: '';
                    }
                    ${scoped} .${this.option.classNameContent} {
                        z-index: 2;
                        position: relative;
                        height: ${this.option.styleContentHeight === 'auto' ? 'auto' : this.option.styleContentHeight + 'px'};
                        padding: ${this.option.styleContentVerticalMargin}px ${this.option.styleContentHorizonMargin}px;
                        text-align: ${this.option.styleContentTextAlign};
                    }
                    ${scoped} .${this.option.classNameContent}:empty:before {
                        content: 'no content';
                    }
                    ${scoped} .${this.option.classNameDim} {
                        z-index: -1;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        opacity: .3;
                        background: #000;
                        animation: open-dim ${this.option.animation ? '1' : '0'}s;
                    }

                    ${scoped} .${this.option.classNameButtonClose} {
                        z-index: 3;
                        position: absolute;
                        bottom: 100%;
                        left: 100%;
                        width: ${this.option.styleButtonCloseSize}px;
                        height: ${this.option.styleButtonCloseSize}px;
                        margin: -${this.option.styleButtonCloseSize / 2}px;
                        padding: 0;
                        text-align: center;
                        font-size: 0;
                        box-shadow: 0 0 ${this.option.styleBoxShadow}px rgba(0,0,0,0.5);
                        border: none;
                        border-radius: 50%;
                    }
                    ${scoped} .${this.option.classNameButtonClose}:before {
                        font-size: ${this.option.styleButtonCloseSize}px;
                        line-height: ${this.option.styleButtonCloseSize}px;
                        content: '\\d7';
                    }
                    ${scoped} .${this.option.classNameButtonCancel} {
                        z-index: 2;
                        position: relative;
                        flex: 1;
                        height: ${this.option.styleFooterHeight}px;
                        border: 0;
                        border-left: ${this.option.styleFooterButtonBorderWidth}px solid ${this.option.styleFooterButtonBorderColor};
                        background: 0;
                    }
                    ${scoped} .${this.option.classNameButtonCancel}:empty {
                        display: none;
                    }
                    ${scoped} .${this.option.classNameButtonConfirm} {
                        z-index: 2;
                        position: relative;
                        flex: 1;
                        height: ${this.option.styleFooterHeight}px;
                        border: 0;
                        background: 0;
                    }
                    ${scoped} .${this.option.classNameButtonConfirm}:empty {
                        display: none;
                    }
                    @keyframes open-dim {
                        0% {
                            opacity: 0;
                        }
                        100% {
                            opacity: .3;
                        }
                    }
                    @keyframes open-box {
                        0% {
                            transform: scale(.5);
                        }
                        40% {
                            transform: scale(1.2);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                    @keyframes close-dim {
                        0% {
                            opacity: .3;
                        }
                        30% {
                            opacity: 0;
                        }
                        100% {
                            opacity: 0;
                        }
                    }
                    @keyframes close-box {
                        0% {
                            transform: scale(1);
                        }
                        5% {
                            transform: scale(1.2);
                        }
                        30% {
                            transform: scale(0);
                        }
                        100% {
                            transform: scale(0);
                        }
                    }
                </style>
                
            `;
        options.push(this.option);
        template.innerHTML = html;
        body.append(template.content.cloneNode(true));
        this.style = document.querySelector(`style[js-ref="${this.selector}"]`)
    }

    function adapterMakeTemplate() {
        (document.querySelector(`div[js-ref="${this.selector}"]`) === null) && (makeElement.call(this));
        var i = options.length;

        if (i === 0) {
            makeStyle.call(this);
        } else {
            while (i--) {
                if (!equals(this.option, options[i])) {
                    makeStyle.call(this, this.selector);
                }
            }
        }
    }

    function makeId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function Popup(arg) {
        this.id = arg.id;
        this.selector = makeId();
        this.option = assign(option, arg);
        this.contents = assign(contents, arg);
        this.fn = assign(fn, arg);
        this.template = adapterMakeTemplate.call(this);
    }

    function event(arg) {
        this.elementClose.onclick = this.close.bind(this);
        if (this.elementCancel.innerText) {
            this.elementCancel.onclick = ((arg) && ((arg.fnCancel) && arg.fnCancel.bind(this))) || this.fn.fnCancel.bind(this);
        } else {
            this.elementCancel.remove();
        }
        if(this.elementConfirm.innerText) {
            this.elementConfirm.onclick = ((arg) && ((arg.fnConfirm) && arg.fnConfirm.bind(this))) || this.fn.fnConfirm.bind(this);
        }else {
            this.elementConfirm.remove();
        }
        
        
    }

    Popup.prototype.open = function (arg) {
        arg = arg ? arg : {};
        this.elementHeader.innerText = (arg.textHeader) || this.contents.textHeader;
        this.elementContent.innerHTML = (arg.textContent) || this.contents.textContent;
        this.elementConfirm.innerText = (arg.textConfirm) || this.contents.textConfirm;
        this.elementCancel.innerText = (arg.textCancel) || this.contents.textCancel;
        this.elementPopup.style.display = 'flex';
        event.call(this, arg);
    }

    Popup.prototype.close = function () {
        if(this.option.animation) {
            var _this = this;
            this.elementDim.style.animation = 'close-dim 1s';
            this.elementBox.style.animation = 'close-box 1s';
            clearTimeout(this.sto);
            this.sto = setTimeout(function(){
                _this.elementBox.style.animation = '';
                _this.elementDim.style.animation = '';
                _this.elementPopup.style.display = 'none';
            }, 300);
        } else {
            this.elementPopup.style.display = 'none';
        }
    }

    Popup.prototype.remove = function () {
        this.elementPopup.remove();
        this.style.remove();
    }

    return Popup;
}(Popup || {}));
var a = new Popup({
    id: 'a',
    styleBoxWidth: 400,
    textHeader: 'aaa',
    textContent: '<h1>dwdw</h1>',
    textConfirm: 'ds',
    fnConfirm: function() {
        this.close();
        b.open();
    },
});
var b = new Popup({
    id: 'b',
});
a.open({
    textHeader: 'dadawdwadawdawd',
    textContent: 'dasdad',
    textConfirm: 'dasd',
    textCancel: ' '
});