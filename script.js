var canv = new Array(5);
var ctx = new Array(5);
var drawing = new Array(5);
var xy0 = null;
var letters = [
  ['a', 'b', 'c', 'd', 'e', 'f'],
  ['g', 'h', 'i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p', 'q', 'r'],
  ['s', 't', 'u', 'v', 'w', 'x'],
  ['y', 'z']
];

var startup = () => {
  for (var i = 0; i < 5; i++) {
    canv[i] = document.getElementById("canv" + i);
    ctx[i] = canv[i].getContext("2d");
    ctx[i].canvas.width = 50;
    ctx[i].canvas.height = 50;
    drawing[i] = false;
  }

  var attachListeners = (i) => {
    canv[i].addEventListener("mousedown", (e) => {
      ctx[i].beginPath();
      drawing[i] = true;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left, y = e.clientY - rect.top;
      xy0 = { x: x, y: y }

    });

    canv[i].addEventListener("mouseup", (e) => {
      if (!drawing[i])
        return;

      ctx[i].closePath();
      ctx[i].clearRect(0, 0, 50, 50);
      drawing[i] = false;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left, y = e.clientY - rect.top;

      decide(i, x - xy0.x, y - xy0.y);
      document.getElementById("text")

    });

    canv[i].addEventListener("mouseout", (e) => {
      if (!drawing[i])
        return;

      ctx[i].closePath();
      ctx[i].clearRect(0, 0, 50, 50);
      drawing[i] = false;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left, y = e.clientY - rect.top;

      decide(i, x - xy0.x, y - xy0.y);

    });

    canv[i].addEventListener("mousemove", (e) => {
      if (!drawing[i])
        return;

      let rect = canv[i].getBoundingClientRect();
      let x = e.clientX - rect.left, y = e.clientY - rect.top;
      ctx[i].lineTo(x, y);
      ctx[i].moveTo(x, y);
      ctx[i].stroke();
    });
  }

  attachListeners(0);
  attachListeners(1);
  attachListeners(2);
  attachListeners(3);
  attachListeners(4);
}

var decide = (id, dx, dy) => {
  if (Math.abs(dy) < 10) {
    if (dx > 0)
      appendText(letters[id][0]);
    else
      appendText(letters[id][4]);

    return;
  }

  if (Math.abs(dx) < 10) {
    if (dy > 0)
      appendText(letters[id][5]);
    else
      appendText(letters[id][2]);

    return;
  }

  if (dx > 0 && dy < 0)
    appendText(letters[id][1]);
  else if (dx < 0 && dy < 0)
    appendText(letters[id][3]);
  else if (dx > 0 && dy > 0)
    appendText(" ");
  else
    textdelete();
}

var appendText = (char) => {
  document.getElementById("text").value += char;
}

var textdelete = () => {
  document.getElementById("text").value
    = document.getElementById("text").value.slice(0, -1);
}