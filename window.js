var results = []
var count = [0,0,0,0,0,0]
var firstBoot = true

const WINDOW_SIZE = 200;

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
  if(results.length != WINDOW_SIZE)
    return;

  if(firstBoot)
  {
    firstBoot = false;
    console.log("Ready to detect")
  }

  getCount();

  var th = 180;

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
    console.log("Ball")
    readyToDetect = false;
  }
  else if (count[1] > th)
  {
    console.log("Pencil")
    readyToDetect = false;
  }
  else if (count[2] > th)
  {
    console.log("Bottle")
    readyToDetect = false;
  }
  else if (count[3] > th)
  {
    console.log("Cardboard")
    readyToDetect = false;
  }
  else if (count[4] > th)
  {
    console.log("Elephant")
    readyToDetect = false;
  }
  else if (count[5] > th) //normal case
  {
    readyToDetect = true;
  }


}, 200)