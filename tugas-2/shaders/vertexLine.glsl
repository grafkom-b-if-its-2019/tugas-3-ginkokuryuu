precision mediump float;

attribute vec2 aPos;
uniform float scaleX;
uniform float scaleY;
uniform float theta;

void main(){
    gl_Position= vec4(aPos, 0., 1.);

    mat4 scalation = mat4(
        scaleX, 0.0, 0.0, 0.0,
        0.0, scaleY, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    gl_Position = gl_Position * scalation;

    mat4 rotation=mat4(
		cos(theta), -(sin(theta)), 0.0, 0.0,
		sin(theta), cos(theta), 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	);
	gl_Position = gl_Position * rotation;
}