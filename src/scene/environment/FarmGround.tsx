/**
 * FarmGround – raised sandy platform matching reference image
 * Brown/tan base with a dark border edge
 */
export const FarmGround = () => {
  const W = 100; // farm width
  const D = 100; // farm depth
  const H = 1.5; // platform height
  const edge = 0.5;

  return (
    <group>
      {/* Main sandy ground */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[W, H, D]} />
        <meshStandardMaterial color="#c8956c" roughness={0.85} />
      </mesh>

      {/* Dark border edge (slightly larger, slightly lower) */}
      <mesh receiveShadow position={[0, -H / 2 - edge / 2, 0]}>
        <boxGeometry args={[W + edge * 2, edge, D + edge * 2]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.9} />
      </mesh>

      {/* Ground shadow plane below */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -H / 2 - edge - 0.01, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#d0dce8" roughness={1} />
      </mesh>
    </group>
  );
};
