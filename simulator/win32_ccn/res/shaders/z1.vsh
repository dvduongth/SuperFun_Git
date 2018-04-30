// Vertex shader

varying vec2 vUv;

void main(void)
{
    gl_Position = vec4( gl_Vertex.xy, 0.0, 1.0 );
    gl_Position = sign( gl_Position );
    vUv = (vec2( gl_Position.x, gl_Position.y ) + vec2(1.0) ) / vec2(2.0);
}