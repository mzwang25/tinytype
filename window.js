var results = []
const WINDOW_SIZE = 200;

var addResult = (d) => {
  if(results.length >= WINDOW_SIZE) {
    results.shift();
  }

  results.push(d);

  return results;
}
