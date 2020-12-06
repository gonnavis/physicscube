import * as THREE from 'three';
import {renderer, physics, app, appManager} from 'app';

let updateIndex = 0;
const physicsCube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshPhongMaterial({
  color: 0xFF0000,
}));
app.object.add(physicsCube);
const physicsCubePhysicsId = physics.addBoxGeometry(new THREE.Vector3(0, 5, 0), new THREE.Quaternion(), new THREE.Vector3(0.5, 0.5, 0.5), true);

renderer.setAnimationLoop((timestamp, frame) => {
  if ((updateIndex % 100) === 0) {
    physics.setPhysicsTransform(physicsCubePhysicsId, new THREE.Vector3(0, 10, 0), new THREE.Quaternion(0, 0, 0, 1));
  }
  const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
  physicsCube.position.copy(position);
  physicsCube.quaternion.copy(quaternion);
  updateIndex++;
});
app.addEventListener('unload', () => {
  physics.removeGeometry(physicsCubePhysicsId);
});