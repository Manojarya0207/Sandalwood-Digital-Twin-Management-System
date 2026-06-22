/**
 * BoundaryWall – low compound wall enclosing the 100×100 farm platform.
 * Sits directly on the platform edges. Proportioned to be clearly visible
 * but not dominating (about 3 units high, matching a real 3-foot wall).
 */
export const BoundaryWall = () => {
  const farmW = 100;
  const farmD = 100;
  const wallH = 3.0;    // wall height
  const wallT = 0.8;    // wall thickness
  const surfaceY = 0.75; // farm surface
  const wallY = surfaceY + wallH / 2;

  // Coping cap
  const copH = 0.25;
  const copY = surfaceY + wallH + copH / 2;

  // Wall positions: placed AT the platform edge (half inside, half outside)
  const walls: { pos: [number, number, number]; size: [number, number, number] }[] = [
    // North
    { pos: [0, wallY, -farmD / 2], size: [farmW + wallT, wallH, wallT] },
    // South
    { pos: [0, wallY, farmD / 2], size: [farmW + wallT, wallH, wallT] },
    // West
    { pos: [-farmW / 2, wallY, 0], size: [wallT, wallH, farmD] },
    // East
    { pos: [farmW / 2, wallY, 0], size: [wallT, wallH, farmD] },
  ];

  const copings: { pos: [number, number, number]; size: [number, number, number] }[] = [
    { pos: [0, copY, -farmD / 2], size: [farmW + wallT + 0.2, copH, wallT + 0.3] },
    { pos: [0, copY, farmD / 2], size: [farmW + wallT + 0.2, copH, wallT + 0.3] },
    { pos: [-farmW / 2, copY, 0], size: [wallT + 0.3, copH, farmD + 0.2] },
    { pos: [farmW / 2, copY, 0], size: [wallT + 0.3, copH, farmD + 0.2] },
  ];

  // Corner pillar positions
  const corners: [number, number][] = [
    [-farmW / 2, -farmD / 2],
    [farmW / 2, -farmD / 2],
    [-farmW / 2, farmD / 2],
    [farmW / 2, farmD / 2],
  ];

  return (
    <group>
      {/* Main wall bodies */}
      {walls.map((w, i) => (
        <mesh key={`wall-${i}`} castShadow receiveShadow position={w.pos}>
          <boxGeometry args={w.size} />
          <meshStandardMaterial color="#b89070" roughness={0.88} metalness={0.04} />
        </mesh>
      ))}

      {/* Coping caps */}
      {copings.map((c, i) => (
        <mesh key={`cop-${i}`} castShadow receiveShadow position={c.pos}>
          <boxGeometry args={c.size} />
          <meshStandardMaterial color="#d4b896" roughness={0.80} metalness={0.03} />
        </mesh>
      ))}

      {/* Corner pillars */}
      {corners.map(([px, pz], i) => (
        <mesh key={`pil-${i}`} castShadow receiveShadow position={[px, wallY, pz]}>
          <boxGeometry args={[wallT * 1.8, wallH + copH * 2, wallT * 1.8]} />
          <meshStandardMaterial color="#a07850" roughness={0.85} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
};
