var results = []
var count = [0,0,0,0,0,0]
var firstBoot = true

const WINDOW_SIZE = 18;

var addResult = (d) => {
  if(results.length >= WINDOW_SIZE) {
    results.shift();
  }

  results.push(d);

  return results;
}

var getCount = () => {
  var x = [...results];
  count = [0, 0, 0, 0, 0, 0]
  for(var i = 0; i < x.length; i++)
  {
    count[x[i]] = count[x[i]] + 1;
  }

}

var readyToDetect = false;

setInterval(() => {

  document.getElementsByTagName("html")[0].style.backgroundColor


  if(readyToDetect)
   document.getElementsByTagName("html")[0].style.backgroundColor = 0x450101;
  else
    document.getElementsByTagName("html")[0].style.backgroundColor = "red";

  if(results.length != WINDOW_SIZE)
    return;

  if(firstBoot)
  {
    firstBoot = false;
    console.log("Ready to detect")
  }

  getCount();

  var th = 12;

  if(!readyToDetect)
  {
    if (count[5] > th) //normal case
    {
      readyToDetect = true;
    }

    return;
  }


  if(count[0] > th)
  {
    handleBall();
    readyToDetect = false;
  }
  else if (count[1] > th)
  {
    handlePencil();
    readyToDetect = false;
  }
  else if (count[2] > th)
  {
    handleBottle();
    readyToDetect = false;
  }
  else if (count[3] > th)
  {
    handleCardboard();
    readyToDetect = false;
  }
  else if (count[4] > th)
  {
    handleElephant();
    readyToDetect = false;
  }
  else if (count[5] > th) //normal case
  {
    readyToDetect = true;
  }

}, 20)