var video;
var canv = new Array(5);
var ctx = new Array(5);
var drawing = new Array(5);
var xy0 = null;
var letters = [
  ["a", "b", "c", "d", "e", "f"],
  ["g", "h", "i", "j", "k", "l"],
  ["m", "n", "o", "p", "q", "r"],
  ["s", "t", "u", "v", "w", "x"],
  ["y", "z"],
];
var pathx = [];
var pathy = [];

var startup = () => {

  Document.html.style.backgroundColor = "red";

  if(!localStorage.getItem("myData")) {
    alert("I need my education! Train Me! (/webcam.html)")
    return;
  }

  //launch webcam and detector
  app();
  load();

  for (var i = 0; i < 6; i++) {
    canv[i] = document.getElementById("canv" + i);
    ctx[i] = canv[i].getContext("2d");
    ctx[i].canvas.width = 80;
    ctx[i].canvas.height = 80;
    drawing[i] = false;
  }

  var attachListeners = (i) => {
    canv[i].addEventListener("mousedown", (e) => {
      ctx[i].beginPath();
      drawing[i] = true;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left,
        y = e.clientY - rect.top;
      xy0 = { x: x, y: y };
    });

    canv[i].addEventListener("mouseup", (e) => {
      if (!drawing[i]) return;

      ctx[i].closePath();
      ctx[i].clearRect(0, 0, 80, 80);
      drawing[i] = false;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      if (i === 5) {
        emojiDecide("hello");
      } else {
        decide(i, x - xy0.x, y - xy0.y);
      }

      document.getElementById("text");
    });

    canv[i].addEventListener("mouseout", (e) => {
      if (!drawing[i]) return;

      ctx[i].closePath();
      ctx[i].clearRect(0, 0, 80, 80);
      drawing[i] = false;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      if (i === 5) {
        pathx = [];
        pathy = [];
      } else {
        decide(i, x - xy0.x, y - xy0.y);
      }
    });

    canv[i].addEventListener("mousemove", (e) => {
      if (!drawing[i]) return;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left,
        y = e.clientY - rect.top;
      ctx[i].lineTo(x, y);
      ctx[i].moveTo(x, y);
      pathx.push(x);
      pathy.push(y);
      ctx[i].stroke();
    });
  };

  attachListeners(0);
  attachListeners(1);
  attachListeners(2);
  attachListeners(3);
  attachListeners(4);
  attachListeners(5);
};

var decide = (id, dx, dy) => {
  pathx = [];
  pathy = [];
  if (Math.abs(dy) < 10) {
    if (dx > 0) appendText(letters[id][0]);
    else appendText(letters[id][4]);

    return;
  }

  if (Math.abs(dx) < 10) {
    if (dy > 0) appendText(letters[id][5]);
    else appendText(letters[id][2]);

    return;
  }

  if (dx > 0 && dy < 0) appendText(letters[id][1]);
  else if (dx < 0 && dy < 0) appendText(letters[id][3]);
  else if (dx > 0 && dy > 0) appendText(" ");
  else textdelete();
};

var appendText = (char) => {
  document.getElementById("text").value += char;
};

var textdelete = () => {
  document.getElementById("text").value = document
    .getElementById("text")
    .value.slice(0, -1);
};

var emojiDecide = (v) => {
  var vecx = [];
  var vecy = [];

  for (var i = 5; i < pathx.length; i += 5) {
    vecx.push(pathx[i] - pathx[i - 5]);
    vecy.push(pathy[i] - pathy[i - 5]);
  }

  var dtheta = [];
  for (var i = 1; i < vecx.length; i++) {
    var v0x = vecx[i - 1];
    var v1x = vecx[i];
    var v0y = vecy[i - 1];
    var v1y = vecy[i];

    var dot = v0x * v1x + v0y * v1y;
    var mag0 = Math.sqrt(v0x * v0x + v0y * v0y);
    var mag1 = Math.sqrt(v1x * v1x + v1y * v1y);

    var theta = Math.acos(dot / (mag0 * mag1));

    if (!isNaN(theta)) dtheta.push((theta * 180) / Math.PI);
  }

  var sum = 0;
  for (var i = 0; i < dtheta.length; i++) {
    sum += dtheta[i];
  }

  var getStandardDeviation = (array) => {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
      array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
  };

  var x1 = pathx[pathx.length - 1];
  var y1 = pathy[pathx.length - 1];
  var x0 = pathx[0];
  var y0 = pathy[0];

  var d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
  var dy = 0;

  var ybounces = 0;
  var dir = Math.sign(pathy[1] - pathy[0]);
  for (var i = 2; i < pathy.length; i++) {
    if (
      Math.sign(pathy[i] - pathy[i - 1]) !== dir &&
      Math.abs(pathy[i] - pathy[i - 1]) > 0.1
    ) {
      dir = Math.sign(pathy[i] - pathy[i - 1]);
      ybounces += 1;
    }
  }

  console.log(getStandardDeviation(dtheta));

  if (d < 100) {
    if (getStandardDeviation(dtheta) < 25) {
      appendText(String.fromCodePoint(0x1f631));
    } else appendText(String.fromCodePoint(0x1f60d));
  } else {
    if (getStandardDeviation(dtheta) > 25) {
      appendText(String.fromCodePoint(0x1f389));
    } else if (pathy[3] < pathy[0]) appendText(String.fromCodePoint(0x1f622));
    else appendText(String.fromCodePoint(0x1f600));
  }
  pathx = [];
  pathy = [];
};

var handleBall = () => {
  appendText(String.fromCodePoint(0x26BD));
}

var handlePencil = () => {
  appendText(String.fromCodePoint(0x270f));
}

var handleBottle = () => {
  appendText(String.fromCodePoint(0x1f37c));
}

var handleCardboard = () => {
  appendText(String.fromCodePoint(0x1f4e6));
}

var handleElephant = () => {
  appendText(String.fromCodePoint(0x1f418));
}