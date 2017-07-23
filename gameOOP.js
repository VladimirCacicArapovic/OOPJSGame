/**
 * Created by Vladimir on 21/07/2017.
 * Example of simple OOP javascript game
 *  Click on start button and discover your lucky numbers :)
 *
 */

var rangeColorCreateElement = document.getElementById("bollNumber");
var rangeColorCreateExtraElement = document.getElementById("bollExtraNumber");

var fromElement = document.getElementById("from");
var toElement = document.getElementById("to");
var historyElement =  document.getElementById("history");

//Main object
function Main() {
    this.countBolls = 6;
    this.from = 1;
    this.extraCountBolls = 1;
    this.defaultColor = '#cccccc';
    this.to = 49;
    this.bollsSelection = [
        {range: [1, 9], color: '#008000'},
        {range: [10, 19], color: '#ffc0cb'},
        {range: [20, 29], color: '#0000ff'},
        {range: [30, 39], color: '#ffa500'},
        {range: [40, 49], color: '#000000'}
    ];
    this.valueArray = [];
    this.extraArray = [];
    this.mainArray = [];



}



var mainObj = new Main();


/**
 * Adding Listeners and populating fields on load
 */
Main.prototype.populatePage=function(){
    rangeColorCreateElement.value = this.countBolls;
    rangeColorCreateElement.addEventListener('change',function (ref) {
        mainObj.countBolls = parseInt(ref.target.value);
    });

    rangeColorCreateExtraElement.value = this.extraCountBolls;
    rangeColorCreateExtraElement.addEventListener('change',function (ref) {
        mainObj.extraCountBolls = parseInt(ref.target.value);
    });

    fromElement.value = this.from;
    fromElement.addEventListener('change',function (ref) {
        mainObj.from = parseInt(ref.target.value);
    });
    toElement.value = this.to;
    toElement.addEventListener('change',function (ref) {
        mainObj.to = parseInt(ref.target.value);
    })
    toElement.addEventListener('change',function (ref) {
        mainObj.to = parseInt(ref.target.value);
    })


};

/**
 * Adding colors
 * @param ref color picker field
 */
Main.prototype.colorListener = function (ref) {
    var getIndex = parseInt(ref.target.getAttribute('data-index'));
    mainObj.bollsSelection[getIndex].color = ref.target.value;
};

/**
 * Creating range color pickers
 */
Main.prototype.rangeColorCreate = function () {
    var rangeColorCreateElement = document.getElementById("rangeColor"),
        createFragment = document.createDocumentFragment();

    for (var i = 0; i < this.bollsSelection.length; i++) {
        var inputDiv = document.createElement('div');
        var inputColor = document.createElement('input');
        var inputText= document.createElement('p');
        inputDiv.style.float = 'left';
        inputDiv.style.textAlign = 'center';
        inputText.innerHTML = this.bollsSelection[i].range[0] +'-'+  this.bollsSelection[i].range[1];
        inputDiv.appendChild(inputText);

        inputColor.setAttribute("type", "color");
        inputColor.value = this.bollsSelection[i].color;
        inputColor.className = 'color';
        inputColor.setAttribute("data-index", i);
        inputColor.addEventListener('change',this.colorListener);
        inputDiv.appendChild(inputColor);
        createFragment.appendChild(inputDiv)

    }
    rangeColorCreateElement.appendChild(createFragment);
};

/**
 * Creating random numbers and adding them to array
 * @param min
 * @param max
 * @param times
 * @param extra
 * @returns {Array}
 * @constructor
 */
Main.prototype.RandomIntFromInterval = function (min, max, times,extra) {

    while (this.valueArray.length < times || this.extraArray.length < extra ) {
        var randomNumberMain = Math.floor(Math.random() * (max - min + 1) + min);
        var randomNumberExtra = Math.floor(Math.random() * (max - min + 1) + min);

        // Calculating normal numbers
        if(this.valueArray.length < times){
            if (this.valueArray.indexOf(randomNumberMain) == -1) {
                this.valueArray.push(randomNumberMain);
            }
        }
        // Calculating extra numbers
        if(this.extraArray.length < extra && this.valueArray.length === times){
            if (this.valueArray.indexOf(randomNumberExtra) == -1) {
                this.extraArray.push(randomNumberExtra)
            }
        }

    }
    this.mainArray.push({mainNumbers : this.valueArray, extraNumbers : this.extraArray});
    // Clearing arrays
    this.valueArray = [];
    this.extraArray = [];
};

