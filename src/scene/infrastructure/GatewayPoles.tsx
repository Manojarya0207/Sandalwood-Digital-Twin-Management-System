/**
 * GatewayPoles – tall black IoT antenna poles at farm corners
 * matching the reference image: two visible poles with a pink base
 */

const groundY = 0.75;

type PoleProps = {
  position: [number, number, number];
};

const GatewayPole = ({ position }: PoleProps) => {
  const [px, , pz] = position;
  const baseY = groundY;

  return (
    <group position={[px, baseY, pz]}>
      {/* Base box – pink/red like reference */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <boxGeometry args={[1.8, 0.7, 1.8]} />
        <meshStandardMaterial color="#e879a0" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Pole shaft – dark */}
      <mesh castShadow position={[0, 8.5, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 16, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Antenna top – small horizontal bar */}
      <mesh castShadow position={[0.5, 16.7, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 6]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Signal dish / sensor box */}
      <mesh castShadow position={[0, 16.4, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.6]} />
        <meshStandardMaterial color="#4a90e2" roughness={0.3} metalness={0.5} emissive="#1a3a6a" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

export const GatewayPoles = () => {
  const positions: [number, number, number][] = [
    [-46, 0, -28],  // Top-left corner (near pond) – matches reference
    [44, 0, 38],    // Bottom-right corner – matches reference
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <GatewayPole key={i} position={pos} />
      ))}
    </group>
  );
};
