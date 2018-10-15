/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var minInputer = document.getElementById('min');
var maxInputer = document.getElementById('max');
var currentInputer = document.getElementById('current');
var currentRange=document.getElementById('current-range');
var currentLabel=document.getElementById('current-label');
function setCurrent(min,max,current) {
  minInputer.value = min;
  maxInputer.value = max;

  currentInputer.min=min;
  currentInputer.max=max;
  currentInputer.value=current;

  currentRange.min=min;
  currentRange.max=max;
  currentRange.value=current;

  setPercent();

}
function setPercent() {
  currentLabel.innerText=currentInputer.value/(maxInputer.value-minInputer.value)*100+'%';
}
t.render(function(){
  return Promise.all([
    t.get('card', 'shared', 'min'),
    t.get('card', 'shared', 'max'),
    t.get('card','shared','current')
  ])
  .spread(function(savedMin, savedMax,savedCurrent){
    console.log(savedMin,savedMax,savedCurrent);
    setCurrent(savedMin||0,savedMax||100,savedCurrent||0);
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function(){
  return t.set('card', 'shared', 'max', maxInputer.value)
  .then(function(){
    return t.set('card', 'shared', 'min', minInputer.value);
  })
  .then(function(){
    return t.set('card', 'shared', 'current', currentInputer.value);
  })
  .then(function(){
    t.closePopup();
  })
});
minInputer.addEventListener('change',function (evt) {
  currentInputer.min=evt.target.value;
  currentRange.min=evt.target.value;
  currentInputer.value=Math.max(currentInputer.value,evt.target.value);
  currentRange.value=Math.max(currentRange.value,evt.target.value);
  setPercent()
})
maxInputer.addEventListener('change',function(evt){
  currentInputer.max=evt.target.value;
  currentRange.max=evt.target.value;
  currentInputer.value=Math.min(currentInputer.value,evt.target.value);
  currentRange.value=Math.min(currentRange.value,evt.target.value);
  
  setPercent();
})
currentInputer.addEventListener('change',function (evt) {
  currentRange.value=evt.target.value;
  setPercent()
})
currentRange.addEventListener('change',function(evt){
  currentInputer.value=evt.target.value;
  setPercent()
})
