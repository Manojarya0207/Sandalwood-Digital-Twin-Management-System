import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFarmStore } from '../../store/farmStore';
import { getHealthColor } from '../../utils/colorUtils';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export const TreeInstances = () => {
  const trees = useFarmStore((s) => s.trees);
  
  const { trunkGeom, foliageGeom } = useMemo(() => {
    // Geometric representation of Sandalwood trees using PRD strict colors
    const tGeom = new THREE.CylinderGeometry(0.3, 0.5, 2, 6);
    tGeom.translate(0, 1, 0); 
    
    const fGeom = new THREE.ConeGeometry(2.5, 6, 7);
    fGeom.translate(0, 5, 0); 
    
    return { trunkGeom: tGeom, foliageGeom: fGeom };
  }, []);

  const trunkMeshRef = useRef<THREE.InstancedMesh>(null);
  const foliageMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!trunkMeshRef.current || !foliageMeshRef.current || trees.length === 0) return;
    
    trees.forEach((tree, i) => {
      tempObject.position.set(tree.position.x, 0, tree.position.z);
      
      const scale = Math.max(0.3, tree.heightMeters / 8);
      tempObject.scale.set(scale, scale, scale);
      
      tempObject.rotation.y = Math.random() * Math.PI;
      tempObject.updateMatrix();
      
      trunkMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      foliageMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      const color = getHealthColor(tree.health);
      tempColor.set(color);
      foliageMeshRef.current!.setColorAt(i, tempColor);
    });
    
    trunkMeshRef.current.instanceMatrix.needsUpdate = true;
    foliageMeshRef.current.instanceMatrix.needsUpdate = true;
    if (foliageMeshRef.current.instanceColor) {
      foliageMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [trees]);

  return (
    <group>
      {/* Trunks (Slate color to match PRD constraints) */}
      <instancedMesh ref={trunkMeshRef} args={[trunkGeom, undefined, trees.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </instancedMesh>
      
      {/* Foliage (Color will be set per-instance based on health mapping to blues/greys) */}
      <instancedMesh ref={foliageMeshRef} args={[foliageGeom, undefined, trees.length]} castShadow receiveShadow>
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </instancedMesh>
    </group>
  );
};
