import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIrrigationStore } from '../../store/irrigationStore';

/**
 * WaterPond – a concrete-walled pond with animated water surface
 * that dynamically rises and falls based on the real-time simulation.
 * It also features an industrial motor/pump assembly beside it.
 */
export const WaterPond = () => {
  const waterRef = useRef<THREE.MeshStandardMaterial>(null);
  const groundY = 0.76; // just above ground surface

  const {
    borewellOn,
    lateralValves,
    waterLevel,
    setWaterLevel,
    setBorewell
  } = useIrrigationStore();

  // Animated water material shimmer & real-time height simulation
  useFrame(({ clock }, delta) => {
    // 1. Color shimmer animation
    if (waterRef.current) {
      const t = clock.getElapsedTime();
      const shimmer = Math.sin(t * 1.2) * 0.04;
      waterRef.current.color.setRGB(0.1 + shimmer, 0.38 + shimmer * 0.5, 0.65 + shimmer);
    }

    // 2. Real-time water level calculation
    // Borewell pump fills the pond at +5.0% per second.
    // Each active lateral drains the pond at -1.0% per second.
    let flowChange = 0;
    if (borewellOn) {
      flowChange += delta * 5.0;
    }
    const activeLateralsCount = lateralValves.filter(Boolean).length;
    flowChange -= activeLateralsCount * delta * 1.0;

    if (flowChange !== 0) {
      const nextLevel = Math.max(0, Math.min(100, waterLevel + flowChange));
      
      // Auto-shutoff borewell pump when pond is full (100%)
      if (nextLevel >= 100 && borewellOn) {
        setBorewell(false);
      }
      
      setWaterLevel(nextLevel);
    }
  });

  const pondW = 20;
  const pondD = 16;
  const wallH = 2.2;
  const wallT = 0.8; // wall thickness

  // Map 0-100% to Y height
  // 0% -> water level Y = 0.05
  // 100% -> water level Y = wallH * 0.85 (1.87)
  const waterPercent = waterLevel / 100;
  const waterY = 0.05 + waterPercent * (wallH * 0.82);
  const waterBoxHeight = Math.max(0.01, waterY);

  return (
    <group position={[-32, groundY, -30]}>

      {/* ───── CONCRETE POND WALLS ───── */}
      {/* North wall */}
      <mesh castShadow receiveShadow position={[0, wallH / 2, -(pondD / 2 + wallT / 2)]}>
        <boxGeometry args={[pondW + wallT * 2, wallH, wallT]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.92} metalness={0.05} />
      </mesh>
      {/* South wall */}
      <mesh castShadow receiveShadow position={[0, wallH / 2, pondD / 2 + wallT / 2]}>
        <boxGeometry args={[pondW + wallT * 2, wallH, wallT]} />
        <meshStandardMaterial color="#8a7a6a" roughness={0.92} metalness={0.05} />
      </mesh>
      {/* West wall */}
      <mesh castShadow receiveShadow position={[-(pondW / 2 + wallT / 2), wallH / 2, 0]}>
        <boxGeometry args={[wallT, wallH, pondD]} />
        <meshStandardMaterial color="#7d6e5f" roughness={0.95} metalness={0.04} />
      </mesh>
      {/* East wall */}
      <mesh castShadow receiveShadow position={[pondW / 2 + wallT / 2, wallH / 2, 0]}>
        <boxGeometry args={[wallT, wallH, pondD]} />
        <meshStandardMaterial color="#7d6e5f" roughness={0.95} metalness={0.04} />
      </mesh>

      {/* Pond floor (concrete base) */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[pondW, 0.2, pondD]} />
        <meshStandardMaterial color="#6b5e50" roughness={1} />
      </mesh>

      {/* Water volume body */}
      <mesh position={[0, waterBoxHeight / 2, 0]} visible={waterLevel > 0}>
        <boxGeometry args={[pondW - 0.2, waterBoxHeight, pondD - 0.2]} />
        <meshStandardMaterial
          ref={waterRef}
          color="#1a61a6"
          roughness={0.04}
          metalness={0.35}
          transparent
          opacity={0.92}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Water surface ripple plane */}
      <mesh position={[0, waterY, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={waterLevel > 0}>
        <planeGeometry args={[pondW - 0.4, pondD - 0.4, 12, 12]} />
        <meshStandardMaterial
          color="#5db8ff"
          roughness={0.02}
          metalness={0.1}
          transparent
          opacity={0.28}
        />
      </mesh>

      {/* ───── INDUSTRIAL MOTOR / PUMP ASSEMBLY ───── */}
      <group position={[pondW / 2 + wallT + 1.5, 0, 0]}>
        {/* Concrete pad */}
        <mesh receiveShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[4.5, 0.16, 4]} />
          <meshStandardMaterial color="#9a9080" roughness={1} />
        </mesh>

        {/* Main motor housing (large cylinder) */}
        <mesh castShadow receiveShadow position={[-0.5, 1.2, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 2.0, 16]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.35} metalness={0.75} />
        </mesh>

        {/* Motor front cap */}
        <mesh castShadow position={[-0.5, 2.22, 0]}>
          <cylinderGeometry args={[0.5, 0.75, 0.25, 16]} />
          <meshStandardMaterial color="#1a252f" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Pump volute (spiral casing) */}
        <mesh castShadow receiveShadow position={[0.9, 0.9, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 1.4, 12]} />
          <meshStandardMaterial color="#34495e" roughness={0.45} metalness={0.65} />
        </mesh>
        {/* Pump flange */}
        <mesh castShadow position={[0.9, 0.9, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.12, 12]} />
          <meshStandardMaterial color="#2c3e50" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Horizontal shaft connecting motor to pump */}
        <mesh castShadow position={[0.2, 0.9, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 1.8, 10]} />
          <meshStandardMaterial color="#7f8c8d" roughness={0.25} metalness={0.9} />
        </mesh>

        {/* Inlet pipe (vertical, from pond) */}
        <mesh castShadow position={[0.9, 0.9, -2.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 3.2, 10]} />
          <meshStandardMaterial color="#5d6d7e" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Inlet bend elbow */}
        <mesh castShadow position={[0.9, 0.9, -0.7]}>
          <torusGeometry args={[0.45, 0.22, 10, 12, Math.PI / 2]} />
          <meshStandardMaterial color="#5d6d7e" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Discharge pipe (discharge to main) */}
        <mesh castShadow position={[0.9, 2.25, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 1.5, 10]} />
          <meshStandardMaterial color="#2980b9" roughness={0.3} metalness={0.65} />
        </mesh>

        {/* Pressure gauge */}
        <mesh castShadow position={[0.3, 1.6, 0.9]}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 12]} />
          <meshStandardMaterial color="#ecf0f1" roughness={0.5} metalness={0.3} />
        </mesh>

        {/* Mounting bolts */}
        {[[-1.5, -1.3], [-1.5, 1.3], [1.5, -1.3], [1.5, 1.3]].map(([bx, bz], idx) => (
          <mesh key={idx} castShadow position={[bx, 0.16, bz]}>
            <cylinderGeometry args={[0.1, 0.1, 0.32, 8]} />
            <meshStandardMaterial color="#bdc3c7" roughness={0.4} metalness={0.8} />
          </mesh>
        ))}

        {/* Cooling fins */}
        {[-0.8, -0.3, 0.2, 0.7].map((y, idx) => (
          <mesh key={idx} castShadow position={[-0.5, 1.2 + y * 0.3, 0]}>
            <torusGeometry args={[0.76, 0.07, 8, 16]} />
            <meshStandardMaterial color="#1c2833" roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
