/**
 * SensorNodes – small pink IoT sensor boxes placed near trees
 * matching the reference image
 */

const groundY = 0.76;

type SensorNodeProps = {
  position: [number, number, number];
};

const SensorNode = ({ position }: SensorNodeProps) => {
  const [px, , pz] = position;

  return (
    <group position={[px, groundY, pz]}>
      {/* Sensor body */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial
          color="#f472b6"
          roughness={0.3}
          metalness={0.2}
          emissive="#be185d"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Small antenna */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>
      {/* LED indicator dot */}
      <mesh position={[0.3, 0.35, 0.41]}>
        <sphereGeometry args={[0.07, 6, 6]} />
        <meshStandardMaterial color="#4ade80" emissive="#16a34a" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};

// Scatter a sensor node near every other tree
const SENSOR_POSITIONS: [number, number, number][] = [
  [-17, 0, -32],
  [5,   0, -32],
  [27,  0, -32],
  [-28, 0, -21],
  [-6,  0, -21],
  [16,  0, -21],
  [38,  0, -21],
  [-28, 0,  1],
  [-6,  0,  1],
  [16,  0,  1],
  [38,  0,  1],
  [-28, 0, 23],
  [-6,  0, 23],
  [16,  0, 23],
  [-28, 0, 34],
  [16,  0, 34],
  [38,  0, 34],
];

export const SensorNodes = () => {
  return (
    <group>
      {SENSOR_POSITIONS.map((pos, i) => (
        <SensorNode key={i} position={pos} />
      ))}
    </group>
  );
};
