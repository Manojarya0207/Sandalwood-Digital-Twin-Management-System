import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * FarmTrees – low-poly green sandalwood trees in a grid layout
 * matching the reference image aesthetic
 */

// Tree positions in a grid — 7 columns × 7 rows
// Spread across the brown platform, leaving space for the pond in top-left
function generateTreeGrid() {
  const trees: { x: number; z: number; scale: number; rot: number }[] = [];
  const cols = 7;
  const rows = 7;
  const spacingX = 11;
  const spacingZ = 11;
  const startX = -28;
  const startZ = -32;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * spacingX;
      const z = startZ + r * spacingZ;
      // Skip top-left area where the pond is
      if (x < -20 && z < -18) continue;
      const scale = 0.85 + Math.random() * 0.3;
      const rot = Math.random() * Math.PI * 2;
      trees.push({ x, z, scale, rot });
    }
  }
  return trees;
}

// Export tree data so IrrigationPipes can access tree positions for drippers
export const TREE_DATA = generateTreeGrid();
const tempObj = new THREE.Object3D();
const tempColor = new THREE.Color();

// Palette of clearly-green sRGB hex colors for foliage
const GREEN_PALETTE = [
  '#2d8a4e', '#34a853', '#27ae60', '#2ecc71', '#1e8449',
  '#239b56', '#28b463', '#1abc6c', '#229954', '#2baf5f',
  '#36b365', '#30a85b', '#25a050', '#33bc67', '#2aaa55',
];

export const FarmTrees = () => {
  const count = TREE_DATA.length;
  const groundY = 0.75; // top of platform

  const foliageRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);

  // Low-poly foliage: icosahedron for that chunky polygon look
  const foliageGeom = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(3.2, 1); // detail=1 for low-poly look
    g.translate(0, 7.5, 0);
    return g;
  }, []);

  // Trunk: tapered cylinder
  const trunkGeom = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.35, 0.5, 4.5, 7);
    g.translate(0, 2.25, 0);
    return g;
  }, []);

  useEffect(() => {
    if (!foliageRef.current || !trunkRef.current) return;

    TREE_DATA.forEach((tree, i) => {
      tempObj.position.set(tree.x, groundY, tree.z);
      tempObj.scale.setScalar(tree.scale);
      tempObj.rotation.y = tree.rot;
      tempObj.updateMatrix();

      foliageRef.current!.setMatrixAt(i, tempObj.matrix);
      trunkRef.current!.setMatrixAt(i, tempObj.matrix);

      // Use sRGB hex color — THREE.Color.set() correctly converts from sRGB
      const greenHex = GREEN_PALETTE[i % GREEN_PALETTE.length];
      tempColor.set(greenHex);
      foliageRef.current!.setColorAt(i, tempColor);

      // Warm natural bark brown
      tempColor.set('#6b4226');
      trunkRef.current!.setColorAt(i, tempColor);
    });

    foliageRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceColor!.needsUpdate = true;
    trunkRef.current.instanceMatrix.needsUpdate = true;
    trunkRef.current.instanceColor!.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* Foliage – bright green with flat shading */}
      <instancedMesh ref={foliageRef} args={[foliageGeom, undefined, count]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.7} metalness={0.0} flatShading />
      </instancedMesh>

      {/* Trunks – warm bark brown */}
      <instancedMesh ref={trunkRef} args={[trunkGeom, undefined, count]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.9} metalness={0.0} flatShading />
      </instancedMesh>
    </group>
  );
};
