// import { glMatrix } from "gl-matrix";

(function () {

	glUtils.SL.init({ callback: function () { main(); } });
	var canvas = document.getElementById("glcanvas");
	var gl = glUtils.checkWebGL(canvas);
	var program1,
		program2;

	function main() {
		var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
			fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
		program1 = glUtils.createProgram(gl, vertexShader, fragmentShader);

		var vertexShaderNama = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
			fragmentShaderNama = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);
		program2 = glUtils.createProgram(gl, vertexShaderNama, fragmentShaderNama);

		gl.clearColor(0.0, 0.0, 0 + .0, 1.0);
		gl.enable(gl.DEPTH_TEST)

		gl.useProgram(program2);
		InitHuruf();

		render();		
	}

//=======================================================Projection=======================================================

	var mvm = glMatrix.mat4.create();
	var pm = glMatrix.mat4.create();

	var eye = {
		x: 0.0,
		y: 0.0,
		z: 2.0,
	};

	mvm = glMatrix.mat4.lookAt(mvm,
		glMatrix.vec3.fromValues(0.0, 0.0, 2.0),
		glMatrix.vec3.fromValues(0.0, 0.0, 0.0),
		glMatrix.vec3.fromValues(0.0, 1.0, 0.0)
	);

	var fovy = glMatrix.glMatrix.toRadian(60.0);
	var aspect = canvas.width / canvas.height;
	var near = 0.5;
	var far = 10.0;

	pm = glMatrix.mat4.perspective(pm,
		fovy,
		aspect,
		near,
		far
	);

//=======================================================Box=======================================================

	var rotateRate = 0;
	var sudut = [0, 0, 0];
	var axis = 0;
	var xAxis = 0;
	var yAxis = 1;
	var zAxis = 2;

	var skala = 0;
	var scalingRate = 0.005;
	var dir = 1;
	var minScale = 0;
	var maxScale = 1.5;

	var n = 0;
	function InitBox(){
		var cubeVertices = [
			//depan
			-0.5, 0.5, 0.5, 	1.0, 0.0, 0.0,
			-0.5, -0.5, 0.5, 	1.0, 0.0, 0.0,

			-0.5, -0.5, 0.5, 	1.0, 0.0, 0.0,
			0.5, -0.5, 0.5, 	1.0, 0.0, 0.0,

			0.5, -0.5, 0.5, 	1.0, 0.0, 0.0,
			0.5, 0.5, 0.5, 		1.0, 0.0, 0.0,

			0.5, 0.5, 0.5, 		1.0, 0.0, 0.0,
			-0.5, 0.5, 0.5, 	1.0, 0.0, 0.0,


			//kanan
			0.5, 0.5, 0.5, 		0.0, 1.0, 0.0,
			0.5, 0.5, -0.5, 	0.0, 1.0, 0.0,

			0.5, -0.5, 0.5, 	0.0, 1.0, 0.0,
			0.5, -0.5, -0.5, 	0.0, 1.0, 0.0,

			//belakang
			-0.5, 0.5, -0.5, 	0.0, 0.0, 1.0,
			-0.5, -0.5, -0.5, 	0.0, 0.0, 1.0,

			-0.5, -0.5, -0.5, 	0.0, 1.0, 0.0,
			0.5, -0.5, -0.5, 	0.0, 1.0, 0.0,

			0.5, -0.5, -0.5, 	0.0, 1.0, 0.0,
			0.5, 0.5, -0.5, 	0.0, 1.0, 0.0,

			0.5, 0.5, -0.5, 	0.0, 0.0, 1.0,
			-0.5, 0.5, -0.5, 	0.0, 0.0, 1.0,

			//kiri
			-0.5, 0.5, 0.5, 	0.0, 0.0, 1.0,
			-0.5, 0.5, -0.5, 	0.0, 0.0, 1.0,

			-0.5, -0.5, 0.5, 	0.0, 0.0, 1.0,
			-0.5, -0.5, -0.5, 	0.0, 0.0, 1.0,
		];

		var cubeVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

		var vPos = gl.getAttribLocation(program1, 'vPos');
		var vColor = gl.getAttribLocation(program1, 'vColor');

		gl.vertexAttribPointer(vPos, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
		var theta = gl.getUniformLocation(program1, 'theta');
		var scale = gl.getUniformLocation(program1, 'scale');

		n = cubeVertices.length / 6;

		var projection = gl.getUniformLocation(program1, 'projection');
		var modelView = gl.getUniformLocation(program1, 'modelView');

		gl.enableVertexAttribArray(vPos);
		gl.enableVertexAttribArray(vColor);
		gl.uniformMatrix4fv(projection, false, pm);
		gl.uniformMatrix4fv(modelView, false, mvm);

		sudut[axis] += rotateRate;

		if(skala <= minScale){
			dir = 1;
		}
		else if(skala >= maxScale){
			dir = -1;
		}
		skala = skala + (scalingRate * dir)

		skala = 1; 
		// radian = 0;
		gl.uniform3fv(theta, sudut);
		gl.uniform1f(scale, skala);
	}

//=================================================================================================================

//=======================================================Huruf=======================================================

	var vertices;
	var hurufBuffer;
	var hurufPos
	var hurufN;
	var furthestPos = [1, 14, 32, 33];

	function InitHuruf(){
		vertices = new Float32Array([
            0.02, 0.7, 0.0,
            0.16, 0.78, 0.0,
            -0.3, 0.19, 0.0,

            0.16, 0.78, 0.0,
            -0.3, 0.19, 0.0,
            -0.19, 0.22, 0.0,


            -0.1, 0.4, 0.0,
            0.03, 0.25, 0.0,
            0.05, 0.33, 0.0,

            -0.1, 0.4, 0.0,
            0.03, 0.25, 0.0,
            -0.13, 0.325, 0.0,


            0.08, 0.4, 0.0,
            0.19, 0.45, 0.0,
            -0.38, -0.3, 0.0,

            0.19, 0.45, 0.0,
            -0.28, -0.27, 0.0,
            -0.38, -0.3, 0.0,




            0.21, 0.46, 0.0,
            0.31, 0.5, 0.0,
            -0.26, -0.267, 0.0,

            0.31, 0.5, 0.0,
            -0.16, -0.237, 0.0,
            -0.26, -0.267, 0.0,


            -0.07, -0.02, 0.0,
            0.13, -0.13, 0.0,
            0.1, -0.2, 0.0,

            -0.07, -0.02, 0.0,
            0.1, -0.2, 0.0,
            -0.1, -0.09, 0.0,


            0.18, 0.0, 0.0,
            0.33, 0.08, 0.0,
            -0.25, -0.7, 0.0,

            0.33, 0.08, 0.0,
            -0.05, -0.55, 0.0,
            -0.25, -0.7, 0.0,
		]);
		
		hurufN = vertices.length / 2;

		vertices = matrixScaling(vertices, 0.3);
		// vertices = matrixTranslating(vertices, 0.0, -0.025, 0.0);

		hurufBuffer = gl.createBuffer();

		hurufPos = gl.getAttribLocation(program2, "aPos");
		var projection = gl.getUniformLocation(program2, 'projection');
		var modelView = gl.getUniformLocation(program2, 'modelView');

		gl.uniformMatrix4fv(projection, false, pm);
		gl.uniformMatrix4fv(modelView, false, mvm);
	}

//===================================================================================================================

	function render() {
		gl.clearColor(0.0, 0.0, 0 + .0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(program1);
		InitBox();
		gl.drawArrays(gl.LINES, 0, n);

		gl.useProgram(program2);
		// InitHuruf();
		KeyboardHandler();
		OnCollisionEnter();
		AnimateHuruf();
		gl.drawArrays(gl.TRIANGLES, 0, hurufN);

		requestAnimationFrame(render);
	}

//==============================================Animasi Huruf=============================================================

	var moveSpeed = [0.0, 0.0, 0.0];
	var rotateSpeed = 1;
	var rotateDir = 1;
	var keyPress = {};
	var moveRate = 0.0001;
	var center = [0.0, 0.0, 0.0]

	function AnimateHuruf(){
		gl.bindBuffer(gl.ARRAY_BUFFER, hurufBuffer);
		vertices = matrixTranslating(vertices, moveSpeed[0], moveSpeed[1], moveSpeed[2]);
		for(var i = 0; i < 3; i++){
			center[i] += moveSpeed[i];
		}
		vertices = matrixRotating(vertices, rotateSpeed * rotateDir, center[0], center[2]);

		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
		gl.vertexAttribPointer(hurufPos, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(hurufPos);
	}
	var lol = false;
	function OnCollisionEnter(){
		lol = false;
		var x = 0;
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 3; j++){
				x = furthestPos[i] * 3;
				if(vertices[x + j] >= 0.5 || vertices[x + j] <= -0.5){
					moveSpeed[j] *= -1;
					if(j == 0 || j == 2){
						rotateDir *= -1;
					}
					lol = true;
					break;
				}
			}
			if(lol){
				break;
			}
		}
	}

	function GetKey(event){
		keyPress[event.keyCode] = true;
	}

	function GetKeyUp(event){
		keyPress[event.keyCode] = false;
	}

	function KeyboardHandler(){
		if(keyPress[87]){
			//w
			moveSpeed[1] += moveRate;
		}
		else if(keyPress[65]){
			//a
			moveSpeed[0] -= moveRate;
		}
		else if(keyPress[83]){
			//s
			moveSpeed[1] -= moveRate;
		}
		else if(keyPress[68]){
			//d
			moveSpeed[0] += moveRate;
		}
		else if(keyPress[81]){
			//q
			moveSpeed[2] -= moveRate;
		}
		else if(keyPress[69]){
			//e
			moveSpeed[2] += moveRate;
		}
		else if(keyPress[32]){
			//space
			moveSpeed = [0.0, 0.0, 0.0]
		}
	}

	function onKeyPress(event) {
		if (event.keyCode == 88 || event.keyCode == 120) {
			axis = xAxis;
		}
		else if (event.keyCode == 89 || event.keyCode == 121) {
			axis = yAxis;
		}
		else if (event.keyCode == 90 || event.keyCode == 122) {
			axis = zAxis;
		}
	}

	document.addEventListener("keypress", onKeyPress);
	document.onkeydown = GetKey;
	document.onkeyup = GetKeyUp;
})();
