import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useFrame, useCleanup, usePhysics, useApp} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');
const texBase = 'Vol_33_4';

const localMatrix = new THREE.Matrix4();
const localMatrix2 = new THREE.Matrix4();

export default () => {
  const app = useApp();
  const physics = usePhysics();
  
  const size = new THREE.Vector3(2, 1, 1);
  const geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);

  const map = new THREE.Texture();
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  {
    const img = new Image();
    img.onload = () => {
      map.image = img;
      map.needsUpdate = true;
    };
    img.onerror = err => {
      console.warn(err);
    };
    img.crossOrigin = 'Anonymous';
    img.src = baseUrl + texBase + '_Base_Color.png';
  }
  const normalMap = new THREE.Texture();
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  {
    const img = new Image();
    img.onload = () => {
      normalMap.image = img;
      normalMap.needsUpdate = true;
    };
    img.onerror = err => {
      console.warn(err);
    };
    img.crossOrigin = 'Anonymous';
    img.src = baseUrl + texBase + '_Normal.png';
  }
  const bumpMap = new THREE.Texture();
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  {
    const img = new Image();
    img.onload = () => {
      bumpMap.image = img;
      bumpMap.needsUpdate = true;
    };
    img.onerror = err => {
      console.warn(err);
    };
    img.crossOrigin = 'Anonymous';
    img.src = baseUrl + texBase + '_Height.png';
  }
  const baseMaterial = new THREE.MeshStandardMaterial({
    // color: 0x00b2fc,
    // specular: 0x00ffff,
    // shininess: 20,
    map,
    normalMap,
    bumpMap,
    roughness: 1,
    metalness: 0,
  });
  
  const stripeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTex: {
        type: 't',
        value: new THREE.Texture(),
        needsUpdate: true,
      },
      uTime: {
        type: 'f',
        value: 0,
        needsUpdate: true,
      },
    },
    vertexShader: `\
      precision highp float;
      precision highp int;

      uniform vec4 uSelectRange;

      attribute vec3 uv2;
      attribute float ao;
      attribute float skyLight;
      attribute float torchLight;

      varying vec3 vUv;

      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        vUv = uv2;
      }
    `,
    fragmentShader: `\
      precision highp float;
      precision highp int;

      #define PI 3.1415926535897932384626433832795

      uniform sampler2D uTex;
      uniform float uTime;
      uniform vec3 sunDirection;

      varying vec3 vViewPosition;
      varying vec3 vUv;

      void main() {
        if (vUv.x > 0.001 && vUv.x < 0.999 && vUv.y > 0.001 && vUv.y < 0.999 && vUv.z > 0.) {
          vec4 c1 = texture(uTex, vec2(vUv.x*0.5, vUv.y + uTime));
          vec4 c2 = texture(uTex, vec2(0.5 + vUv.x*0.5, vUv.y + uTime));
          vec3 c = (c1.rgb * (1. - c2.a)) + (c2.rgb * c2.a);
          gl_FragColor = vec4(c, 1.);
        } else {
          gl_FragColor = vec4(0.);
        }
      }
    `,
    transparent: true,
    // depthWrite: false,
    // polygonOffset: true,
    // polygonOffsetFactor: -1,
    // polygonOffsetUnits: 1,
  });
  const physicsCube = new THREE.Mesh(geometry, baseMaterial);
  app.add(physicsCube);

  const physicsObject = physics.addBoxGeometry(new THREE.Vector3(0, 0, 0), new THREE.Quaternion(), size.clone().multiplyScalar(0.5), true);
  const {physicsMesh} = physicsObject;
  window.physicsCube = physicsCube;
  window.physicsMesh = physicsMesh;

  let updateIndex = 0;
  const p = new THREE.Vector3(0, 10, 0);
  const q = new THREE.Quaternion(0, 0, 0, 1);
  const s = new THREE.Vector3(1, 1, 1);
  useFrame(({timestamp}) => {
    if ((updateIndex % 200) === 0) {
      // console.log('reset pos 1', physicsObject.position.toArray().join(','));
      physicsObject.position.copy(p);
      physicsObject.quaternion.copy(q);
      // physicsObject.physicsMesh.scale.copy(s);
      physicsObject.updateMatrixWorld();
      physicsObject.needsUpdate = true;
      // physics.setPhysicsTransform(physicsCubePhysicsId, p, q, s);
      // const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
    }
    // console.log('tick pos 1', physicsCube.position.toArray().join(','));
    // const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
    physicsObject.updateMatrixWorld();
    localMatrix.copy(physicsObject.matrixWorld)
      .premultiply(localMatrix2.copy(app.matrixWorld).invert())
      .decompose(physicsCube.position, physicsCube.quaternion, physicsCube.scale);
    // console.log('position', physicsObject.position.toArray().join(','), physicsCube.position.toArray().join(','));
    app.updateMatrixWorld();
    // physicsCube.updateMatrixWorld();
    updateIndex++;
  });
  
  useCleanup(() => {
    // console.log('cleanup 1');
    physics.removeGeometry(physicsObject);
  });
  
  return app;
};