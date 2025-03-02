function Sim(sldrRoot) {
    this.sldrRoot = sldrRoot;

    // Carousel objects
    this.sldrList = this.sldrRoot.querySelector('.sim-slider-list');
    this.sldrElements = this.sldrList.querySelectorAll('.sim-slider-element');
    this.sldrElemFirst = this.sldrList.querySelector('.sim-slider-element');
    this.leftArrow = this.sldrRoot.querySelector('.sim-slider-arrow-left');
    this.rightArrow = this.sldrRoot.querySelector('.sim-slider-arrow-right');
    this.indicatorDots = this.sldrRoot.querySelector('.sim-slider-dots');

    // Initialization
    this.options = Sim.defaults;
    Sim.initialize(this);
}

Sim.defaults = {
    loop: true,
    auto: true,
    interval: 5000,
    arrows: true,
    dots: true
};

Sim.prototype.elemPrev = function(num) {
    num = num || 1;

    let prevElement = this.currentElement;
    this.currentElement -= num;
    if (this.currentElement < 0) this.currentElement = this.elemCount - 1;

    this.sldrElements[this.currentElement].style.opacity = '1';
    this.sldrElements[prevElement].style.opacity = '0';

    if (this.options.dots) {
        this.dotOn(prevElement);
        this.dotOff(this.currentElement);
    }
};

Sim.prototype.elemNext = function(num) {
    num = num || 1;

    let prevElement = this.currentElement;
    this.currentElement += num;
    if (this.currentElement >= this.elemCount) this.currentElement = 0;

    this.sldrElements[this.currentElement].style.opacity = '1';
    this.sldrElements[prevElement].style.opacity = '0';

    if (this.options.dots) {
        this.dotOn(prevElement);
        this.dotOff(this.currentElement);
    }
};

Sim.prototype.dotOn = function(num) {
    this.indicatorDotsAll[num].style.cssText = 'background-color:#BBB; cursor:pointer;';
};

Sim.prototype.dotOff = function(num) {
    this.indicatorDotsAll[num].style.cssText = 'background-color:#556; cursor:default;';
};

Sim.initialize = function(that) {
    that.elemCount = that.sldrElements.length;
    that.currentElement = 0;
    let bgTime = Date.now();

    function setAutoScroll() {
        that.autoScroll = setInterval(function () {
            let fnTime = Date.now();
            if (fnTime - bgTime + 10 > that.options.interval) {
                bgTime = fnTime;
                that.elemNext();
            }
        }, that.options.interval);
    }

    if (that.elemCount >= 1) {
        that.sldrElemFirst.style.opacity = '1';
    }

    if (that.options.auto) {
        setAutoScroll();
        that.sldrList.addEventListener('mouseenter', function () { clearInterval(that.autoScroll); }, false);
        that.sldrList.addEventListener('mouseleave', setAutoScroll, false);
    }

    if (that.options.arrows) {
        that.leftArrow.addEventListener('click', function () {
            let fnTime = Date.now();
            if (fnTime - bgTime > 1000) {
                bgTime = fnTime;
                that.elemPrev();
            }
        }, false);
        that.rightArrow.addEventListener('click', function () {
            let fnTime = Date.now();
            if (fnTime - bgTime > 1000) {
                bgTime = fnTime;
                that.elemNext();
            }
        }, false);
    } else {
        that.leftArrow.style.display = 'none';
        that.rightArrow.style.display = 'none';
    }

    if (that.options.dots) {
        let sum = '';
        for (let i = 0; i < that.elemCount; i++) {
            sum += '<span class="sim-dot"></span>';
        }
        that.indicatorDots.innerHTML = sum;
        that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.sim-dot');

        that.indicatorDotsAll.forEach((dot, n) => {
            dot.addEventListener('click', function () {
                let diffNum = Math.abs(n - that.currentElement);
                if (n < that.currentElement) {
                    bgTime = Date.now();
                    that.elemPrev(diffNum);
                } else if (n > that.currentElement) {
                    bgTime = Date.now();
                    that.elemNext(diffNum);
                }
            }, false);
        });

        that.dotOff(0);
        for (let i = 1; i < that.elemCount; i++) {
            that.dotOn(i);
        }
    }
};

// Инициализация всех слайдеров на странице
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sim-slider').forEach(slider => new Sim(slider));
});
