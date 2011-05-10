
/**
* Eternal Slider. This is similar to many sliders around the internet,
* however, this one always scrolls to the right, whereas, most of the
* one's I've run into scroll backwards to the beginning after the last
* item is reached.
*
* @copyright    ©2011 Cameron Eure. All rights reserved.
* @license      BSD
**/

/**
Usage:

<div id="banner">
    <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
    </ul>
</div>

var slider = new eternalSlider({
    'path':         '#banner',  // Path to div
    'interval':     4000,       // Interval for setTimeout
    'length':       1500,       // Animation length
    'next':         '.nextBtn', // Path to next button(s)
    'previous':     '.prevBtn'  // Path to previous button(s)
});

slider.go();

**/
function eternalSlider(params) {
    var parent = this;
    this.params = {};

    this.setVar('path', '#banner');         // Path
    this.setVar('interval', 4000);          // Timeout interval
    this.setVar('length', 1500);            // Animation length
    this.setVar('next', '.nextBtn');        // Next buttons
    this.setVar('previous', '.prevBtn');    // Previous buttons

    var k;
    for (k in params) {
        if (params.hasOwnProperty(k)) {
            this.setVar(k, params[k]);
        }
    }

    this.looping = true;
    this.cached_path = $(this.getVar('path'));
    this.elements = [];
    this.current = 0;

    // Get width / height
    this.width = $('li', $(this.cached_path)).width();
    this.height = $('li', $(this.cached_path)).height();

    // Get number of elements
    this.nElements = $('li', $(this.cached_path)).length;
                    
    // Set ul width
    $('ul', $(this.cached_path)).width(this.width * 2);

    // Hide overflow
    $(this.cached_path).css('overflow', 'hidden');

    // Copy HTML into self
    $('li', $(this.cached_path)).each(function() {
        parent.elements.push([$(this).html(), $(this).attr('class')]);
        $(this).remove();
    });

    // Create new li's
    this.slot1 = $('<li/>').css('float', 'left');
    this.slot2 = $('<li/>').css('float', 'left');
    
    // Append
    $('ul', $(this.cached_path)).append(this.slot1).append(this.slot2);

    // Load first slot
    this.setFirstSlot(0);
    this.buttonEvents();
}

eternalSlider.prototype.setVar = function(k, v) {
    this.params[k] = v;
};

eternalSlider.prototype.getVar = function(k) {
    if (this.params.hasOwnProperty(k)) {
        return this.params[k];
    }
    return undefined;
};

eternalSlider.prototype.setFirstSlot = function(index, inst) {
    if (typeof(inst) !== 'object') {
        inst = this;
    }

    $(inst.slot1).removeClass();
    $(inst.slot1).addClass(inst.elements[index][1]);
    $(inst.slot1).html(inst.elements[index][0]);
};

eternalSlider.prototype.setSecondSlot = function(index, inst) {
    if (typeof(inst) !== 'object') {
        inst = this;
    }

    $(inst.slot2).removeClass();
    $(inst.slot2).addClass(inst.elements[index][1]);
    $(inst.slot2).html(inst.elements[index][0]);
};

eternalSlider.prototype.setVisibleSlot = function(slot) {
    slot--;
    $('ul', $(this.cached_path)).css('margin-left', '-' + (this.width * slot) + 'px');
};

eternalSlider.prototype.getNextSlot = function(inst) {
    if (typeof(inst) !== 'object') {
        inst = this;
    }

    var c = inst.current;
    c++;
    if (c >= inst.nElements) {
        c = 0;
    }
    return c;
};

eternalSlider.prototype.getPreviousSlot = function(inst) {
    if (typeof(inst) !== 'object') {
        inst = this;
    }

    var c = inst.current;
    c--;
    if (c <= 0) {
        c = inst.nElements;
        c--;
    }
    return c;
};

eternalSlider.prototype.next = function() {
    var parent = this;
    this.current = this.getNextSlot();
    this.setSecondSlot(this.current);

    $('ul', $(this.cached_path)).animate({
        'marginLeft': '-' + this.width + 'px'
    }, this.getVar('length'), function() {
        parent.setFirstSlot(parent.current);
        parent.setVisibleSlot(1);
        parent.buttonEvents();
    });
};

eternalSlider.prototype.previous = function() {
    var parent = this;

    this.setSecondSlot(this.current);
    this.setVisibleSlot(2);
    
    this.current = this.getPreviousSlot();
    this.setFirstSlot(this.current);
    
    $('ul', $(this.cached_path)).animate({
        'marginLeft': '0px'
    }, this.getVar('length'), function() {
        parent.buttonEvents();
    });
};

eternalSlider.prototype.clickNext = function(inst) {
    if (typeof(inst) !== 'object') {
        inst = this;
    }
    
    inst.looping = false;
    inst.next();
};

eternalSlider.prototype.clickPrev = function(inst) {
    if (typeof(inst) !== 'object') {
        inst = this;
    }
    
    inst.looping = false;
    inst.previous();
};

eternalSlider.prototype.buttonEvents = function(inst) {
    if (inst !== 'object') {
        inst = this;
    }
    
    $(inst.getVar('next')).click(function() {inst.clickNext(inst);});
    $(inst.getVar('previous')).click(function() {inst.clickPrev(inst);});
};

eternalSlider.prototype.go = function(inst) {
    if (inst !== 'object') {
        inst = this;
    }
    
    if (!inst.looping) {
        return;
    }
    
    setTimeout(function() {
        if (!inst.looping) {
            return;
        }
        
        inst.next();
        inst.go(inst);
    }, inst.getVar('interval'));
};
