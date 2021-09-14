import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useFrame, useCleanup, usePhysics} = metaversefile;

export default () => {
  const physics = usePhysics();
  
  const physicsCube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshPhongMaterial({
    color: 0xFF0000,
  }));
  const physicsCubePhysicsId = physics.addBoxGeometry(new THREE.Vector3(0, 5, 0), new THREE.Quaternion(), new THREE.Vector3(0.5, 0.5, 0.5), true);

  let updateIndex = 0;
  const p = new THREE.Vector3(0, 10, 0);
  const q = new THREE.Quaternion(0, 0, 0, 1);
  const s = new THREE.Vector3(1, 1, 1);
  useFrame(({timestamp}) => {
    if ((updateIndex % 100) === 0) {
      physics.setPhysicsTransform(physicsCubePhysicsId, p, q, s);
    }
    const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
    physicsCube.position.copy(position);
    physicsCube.quaternion.copy(quaternion);
    updateIndex++;
  });
  
  useCleanup(() => {
    physics.removeGeometry(physicsCubePhysicsId);
  });
  
  return physicsCube;
};