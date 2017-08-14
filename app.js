$(document).ready(function () {

// Initalize the SVG parameters 

var svgHeight = 720;
var svgWidth = 1500;
var barPadding = 1;

//  Creates the SVG, passing through the height & width // 

function createSvg(parent, height, width) {
    return d3.select(parent) // Selecting the parent element 
    .append('svg') // Creates a new object under parent 
    .attr('height', height) // Changes the height 
    .attr('width', width); // Changes the width  
  }

// Create SVG and assigns to variable 'graph' //  

var graph = createSvg('#graph', svgHeight, svgWidth);

// frequencyData creates a new unsigned 8 bits Array w/ 512 elements

var frequencyData = new Uint8Array(512);
for (i = 0; i < frequencyData.length; i++) {
	frequencyData[i] = 1;
}

var pause = 0;

// Set-up structure of data/frequency values 

  graph.selectAll('rect')   // Selects all rectangles in graph
  .data(frequencyData) // Binds array to data
  .enter()  // Creates new rectangles
  .append('rect') // Appends new elements to the DOM 
  graph.selectAll('rect').style('fill', '#66ccff') // changes colour of rects
  .attr('width', svgWidth / frequencyData.length - barPadding) // Length of each rectangle
  .attr('height', function (d) { // Height of each rectangle
    return d * 2; // Inital height of rectangle 
  })
  .attr('x', function (d, i) { // Aligns the rectangles in a specific length
  	return i * (svgWidth / frequencyData.length);
  })
  .attr('y', function (d) {
        return svgHeight - (d * 2); // Align the bars to the bottom of the SVG.
      });

//Audio stuff

var contextClass = (window.AudioContext || window.webkitAudioContext);

// get mic in

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
navigator.getUserMedia(
	{audio:true},
	gotStream,
	function(err) {
		console.log("The following error occured: " + err);
	} 
	);

//for sound to be passed into

var audioBuffer;

//for analyser node

var analyzer;

//set empty array hald of fft size or equal to frequencybincount (you could put frequency bin count here if created)

if (contextClass) {
  // Web Audio API is available.
  var context = new contextClass();
  console.warn('yes!');
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
  alert("Oh no! It appears your browser does not support the Web Audio API, please upgrade or use a different browser");
  console.warn('get a new browser fam');
}

// success callback when requesting audio input stream

function gotStream(stream) {
	createAnalyser()
    // Create an AudioNode from the stream.
    var mediaStreamSource = context.createMediaStreamSource(stream);
    connectAnalyser(mediaStreamSource)
    update();
  }

  function createAnalyser() {
  //create analyser node
  analyzer = context.createAnalyser();
  //set size of how many bits we analyse on
  analyzer.fftSize = 2048;
}

function connectAnalyser(source) {
  //connect to source
  source.connect(analyzer);
}

function playSound() {
  //passing in file
  createAnalyser();
  //creating source node
  var source = context.createMediaElementSource(audioElement);
  connectAnalyser(source);
}

function update() {
	requestAnimationFrame(update);
  if (pause == 1) {
    return
  }
  //constantly getting feedback from data
  analyzer.getByteFrequencyData(frequencyData); 

  graph.selectAll('rect')
     .data(frequencyData)
     .attr('y', function (d) {
          return svgHeight - (d * 2); // Align the bars to the bottom of the SVG.
        });
}

pauseButton.addEventListener("click", function() {
  if (pause == 1) pause = 0;
  else pause = 1;
}) 

});