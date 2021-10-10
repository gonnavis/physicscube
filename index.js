import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useFrame, useCleanup, usePhysics} = metaversefile;

export default () => {
  const physics = usePhysics();
  
  const physicsCube = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshPhongMaterial({
    color: 0xFF0000,
  }));
  const physicsObject = physics.addBoxGeometry(new THREE.Vector3(0, 5, 0), new THREE.Quaternion(), new THREE.Vector3(0.5, 0.5, 0.5), true);
  // window.physicsCube = physicsCube;

  let updateIndex = 0;
  const p = new THREE.Vector3(0, 10, 0);
  const q = new THREE.Quaternion(0, 0, 0, 1);
  const s = new THREE.Vector3(1, 1, 1);
  useFrame(({timestamp}) => {
    if ((updateIndex % 100) === 0) {
      // console.log('reset pos 1', physicsObject.position.toArray().join(','));
      physicsObject.position.copy(p);
      physicsObject.quaternion.copy(q);
      // physicsObject.scale.copy(s);
      physicsObject.needsUpdate = true;
      // physics.setPhysicsTransform(physicsCubePhysicsId, p, q, s);
      // const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
    }
    // console.log('tick pos 1', physicsCube.position.toArray().join(','));
    // const {position, quaternion} = physics.getPhysicsTransform(physicsCubePhysicsId);
    physicsCube.position.copy(physicsObject.position);
    physicsCube.quaternion.copy(physicsObject.quaternion);
    updateIndex++;
  });
  
  useCleanup(() => {
    // console.log('cleanup 1');
    physics.removeGeometry(physicsObject);
  });
  
  return physicsCube;
};