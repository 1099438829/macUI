var inputTxt = ''
var outputTxt = ''
//add event listening
$('.line-item').on('click',e=>{
  // console.log('here')
  playSoud()
  var key = e.target.dataset.key
  console.log(key)
  switch(key){
    case '=':
      try{
        outputTxt = eval(inputTxt)
      }catch(e){
        outputTxt = 'error'
      }
      break;
    case 'AC':
      //clear all inputs and outputs
      inputTxt = ''
      outputTxt = '0'
      break;
    default:
      inputTxt += key
  }
  //update the view
  updateView()
})
function playSoud(){
  $('audio')[0].play()
}
function updateView(){
  $('.input-box').html(inputTxt)
  $('.output-box').html(outputTxt)
}