(function (global) {

    glUtils.SL.init({ callback: function () { main(); } });

    // Get canvas element and check if WebGL enabled
    var canvas1 = document.getElementById("glcanvas1");
    var gl1 = glUtils.checkWebGL(canvas1);
    var gl2 = glUtils.checkWebGL(canvas1);
    var program1;
    var program2;
    

    function main() {
        InitGLSize();

        // Initialize the shaders and program
        var vertexShader1 = glUtils.getShader(gl1, gl1.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
            fragmentShader1 = glUtils.getShader(gl1, gl1.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

        var vertexShader2 = glUtils.getShader(gl2, gl2.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex),
            fragmentShader2 = glUtils.getShader(gl2, gl2.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

        program1 = glUtils.createProgram(gl1, vertexShader1, fragmentShader1);
        program2 = glUtils.createProgram(gl2, vertexShader2, fragmentShader2);

        // gl1.useProgram(program1);

        // Resizer();

        Render();
    }

    function InitGLSize() {
        var width = canvas1.getAttribute("width"),
            height = canvas1.getAttribute("height");

        if (width) {
            gl1.maxWidth = width;
            gl2.maxWidth = width;
        }
        if (height) {
            gl1.maxHeight = height;
            gl2.maxHeight = height;
        }
    }

    function Render() {

        gl1.clearColor(0.0, 0.0, 0.0, 1.0);
        gl1.clear(gl1.COLOR_BUFFER_BIT);
        gl2.clear(gl1.COLOR_BUFFER_BIT);


        gl1.useProgram(program1);
        var n = InitLines();
        if (n < 0) {
            console.log("failed to init gl buffer");
            return;
        }
        gl1.drawArrays(gl1.LINE_LOOP, 0, n);


        gl2.useProgram(program2);
        n = InitTriangle();
        if (n < 0) {
            console.log("failed to init gl buffer");
            return;
        }
        gl2.drawArrays(gl2.TRIANGLES, 0, n);

        requestAnimationFrame(Render);
    }

    //============================================== LINE ====================================================================

    var scaleXL = 0,
        scaleYL = 0,
        maxScaleL = 1,
        scaleDirL = 0,
        scaleRateL = 0.05;

    var rotateRateL = 0.0094,
        radianL = 0;

    var nFrameWait = 50,
        hasWaitNFrame = 0;

    function InitLines() {
        var vertices = [
            0.0, 0.75,
            0.30, 0.90,
            0.0, 0.45,
            0.45, 0.6,
            0.12, 0.05,

            0.5, 0.25,

            0.0, -0.60,
            -0.43, -0.9,
            -0.02, -0.25,
            -0.52, -0.4,
            -0.13, 0.18,

            -0.42, 0.1,
        ];

        var n = vertices.length / 2;

        var lineBuffer = gl1.createBuffer();
        gl1.bindBuffer(gl1.ARRAY_BUFFER, lineBuffer);
        gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(vertices), gl1.STATIC_DRAW);

        var aPos = gl1.getAttribLocation(program1, "aPos");
        var scaleX = gl1.getUniformLocation(program1, "scaleX");
        var scaleY = gl1.getUniformLocation(program1, "scaleY");
        var theta = gl1.getUniformLocation(program1, "theta");

        if(animKeyFrame < 4 && animKeyFrame >= 1){
            scaleDirL += scaleRateL;
            scaleXL = 1.2 * Math.sin(scaleDirL*1.1333) + maxScaleL - 0.99;
            scaleYL = 1.2 * Math.sin(scaleDirL*1.1333) + maxScaleL - 0.99;
        }
        if(animKeyFrame == 4){
            scaleDirL = 1;
            hasWaitNFrame += 1;
            if(hasWaitNFrame >= nFrameWait){
                animKeyFrame += 1;
            }
        }
        if(animKeyFrame == 6){
            hasWaitNFrame += 1;
            if(hasWaitNFrame >= nFrameWait){
                animKeyFrame += 1;
                scaleXH = 1;
                hasWaitNFrame = 0;
            }
        }
        if(animKeyFrame == 7){
            hasWaitNFrame += 1;
            if(hasWaitNFrame >= 1000){
                animKeyFrame += 1;
            }
            radianL += rotateRateL;
        }

        if(animKeyFrame < 6 && animKeyFrame >=5){
            scaleDirL += scaleRateL;
            scaleXL = Math.sin(scaleDirL * 2) + 0.001;
        }

        if(scaleXL >= 1.2 && animKeyFrame == 2){
            animKeyFrame += 1;
        }
        if(scaleXL <= 1 && animKeyFrame == 3){
            animKeyFrame += 1;
        }

        gl1.uniform1f(scaleX, scaleXL);
        gl1.uniform1f(scaleY, scaleYL);
        gl1.uniform1f(theta, radianL);

        gl1.vertexAttribPointer(aPos, 2, gl1.FLOAT, false, 0, 0);
        // gl1.enableVertexAttribArray(aPos);

        return n;
    }

    //=============================================== TRIANGLE ===========================================================

    var scaleXH = 1,
        scaleYH = 1,
        maxScaleH = 1,
        scaleDirH = 0,
        scaleRateH = 0.05;

    var rotateRateH = 360/58,
        radianH = 0,
        rotateH = 0;

    var animKeyFrame = 0;

    var flag = 0;

    var dir = 1;

    var frameCount = 0;
    function InitTriangle() {
        frameCount += 1;
        var vertices = new Float32Array([
            0.02, 0.7,
            0.16, 0.78,
            -0.3, 0.19,

            0.16, 0.78,
            -0.3, 0.19,
            -0.19, 0.22,


            -0.1, 0.4,
            0.03, 0.25,
            0.05, 0.33,

            -0.1, 0.4,
            0.03, 0.25,
            -0.13, 0.325,


            0.08, 0.4,
            0.19, 0.45,
            -0.38, -0.3,

            0.19, 0.45,
            -0.28, -0.27,
            -0.38, -0.3,




            0.21, 0.46,
            0.31, 0.5,
            -0.26, -0.267,

            0.31, 0.5,
            -0.16, -0.237,
            -0.26, -0.267,


            -0.07, -0.02,
            0.13, -0.13,
            0.1, -0.2,

            -0.07, -0.02,
            0.1, -0.2,
            -0.1, -0.09,


            0.18, 0.0,
            0.33, 0.08,
            -0.25, -0.7,

            0.33, 0.08,
            -0.05, -0.55,
            -0.25, -0.7,
        ]);

        var n = vertices.length / 2;

        var triangleBuffer = gl2.createBuffer();
        gl2.bindBuffer(gl2.ARRAY_BUFFER, triangleBuffer);
        gl2.bufferData(gl2.ARRAY_BUFFER, vertices, gl2.STATIC_DRAW);

        var aPos = gl2.getAttribLocation(program2, "aPos");

        var scaleX = gl2.getUniformLocation(program2, "scaleX");
        var scaleY = gl2.getUniformLocation(program2, "scaleY");
        var theta = gl2.getUniformLocation(program2, "theta");

        if(animKeyFrame < 2){
            scaleDirH += scaleRateH;
            scaleXH = 1.2 * Math.sin(scaleDirH/2) + maxScaleH - 0.99;
            scaleYH = 1.2 * Math.sin(scaleDirH/2) + maxScaleH - 0.99;
            if(animKeyFrame == 0){
                rotateH += rotateRateH;
                radianH = 360 * Math.sin(rotateH / (180 + 50));
                radianH = radianH * Math.PI / 180;
            }
        }
        if(animKeyFrame < 6 && animKeyFrame >=5){
            scaleDirH += scaleRateH;
            scaleXH = Math.sin(scaleDirH * 2) + 0.001;
        }



        if(scaleXH >= 1.2 && animKeyFrame == 0){
            animKeyFrame += 1;
        }
        if(scaleXH <= 1 && animKeyFrame == 1){
            animKeyFrame += 1;
            scaleDirH = 1;
            
        }
        if(scaleXH >= 1 && animKeyFrame == 5){
            animKeyFrame += 1;
            hasWaitNFrame = 0;
        }
        if(animKeyFrame == 7){
            if(scaleXH <= -1){
                dir = 1;
            }
            else if(scaleXH >= 1){
                dir = -1;
            }
            scaleXH += (0.0094 * dir);
        }

        if(animKeyFrame == 8){
            ResetAnimation();
        }

        gl2.uniform1f(scaleX, scaleXH);
        gl2.uniform1f(scaleY, scaleYH);
        gl2.uniform1f(theta, radianH);

        gl2.vertexAttribPointer(aPos, 2, gl1.FLOAT, false, 0, 0);
        gl2.enableVertexAttribArray(aPos);

        return n;
    }

    //=================================================================================================================

    function ResetAnimation(){
        scaleXH = 1;
        scaleYH = 1;
        maxScaleH = 1;
        scaleDirH = 0;
        scaleRateH = 0.05;

        rotateRateH = 360/58;
        radianH = 0;
        rotateH = 0;

        animKeyFrame = 0;
        scaleXL = 0;
        scaleYL = 0;
        maxScaleL = 1;
        scaleDirL = 0;
        scaleRateL = 0.05;

        radianL = 0;
        rotateRateL = 0.0094;

        nFrameWait = 50;
        hasWaitNFrame = 0;
    }

    //#region fullscreen 
    // function onFullscreenChange() {
    //     if (!document.fullscreenElement &&    // alternative standard method
    //         !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
    //         Resizer();
    //     }
    // }
    

    // global.fullscreen = function () {
    //     if (canvas1.requestFullscreen) {
    //         canvas1.requestFullscreen();
    //     }
    //     else if (canvas1.msRequestFullscreen) {
    //         canvas1.msRequestFullscreen();
    //     }
    //     else if (canvas1.webkitRequestFullscreen) {
    //         canvas1.webkitRequestFullscreen();
    //     }
    //     else if (canvas1.mozRequestFullScreen) {
    //         canvas1.mozRequestFullScreen();
    //     }
    // }

    // window.addEventListener('resize', Resizer);
    // document.addEventListener('fullscreenchange', onFullscreenChange);
    // document.addEventListener('mozfullscreenchange', onFullscreenChange);
    // document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    //#endregion

})(window || this);
