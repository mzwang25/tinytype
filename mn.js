/**
 * Borrowed From
 * https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab/index.html#0
 */



let webcamElement;
let net;
const classifier = knnClassifier.create();
const classes = ['Ball', 'Pencil', 'Bottle', 'Cardboard', 'Elephant', 'Nothing'];

async function app() {
  console.log('Loading mobilenet..');
  webcamElement = document.getElementById('webcam');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Create an object from Tensorflow.js data API which could capture image 
  // from the web camera as Tensor.
  const webcam = await tf.data.webcam(webcamElement);

  // Reads an image from the webcam and associates it with a specific class
  // index.
  const addExample = async classId => {
    // Capture an image from the web camera.
    for(var i = 0; i < 10; i++) {
      const img = await webcam.capture();

      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      const activation = net.infer(img, true);

      // Pass the intermediate activation to the classifier.
      classifier.addExample(activation, classId);

      // Dispose the tensor to release the memory.
      img.dispose();
    }
  };

  // When clicking a button, add an example for that class.
  try {
    document.getElementById('class-a').addEventListener('click', () => addExample(0));
    document.getElementById('class-b').addEventListener('click', () => addExample(1));
    document.getElementById('class-c').addEventListener('click', () => addExample(2));
    document.getElementById('class-d').addEventListener('click', () => addExample(3));
    document.getElementById('class-e').addEventListener('click', () => addExample(4));
    document.getElementById('class-f').addEventListener('click', () => addExample(5));
  }
  catch {
  }
    

  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();

      // Get the activation from mobilenet from the webcam.
      const activation = net.infer(img, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      const result = await classifier.predictClass(activation);

      try {
        document.getElementById('console').innerText = `
          prediction: ${classes[result.label]}\n
          probability: ${result.confidences[result.label]}
        `;
      } catch {

      }

      addResult(result.label);

      // Dispose the tensor to release the memory.
      img.dispose();
    }

    await tf.nextFrame();
  }
}

/**
 * Save and load borrowed from:
 * https://github.com/tensorflow/tfjs/issues/633
 */

var save = () => {
  let dataset = classifier.getClassifierDataset()
  var datasetObj = {}
  Object.keys(dataset).forEach((key) => {
    let data = dataset[key].dataSync();
    // use Array.from() so when JSON.stringify() it covert to an array string e.g [0.1,-0.2...] 
    // instead of object e.g {0:"0.1", 1:"-0.2"...}
    datasetObj[key] = Array.from(data); 
  });
  let jsonStr = JSON.stringify(datasetObj)
  //can be change to other source
  localStorage.setItem("myData", jsonStr);
 console.log("saved")

}

var load = () => {
  //can be change to other source
 let dataset = localStorage.getItem("myData")
 let tensorObj = JSON.parse(dataset)
 //covert back to tensor
 Object.keys(tensorObj).forEach((key) => {
   tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024])
 })
 classifier.setClassifierDataset(tensorObj);
 console.log("loaded")
}
