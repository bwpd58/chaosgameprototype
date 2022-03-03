let VSHADER_SOURCE = `
  attribute vec4 a_Position; // attribute variable
  uniform float u_pointSize;
  void main() {
    gl_Position = a_Position; // xyzw
    gl_PointSize = u_pointSize; // default: 1.0
  }`;

let FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_Color; // uniform variable
  void main() {
    gl_FragColor = u_Color; // rgba
  }`;
  
function main() {
	let n = 6;
	let animID;
	let canvas;
	let gl;
	let mousePosition = [];
	let points = [];
	let outputVertices = [];
	let currentVertex = [];
	let initialVertex = [];
	let draw = false;

	canvas = document.getElementById("webgl");
    canvas.width = window.innerWidth;
    canvas.height = 0.90 * window.innerHeight;	
	
	gl = canvas.getContext("webgl");  
	  
	initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

	gl.clearColor(1.0, 1.0, 1.0, 1.0); // rgba

	function update() {
		if (points.length >= n + 1) {
			if (draw == false) {
				initialVertex = points[n];
				currentVertex = initialVertex;
			}
			draw = true;
			let rand = Math.floor(2 * n * Math.random());
			let factor = n / (n + 3);
			
			console.log(rand);

			switch(rand) {
				case 0:
				case 1:
					points.push([(points[0][0] - currentVertex[0]) * factor + currentVertex[0], (points[0][1] - currentVertex[1]) * factor + currentVertex[1]]);
					currentVertex = points[points.length - 1];
					break;
				case 2:
				case 3:
					points.push([(points[1][0] - currentVertex[0]) * factor + currentVertex[0], (points[1][1] - currentVertex[1]) * factor + currentVertex[1]]);
					currentVertex = points[points.length - 1];
					break;
				case 4:
				case 5:
					points.push([(points[2][0] - currentVertex[0]) * factor + currentVertex[0], (points[2][1] - currentVertex[1]) * factor + currentVertex[1]]);
					currentVertex = points[points.length - 1];
					break;
				case 6:
				case 7:
					points.push([(points[3][0] - currentVertex[0]) * factor + currentVertex[0], (points[3][1] - currentVertex[1]) * factor + currentVertex[1]]);
					currentVertex = points[points.length - 1];
					break;
				case 8:
				case 9:
					points.push([(points[4][0] - currentVertex[0]) * factor + currentVertex[0], (points[4][1] - currentVertex[1]) * factor + currentVertex[1]]);
					currentVertex = points[points.length - 1];
					break;
				case 10:
				case 11:
					points.push([(points[5][0] - currentVertex[0]) * factor + currentVertex[0], (points[5][1] - currentVertex[1]) * factor + currentVertex[1]]);
					currentVertex = points[points.length - 1];
					break;
				case 12:
				case 13:
					points.push([(points[6][0] - currentVertex[0]) * factor + currentVertex[0], (points[6][1] - currentVertex[1]) * factor + currentVertex[1]]);
					currentVertex = points[points.length - 1];
					break;
				case 14:
				case 15:
					points.push([(points[7][0] - currentVertex[0]) * factor + currentVertex[0], (points[7][1] - currentVertex[1]) * factor + currentVertex[0]]);
					currentVertex = points[points.length - 1]; 
					break;
			}
		}
	
	outputVertices = [];
	outputVertices[0] = mousePosition[0];
	outputVertices[1] = mousePosition[1];
		
	for (let i = 0; i < points.length; i++) {
		outputVertices.push(points[i][0]);
		outputVertices.push(points[i][1]);
	}
	
	outputVertices.push(initialVertex[0]);
	outputVertices.push(initialVertex[1]);
	
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.disable(gl.SCISSOR_TEST);
	gl.enable(gl.SCISSOR_TEST);
	gl.scissor(1, 1, gl.canvas.width - 2, gl.canvas.height - 2);
	gl.clear(gl.COLOR_BUFFER_BIT);
	bindVertices(gl, outputVertices);
	gl.drawArrays(gl.POINTS, 0, outputVertices.length / 2);
	
	if (draw) {
		canvas.onmousemove = null;
		canvas.onclick = null;
		animID = requestAnimationFrame(update);
		//setTimeout(function() { requestAnimationFrame(update); }, 5000);
	}
  }

	canvas.onmousemove = function(e) {
		var rect = e.target.getBoundingClientRect();
		mousePosition = [2 * (e.clientX - rect.left) / canvas.width - 1, - 2 * (e.clientY - rect.top) / canvas.height + 1];
		update();
	}
	
	canvas.onclick = function(e) {
		var rect = e.target.getBoundingClientRect();
		mousePosition = [2 * (e.clientX - rect.left) / canvas.width - 1, - 2 * (e.clientY - rect.top) / canvas.height + 1];
		points.push(mousePosition);
		update();
	}

    function updateWindow() {
        canvas.width = window.innerWidth;
        canvas.height = 0.90 * window.innerHeight;
		gl = canvas.getContext("webgl");
		
		update();
  }
}

function bindVertices(webGL, randPoints) {
	let data = new Float32Array(randPoints);
	let vertexBuffer = webGL.createBuffer();
	webGL.bindBuffer(webGL.ARRAY_BUFFER, vertexBuffer);
	webGL.bufferData(webGL.ARRAY_BUFFER, data, webGL.STATIC_DRAW);
	
	let a_Position = webGL.getAttribLocation(webGL.program, "a_Position");
	let u_Color = webGL.getUniformLocation(webGL.program, "u_Color");
	let u_pointSize = webGL.getUniformLocation(webGL.program, "u_pointSize");
	webGL.uniform1f(u_pointSize, 5.0);
	webGL.uniform4f(u_Color, 0.0, 0.0, 0.0, 1.0);
	
	webGL.vertexAttribPointer(a_Position, 2, webGL.FLOAT, false, 0, 0);
	webGL.enableVertexAttribArray(a_Position);
}