/**
 * Bolls selecting Colors
 */
Main.prototype.colorsChange = function (number) {
    for (var i = 0; i < this.bollsSelection.length; i++) {
        if ((number >= this.bollsSelection[i].range[0] && number <= this.bollsSelection[i].range[1])) {
            return this.bollsSelection[i].color
        }
    }
    //Default color if is out of range
    return this.defaultColor;
};

/**
 * Removing child on every start
 */
Main.prototype.removeChild = function (div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

// History show
Main.prototype.historyShow = function() {
    var lengthArray = this.mainArray.length,
        historyDivMain,
        createFragment = document.createDocumentFragment();
    // Showing last 3 rolls
    if(lengthArray>=4){
        //removing childs for re-rendering
        this.removeChild(historyElement);
        while(lengthArray-1 >= this.mainArray.length-3){
            historyDivMain = document.createElement('div');
            historyDivMain.innerHTML = 'Main numbers:'+this.mainArray[lengthArray-2].mainNumbers+' -' +
                ' Extra Numbers: '+this.mainArray[lengthArray-2].extraNumbers;
            lengthArray--;
            createFragment.appendChild(historyDivMain)
        }
        // Rendering all element fragments in on go
        historyElement.appendChild(createFragment)
    }

};

/**
 *  Showing bolls on the screen
 * @param numbers
 */
Main.prototype.showNumbers = function (numbers,bollType) {
    var info = document.getElementById("info"),
        numbLength = numbers.length,
        createFragment = document.createDocumentFragment(),
        number;

        info.style.clear = 'both';

    for (var i = 0; i < numbLength; i++) {
        var color = this.colorsChange(numbers[i]);
        // Creating and showing bolls
        number = document.createElement('div');
        number.innerHTML = numbers[i];
        number.style.background = color;
        number.className = bollType ? 'extraBoll' : 'mainBoll';
        createFragment.appendChild(number);
    }
    //Rendering all numbers in on go
    info.appendChild(createFragment);

};

/**
 * Just simple Callback function (not needed but to show that i know callbacks :))
 * validating if fields are in good state
 * @param from - Starting position
 * @param to   - ending position
 * @param callback - String/empty
 * @returns {*}
 */
Main.prototype.validator = function(from, to, callback) {
    var from = parseInt(from),
        to = parseInt(to);

    if(from > to ){
        return callback('Range From is bigger then Range To');
    }else if(to < from){
       return callback('Range To is bigger then range To');
    }
    return callback('');
};

/**
 * Starting spin function
 */
function spin() {
    var info = document.getElementById("info");
    var rangeColor = document.getElementById("rangeColor"),
        sortNum,
        sortNumExtra;
    //Callback validation
    mainObj.validator(fromElement.value,toElement.value,function (ref) {
        if(ref !==''){
            alert(ref)
        }else {
            mainObj.removeChild(info);
             mainObj.RandomIntFromInterval(parseInt(fromElement.value), parseInt(toElement.value), parseInt(rangeColorCreateElement.value), parseInt(rangeColorCreateExtraElement.value));
            sortNum = mainObj.mainArray[mainObj.mainArray.length-1].mainNumbers.sort(function (a, b) {
                return a - b
            });
            sortNumExtra =  mainObj.mainArray[mainObj.mainArray.length-1].extraNumbers.sort(function (a, b) {
                return a - b
            });

            mainObj.historyShow();
            mainObj.showNumbers(sortNum);
            // Timeout so we will have some time before extra numbers are showed
            setTimeout(function(){ mainObj.showNumbers(sortNumExtra,true); }, 500);
        }
    })
}

//Main preload methods
mainObj.populatePage();
mainObj.rangeColorCreate();
