import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIrrigationStore } from '../../store/irrigationStore';

/**
 * Borewell with realistic gushing water stream.
 * Water flow uses a custom vertex/fragment shader that:
 *   • Scrolls a noise pattern along the stream for turbulent motion
 *   • Wobbles vertices for natural irregularity
 *   • Fades opacity from solid at nozzle to transparent at splash
 *   • Emits white-blue glow like real sunlit water
 */

const BORE_X = -48;
const BORE_Z = -30;
const GROUND_Y = 0.76;
const POND_WALL_X = -42.4;
const POND_WATER_Y = GROUND_Y + 2.2 * 0.55 + 0.2;

const CASING_BLUE = '#8fb5c4';
const CASING_DARKER = '#6d9aad';
const FLANGE_RUST = '#8b5e3c';
const FLANGE_DARK = '#6b4226';
const BRASS_COLOR = '#b8953e';
const PIPE_COLOR = '#2980b9';
const BOLT_COLOR = '#a07040';

/* ═══════════════════════════════════════════════
   CUSTOM WATER SHADER – animated flowing stream
═══════════════════════════════════════════════ */
const waterVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vProgress;

  void main() {
    vUv = uv;
    vProgress = uv.x; // 0 at start, 1 at end along the tube

    // Wobble vertices perpendicular to flow direction
    vec3 pos = position;
    float wobbleFreq = 12.0;
    float wobbleAmp = 0.04 + vProgress * 0.08; // more wobble downstream
    pos.x += sin(uTime * 3.0 + position.y * wobbleFreq + position.z * 5.0) * wobbleAmp;
    pos.z += cos(uTime * 2.5 + position.y * wobbleFreq * 0.7) * wobbleAmp * 0.7;

    // Slight pulsing thickness
    float pulse = 1.0 + sin(uTime * 6.0 + vProgress * 20.0) * 0.05;
    pos.y *= pulse;
    pos.z *= pulse;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const waterFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vProgress;

  // Simple noise function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    // Scrolling UV for flow animation
    vec2 flowUV = vUv;
    flowUV.x -= uTime * 1.8; // scroll speed along stream

    // Layered noise for turbulent water texture
    float n1 = noise(flowUV * vec2(8.0, 3.0));
    float n2 = noise(flowUV * vec2(16.0, 6.0) + 0.5);
    float n3 = noise(flowUV * vec2(32.0, 10.0) + 1.0);
    float turbulence = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Water base color: light blue → white foam
    vec3 deepBlue = vec3(0.35, 0.65, 0.88);
    vec3 lightBlue = vec3(0.70, 0.88, 0.98);
    vec3 white = vec3(0.95, 0.97, 1.0);

    // Mix colors based on turbulence and position
    vec3 col = mix(deepBlue, lightBlue, turbulence);
    // Add white foam streaks
    float foam = smoothstep(0.55, 0.75, turbulence);
    col = mix(col, white, foam * 0.7);

    // Brighter at center of tube (radial), darker at edges
    float radial = abs(vUv.y - 0.5) * 2.0; // 0 at center, 1 at edge
    col = mix(col, white, (1.0 - radial) * 0.3);

    // Opacity: solid near nozzle, slightly transparent downstream
    float alpha = 0.92 - vProgress * 0.25;
    // Edges are more transparent
    alpha *= 1.0 - radial * 0.4;
    // Add sparkle flashes
    float sparkle = smoothstep(0.85, 0.95, noise(flowUV * vec2(40.0, 15.0) + uTime * 3.0));
    col += sparkle * 0.3;

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ═══════════════════════════════════════════════
   REALISTIC WATER STREAM COMPONENT
═══════════════════════════════════════════════ */
const RealisticWaterStream = ({ pipeEnd, landing }: {
  pipeEnd: [number, number, number];
  landing: [number, number, number];
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const sprayRef = useRef<THREE.InstancedMesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  // Parabolic curve for the stream
  const tubeGeom = useMemo(() => {
    const sx = pipeEnd[0], sy = pipeEnd[1], sz = pipeEnd[2];
    const ex = landing[0], ey = landing[1], ez = landing[2];
    const dx = ex - sx, dz = ez - sz;

    // Realistic parabolic trajectory: shoots out horizontally then falls
    const points: THREE.Vector3[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = sx + dx * t;
      const z = sz + dz * t;
      // Parabola: y = start_y + v0_y*t - 0.5*g*t^2
      // Water exits horizontally (v0_y slight upward from pressure) then gravity pulls it
      const upKick = 0.5; // initial upward momentum
      const gravity = 3.5;
      const y = sy + upKick * t - gravity * t * t;
      // Clamp to not go below landing
      points.push(new THREE.Vector3(x, Math.max(y, ey), z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    // Tube radius: thicker at start, slightly thinner mid-stream, spreads at splash
    const g = new THREE.TubeGeometry(curve, 40, 0.15, 10, false);
    return g;
  }, [pipeEnd, landing]);

  // Spray/mist particles around the stream
  const sprayGeom = useMemo(() => new THREE.SphereGeometry(1, 4, 4), []);
  const sprayCount = 40;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Curve for positioning spray
  const streamCurve = useMemo(() => {
    const sx = pipeEnd[0], sy = pipeEnd[1], sz = pipeEnd[2];
    const ex = landing[0], ey = landing[1], ez = landing[2];
    const dx = ex - sx, dz = ez - sz;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = sx + dx * t;
      const z = sz + dz * t;
      const y = sy + 0.5 * t - 3.5 * t * t;
      points.push(new THREE.Vector3(x, Math.max(y, ey), z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [pipeEnd, landing]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();

    // Animate spray particles
    if (sprayRef.current) {
      const t = clock.getElapsedTime();
      for (let i = 0; i < sprayCount; i++) {
        const seed = Math.abs(Math.sin(i * 73.1 + 17.3));
        const speed = 0.3 + seed * 0.5;
        const phase = seed * 6.28;
        const progress = ((t * speed + phase) % 2.0) / 2.0;

        const curveT = Math.min(progress * 1.1, 1.0);
        const pos = streamCurve.getPointAt(curveT);

        // Random offset from stream center (spray outward)
        const sprayDist = (0.1 + progress * 0.5) * (0.5 + seed);
        const angle = seed * 6.28 + t * (1 + seed * 2);
        pos.x += Math.cos(angle) * sprayDist * 0.4;
        pos.y += Math.sin(angle) * sprayDist * 0.3 + 0.1;
        pos.z += Math.sin(angle * 1.5) * sprayDist * 0.5;

        dummy.position.copy(pos);
        // Size: small near nozzle, bigger near splash
        const sz = (0.03 + seed * 0.05) * (0.5 + progress * 0.8);
        // Fade in and out
        const fade = progress < 0.1 ? progress / 0.1 : (progress > 0.85 ? (1 - progress) / 0.15 : 1);
        dummy.scale.setScalar(sz * fade);
        dummy.updateMatrix();
        sprayRef.current.setMatrixAt(i, dummy.matrix);
      }
      sprayRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main stream body — custom shader for flowing water */}
      <mesh ref={meshRef}>
        <primitive object={tubeGeom} />
        <shaderMaterial
          vertexShader={waterVertexShader}
          fragmentShader={waterFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spray/mist particles */}
      <instancedMesh ref={sprayRef} args={[sprayGeom, undefined, sprayCount]}>
        <meshStandardMaterial
          color="#e1f5fe"
          emissive="#b3e5fc"
          emissiveIntensity={0.2}
          roughness={0.05}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════
   SPLASH IMPACT – rings + flying droplets + foam
═══════════════════════════════════════════════ */
const SplashImpact = ({ position }: { position: [number, number, number] }) => {
  const ringsRef = useRef<THREE.Group>(null);
  const dropsRef = useRef<THREE.InstancedMesh>(null);
  const dropGeom = useMemo(() => new THREE.SphereGeometry(1, 5, 5), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dropCount = 20;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Expanding ripple rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const phase = (t * 1.0 + i * 1.1) % 2.5;
        const progress = phase / 2.5;
        const scale = 0.3 + progress * 2.0;
        mesh.scale.set(scale, scale, 1);
        (mesh.material as THREE.MeshStandardMaterial).opacity = (1 - progress) * 0.4;
      });
    }

    // Flying splash droplets
    if (dropsRef.current) {
      for (let i = 0; i < dropCount; i++) {
        const seed = Math.abs(Math.sin(i * 47.3 + 91.7));
        const speed = 0.6 + seed * 0.8;
        const cycle = ((t * speed + seed * 4) % 2.2) / 2.2;

        const angle = seed * Math.PI * 2 + i * 0.5;
        const upForce = 0.8 + seed * 1.2;
        const outForce = 0.6 + seed * 1.0;

        if (cycle < 0.45) {
          const p = cycle / 0.45;
          dummy.position.set(
            position[0] + Math.cos(angle) * outForce * p,
            position[1] + upForce * p - 2.5 * p * p, // parabolic
            position[2] + Math.sin(angle) * outForce * p * 0.7,
          );
          const sc = (0.03 + seed * 0.05) * (1 - p * 0.6);
          dummy.scale.setScalar(sc);
        } else {
          dummy.position.set(0, -200, 0);
          dummy.scale.setScalar(0.001);
        }
        dummy.updateMatrix();
        dropsRef.current.setMatrixAt(i, dummy.matrix);
      }
      dropsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Ripple rings */}
      <group ref={ringsRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={position} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.05, 8, 20]} />
            <meshStandardMaterial
              color="#b3e5fc"
              emissive="#81d4fa"
              emissiveIntensity={0.3}
              transparent
              opacity={0.4}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Foam disc at impact */}
      <mesh position={[position[0], position[1] + 0.03, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 14]} />
        <meshStandardMaterial
          color="#e8f5fd"
          emissive="#b3e5fc"
          emissiveIntensity={0.25}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* Flying splash droplets */}
      <instancedMesh ref={dropsRef} args={[dropGeom, undefined, dropCount]}>
        <meshStandardMaterial
          color="#e1f5fe"
          emissive="#e1f5fe"
          emissiveIntensity={0.15}
          roughness={0.03}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════
   PIPE FLOW PULSE
═══════════════════════════════════════════════ */
const FlowPulse = ({ from, to, speed, phase }: {
  from: [number, number, number]; to: [number, number, number]; speed: number; phase: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const dir = useMemo(() => new THREE.Vector3(to[0]-from[0], to[1]-from[1], to[2]-from[2]), [from, to]);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1), dir.clone().normalize()
  ), [dir]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.getElapsedTime() * speed + phase) % 1);
    ref.current.position.set(from[0] + dir.x*t, from[1] + dir.y*t, from[2] + dir.z*t);
    (ref.current.material as THREE.MeshStandardMaterial).opacity = Math.sin(t * Math.PI) * 0.8;
    ref.current.scale.setScalar(0.8 + Math.sin(t * Math.PI) * 0.3);
  });

  return (
    <mesh ref={ref} quaternion={quat}>
      <torusGeometry args={[0.22, 0.045, 8, 14]} />
      <meshStandardMaterial color="#4fc3f7" emissive="#29b6f6" emissiveIntensity={0.5}
        roughness={0.1} transparent opacity={0.8} depthWrite={false} />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════
   BOREWELL – main export
═══════════════════════════════════════════════ */
export const Borewell = () => {
  const boreTopY = GROUND_Y + 1.8;
  const pipeRunY = boreTopY + 1.2;

  const pipeStart: [number, number, number] = [BORE_X, pipeRunY, BORE_Z];
  const pipeEnd: [number, number, number] = [POND_WALL_X + 1, pipeRunY, BORE_Z];

  // Stream exits from pipe nozzle tip
  const streamStart: [number, number, number] = [pipeEnd[0] + 0.4, pipeRunY, BORE_Z];
  // Lands on pond water surface
  const streamLanding: [number, number, number] = [POND_WALL_X + 4.0, POND_WATER_Y, BORE_Z];

  const borewellOn = useIrrigationStore((state) => state.borewellOn);

  return (
    <group>
      {/* ═══════ BOREWELL STRUCTURE ═══════ */}
      <group position={[BORE_X, GROUND_Y, BORE_Z]}>
        <mesh receiveShadow position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.0, 16]} />
          <meshStandardMaterial color="#8b7355" roughness={1.0} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.40, 0.42, 1.8, 16]} />
          <meshStandardMaterial color={CASING_BLUE} roughness={0.72} metalness={0.12} />
        </mesh>
        <mesh castShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.43, 0.44, 0.35, 16]} />
          <meshStandardMaterial color={CASING_DARKER} roughness={0.8} metalness={0.1} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.82, 0]}>
          <cylinderGeometry args={[0.58, 0.58, 0.12, 18]} />
          <meshStandardMaterial color={FLANGE_RUST} roughness={0.88} metalness={0.22} />
        </mesh>
        <mesh castShadow position={[0, 1.89, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.06, 14]} />
          <meshStandardMaterial color={FLANGE_DARK} roughness={0.9} metalness={0.18} />
        </mesh>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} castShadow position={[Math.cos(a)*0.46, 1.88, Math.sin(a)*0.46]}>
              <cylinderGeometry args={[0.05, 0.05, 0.13, 6]} />
              <meshStandardMaterial color={BOLT_COLOR} roughness={0.75} metalness={0.35} />
            </mesh>
          );
        })}
        <mesh castShadow position={[0, 2.08, 0]}>
          <cylinderGeometry args={[0.16, 0.20, 0.32, 10]} />
          <meshStandardMaterial color={BRASS_COLOR} roughness={0.55} metalness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 2.27, 0]}>
          <cylinderGeometry args={[0.20, 0.20, 0.10, 6]} />
          <meshStandardMaterial color="#a08030" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh castShadow position={[0, 2.62, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.8, 10]} />
          <meshStandardMaterial color={PIPE_COLOR} roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh castShadow position={[0.28, 3.0, 0]}>
          <torusGeometry args={[0.30, 0.18, 10, 12, Math.PI / 2]} />
          <meshStandardMaterial color={PIPE_COLOR} roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* ═══════ DELIVERY PIPE ═══════ */}
      <mesh castShadow receiveShadow
        position={[(pipeStart[0]+pipeEnd[0])/2, pipeRunY, BORE_Z]}
        rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, Math.abs(pipeEnd[0]-pipeStart[0]), 10]} />
        <meshStandardMaterial color={PIPE_COLOR} roughness={0.3} metalness={0.6} />
      </mesh>
      {[-46, -44, -42].map((cx, i) => (
        <mesh key={i} castShadow position={[cx, pipeRunY, BORE_Z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 10]} />
          <meshStandardMaterial color={PIPE_COLOR} roughness={0.35} metalness={0.55} />
        </mesh>
      ))}
      {[-46, -44].map((sx, i) => (
        <group key={i} position={[sx, GROUND_Y, BORE_Z]}>
          <mesh castShadow position={[0, (pipeRunY-GROUND_Y)/2, 0]}>
            <cylinderGeometry args={[0.08, 0.10, pipeRunY-GROUND_Y, 8]} />
            <meshStandardMaterial color="#7f8c8d" roughness={0.6} metalness={0.5} />
          </mesh>
          <mesh receiveShadow position={[0, 0.05, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.5]} />
            <meshStandardMaterial color="#6b6b6b" roughness={0.8} metalness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Nozzle tip */}
      <mesh castShadow position={[pipeEnd[0]+0.15, pipeRunY, BORE_Z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.20, 0.4, 10]} />
        <meshStandardMaterial color="#1a5276" roughness={0.4} metalness={0.55} />
      </mesh>

      {/* ═══════ PIPE FLOW PULSES ═══════ */}
      {borewellOn && (
        <>
          <FlowPulse from={pipeStart} to={pipeEnd} speed={0.45} phase={0} />
          <FlowPulse from={pipeStart} to={pipeEnd} speed={0.45} phase={0.33} />
          <FlowPulse from={pipeStart} to={pipeEnd} speed={0.45} phase={0.66} />
        </>
      )}

      {/* ═══════ GUSHING WATER STREAM & SPLASH ═══════ */}
      {borewellOn && (
        <>
          <RealisticWaterStream pipeEnd={streamStart} landing={streamLanding} />
          <SplashImpact position={streamLanding} />
        </>
      )}
    </group>
  );
};
