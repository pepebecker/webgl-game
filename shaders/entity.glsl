[vertex]
precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 transform;
uniform mat4 view;
uniform mat4 projection;

varying vec2 pass_uv;
varying vec4 pass_worldpos;

void main() {
  pass_uv = uv;
  pass_worldpos = transform * vec4(position, 1);
  gl_Position = projection * view * pass_worldpos;
}

[fragment]
precision mediump float;

uniform vec3 ambientlight;
uniform vec3 light_pos;
uniform vec3 light_color;
uniform float light_radius;
uniform float light_intensity;
uniform sampler2D sampler;
uniform vec4 color;
uniform vec2 tiling;

varying vec2 pass_uv;
varying vec4 pass_worldpos;

void main() {
  vec2 uv = pass_uv * tiling;

  vec4 texture_color = texture2D(sampler, uv);
  vec4 out_color = texture_color * color * vec4(ambientlight, 1);

  float light_distance = length(pass_worldpos - vec4(light_pos, 1));

  float tmp = (light_distance / light_radius) + (2.0 / light_intensity);
  float attenuation = 1.0 / (tmp * tmp);

  // if (attenuation < 0.1) attenuation = 0.0;
  // else if (attenuation < 0.2) attenuation = 0.1;
  // else if (attenuation < 0.3) attenuation = 0.2;
  // else if (attenuation < 0.4) attenuation = 0.3;
  // else if (attenuation < 0.5) attenuation = 0.4;

  vec4 light_color = vec4(light_color, 1) * attenuation;

  gl_FragColor = out_color + light_color;
}
