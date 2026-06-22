import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { TREE_DATA } from '../trees/FarmTrees';
import { useIrrigationStore } from '../../store/irrigationStore';

/**
 * IrrigationPipes – complete drip irrigation system with:
 *   • Offset pipelines (shifted Z-2.5m away from trees)
 *   • Interactive selection: Click to select, hover to show pointer
 *   • Glowing outline/highlight for selected pipe
 *   • Floating HTML Tooltip with ID/Name and real-time Flow Status
 *   • PVC ball valves (horizontal, aligned with pipes)
 *   • Drip emitters and Z-aligned sub-pipes to trees
 */

/* ─── Constants ─── */
const PIPE_OUTER_R  = 0.30;
const PIPE_COLOR    = '#2980b9';
const PIPE_COLLAR   = '#1a5276';
const SUPPORT_COLOR = '#7f8c8d';
const groundY       = 0.76;

type Vec3 = [number, number, number];

/* ═══════════════════════════════════════════════════
   PIPE SEGMENT – Clickable & Highlightable
═══════════════════════════════════════════════════ */
const Pipe = ({ start, end, radius = PIPE_OUTER_R, color = PIPE_COLOR, pipeId, pipeName, isOpen = true }: {
  start: Vec3; end: Vec3; radius?: number; color?: string; pipeId?: string; pipeName?: string; isOpen?: boolean;
}) => {
  const mid: Vec3 = [(start[0]+end[0])/2, (start[1]+end[1])/2, (start[2]+end[2])/2];
  const dx = end[0]-start[0], dy = end[1]-start[1], dz = end[2]-start[2];
  const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
  const dir = new THREE.Vector3(dx,dy,dz).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
  const c1: Vec3 = [start[0]+dx*0.1, start[1]+dy*0.1, start[2]+dz*0.1];
  const c2: Vec3 = [start[0]+dx*0.9, start[1]+dy*0.9, start[2]+dz*0.9];

  const selectedPipeId = useIrrigationStore((state) => state.selectedPipeId);
  const setSelectedPipeId = useIrrigationStore((state) => state.setSelectedPipeId);
  const isSelected = !!pipeId && selectedPipeId === pipeId;

  // Visual feedback: glow & primary blue color when selected
  const displayColor = isSelected ? '#4A90E2' : color;
  const emissiveColor = isSelected ? '#6FAFF7' : '#000000';
  const emissiveIntensity = isSelected ? 0.8 : 0.0;

  return (
    <group>
      <mesh
        position={mid}
        quaternion={quat}
        castShadow
        receiveShadow
        onClick={(e) => {
          if (pipeId) {
            e.stopPropagation();
            setSelectedPipeId(isSelected ? null : pipeId);
          }
        }}
        onPointerOver={(e) => {
          if (pipeId) {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          if (pipeId) {
            document.body.style.cursor = 'auto';
          }
        }}
      >
        <cylinderGeometry args={[radius, radius, length, 10]} />
        <meshStandardMaterial
          color={displayColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.35}
          metalness={0.45}
        />
      </mesh>
      <mesh position={c1} quaternion={quat} castShadow>
        <cylinderGeometry args={[radius*1.28, radius*1.28, 0.22, 10]} />
        <meshStandardMaterial color={isSelected ? '#4A90E2' : PIPE_COLLAR} roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={c2} quaternion={quat} castShadow>
        <cylinderGeometry args={[radius*1.28, radius*1.28, 0.22, 10]} />
        <meshStandardMaterial color={isSelected ? '#4A90E2' : PIPE_COLLAR} roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Floating Interactive Tooltip using Drei HTML */}
      {isSelected && (
        <Html position={[mid[0], mid[1] + 1.2, mid[2]]} center distanceFactor={15}>
          <div className="bg-white text-[#1E293B] border border-[#E8EDF3] rounded-2xl shadow-2xl p-5 w-72 font-sans select-none pointer-events-auto z-50 transition-all">
            <div className="flex items-center justify-between border-b border-[#E8EDF3] pb-2 mb-2">
              <span className="font-extrabold text-[11px] tracking-wider text-[#4A90E2] uppercase">Irrigation Link</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPipeId(null);
                  document.body.style.cursor = 'auto';
                }}
                className="text-[#64748B] hover:text-[#1E293B] font-bold text-sm p-1 rounded hover:bg-[#F8F9FB] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-sm font-extrabold mb-1 text-[#1E293B]">{pipeName || 'Network Pipe'}</div>
            <div className="text-[10px] text-[#64748B] mb-3.5 font-mono">UID: {pipeId.toUpperCase()}</div>
            
            <div className="flex items-center justify-between text-xs bg-[#F8F9FB] rounded-xl p-3 border border-[#E8EDF3]">
              <span className="text-[#64748B] font-semibold">Flow Status</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                isOpen 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border border-rose-100'
              }`}>
                {isOpen ? 'FLOW ACTIVE' : 'NO FLOW'}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

/* ═══════════════════════════════════════════════════
   PIPE SUPPORT BRACKET
═══════════════════════════════════════════════════ */
const PipeSupport = ({ x, z, pipeY }: { x: number; z: number; pipeY: number }) => {
  const postH = pipeY - groundY;
  const postY = groundY + postH / 2;
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow receiveShadow position={[-0.5, postY, 0]}>
        <boxGeometry args={[0.12, postH, 0.12]} />
        <meshStandardMaterial color={SUPPORT_COLOR} roughness={0.6} metalness={0.55} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.5, postY, 0]}>
        <boxGeometry args={[0.12, postH, 0.12]} />
        <meshStandardMaterial color={SUPPORT_COLOR} roughness={0.6} metalness={0.55} />
      </mesh>
      <mesh castShadow position={[0, pipeY, 0]}>
        <boxGeometry args={[1.1, 0.12, 0.12]} />
        <meshStandardMaterial color={SUPPORT_COLOR} roughness={0.6} metalness={0.55} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════════
   JUNCTION FITTING
═══════════════════════════════════════════════════ */
const JunctionFitting = ({ position, radius = PIPE_OUTER_R }: {
  position: Vec3; radius?: number;
}) => (
  <group position={position}>
    <mesh castShadow>
      <sphereGeometry args={[radius * 1.5, 12, 12]} />
      <meshStandardMaterial color={PIPE_COLLAR} roughness={0.3} metalness={0.6} />
    </mesh>
    <mesh castShadow>
      <torusGeometry args={[radius * 1.5, 0.08, 8, 14]} />
      <meshStandardMaterial color="#1a3a4a" roughness={0.4} metalness={0.55} />
    </mesh>
  </group>
);

/* ═══════════════════════════════════════════════════
   PVC BALL VALVE – HORIZONTAL, aligned with pipe
═══════════════════════════════════════════════════ */
const VALVE_BODY  = '#f0e6d3';
const VALVE_SOCK  = '#e8dcc8';
const VALVE_BULGE = '#ede2d0';
const HANDLE_BLUE = '#1a5fa8';

const BallValve = ({ position, pipeAxis = 'x', isOpen = true }: {
  position: Vec3;
  pipeAxis?: 'x' | 'z';
  isOpen?: boolean;
}) => {
  const rotY = pipeAxis === 'z' ? Math.PI / 2 : 0;
  const handleRotY = isOpen ? 0 : Math.PI / 2;
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Left socket */}
      <mesh castShadow receiveShadow position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.45, 12]} />
        <meshStandardMaterial color={VALVE_BODY} roughness={0.65} metalness={0.05} />
      </mesh>
      {/* Right socket */}
      <mesh castShadow receiveShadow position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.45, 12]} />
        <meshStandardMaterial color={VALVE_BODY} roughness={0.65} metalness={0.05} />
      </mesh>
      {/* Socket collar rings */}
      <mesh castShadow position={[-0.68, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 12]} />
        <meshStandardMaterial color={VALVE_SOCK} roughness={0.6} metalness={0.06} />
      </mesh>
      <mesh castShadow position={[0.68, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 12]} />
        <meshStandardMaterial color={VALVE_SOCK} roughness={0.6} metalness={0.06} />
      </mesh>
      {/* Center ball housing */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.36, 14, 14]} />
        <meshStandardMaterial color={VALVE_BULGE} roughness={0.55} metalness={0.06} />
      </mesh>
      {/* Stem */}
      <mesh castShadow position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.32, 8]} />
        <meshStandardMaterial color={VALVE_SOCK} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Handle group */}
      <group position={[0, 0.56, 0]} rotation={[0, handleRotY, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.95, 0.10, 0.20]} />
          <meshStandardMaterial color={HANDLE_BLUE} roughness={0.45} metalness={0.15} />
        </mesh>
        {[-0.35, -0.18, 0, 0.18, 0.35].map((xr, i) => (
          <mesh key={i} castShadow position={[xr, 0.06, 0]}>
            <boxGeometry args={[0.035, 0.035, 0.22]} />
            <meshStandardMaterial color="#174e8a" roughness={0.5} metalness={0.1} />
          </mesh>
        ))}
        <mesh castShadow position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.12, 10]} />
          <meshStandardMaterial color={HANDLE_BLUE} roughness={0.4} metalness={0.18} />
        </mesh>
      </group>
    </group>
  );
};

/* ═══════════════════════════════════════════════════
   WATER DROPLET SYSTEM
═══════════════════════════════════════════════════ */
const DROPS_PER = 5;

const WaterDroplets = ({ position }: { position: Vec3 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const splashRef = useRef<THREE.InstancedMesh>(null);
  
  const seeds = useMemo(() => {
    const s: { speed: number; phase: number; dx: number; dz: number; sz: number }[] = [];
    for (let i = 0; i < DROPS_PER; i++) {
      const hash = Math.abs(Math.sin(position[0] * 12.9 + position[2] * 78.2 + i * 43.7)) * 10000;
      s.push({
        speed: 1.0 + (hash % 100) / 140,
        phase: (hash % 50) / 50 * Math.PI * 2,
        dx:    ((hash % 30) / 30 - 0.5) * 0.15,
        dz:    ((hash % 40) / 40 - 0.5) * 0.15,
        sz:    0.06 + (hash % 20) / 200,
      });
    }
    return s;
  }, [position]);

  const dropGeom = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);
  const splashGeom = useMemo(() => new THREE.TorusGeometry(1, 0.15, 6, 12), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dropCol = useMemo(() => new THREE.Color('#4fc3f7'), []);
  const splashCol = useMemo(() => new THREE.Color('#81d4fa'), []);

  const fallDist = 4.5;
  const cycleDur = 3.0;

  useFrame(({ clock }) => {
    if (!meshRef.current || !splashRef.current) return;
    const t = clock.getElapsedTime();

    seeds.forEach((s, i) => {
      const cycle = ((t * s.speed + s.phase) % cycleDur) / cycleDur;
      const fallProgress = Math.min(cycle / 0.7, 1.0);

      const dy = fallProgress * fallDist;
      dummy.position.set(
        position[0] + s.dx * fallProgress,
        position[1] - dy,
        position[2] + s.dz * fallProgress,
      );
      const elongation = 1.0 + (1 - fallProgress) * 0.5;
      const fade = fallProgress > 0.9 ? (1 - fallProgress) / 0.1 : (fallProgress < 0.05 ? fallProgress / 0.05 : 1);
      const sc = s.sz * fade;
      dummy.scale.set(sc, sc * elongation, sc);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, dropCol);

      const splashPhase = cycle > 0.7 ? (cycle - 0.7) / 0.3 : 0;
      const splashY = position[1] - fallDist;
      dummy.position.set(
        position[0] + s.dx,
        splashY + 0.02,
        position[2] + s.dz,
      );
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      const splashScale = splashPhase > 0 ? 0.15 + splashPhase * 0.35 : 0.001;
      dummy.scale.setScalar(splashScale);
      dummy.updateMatrix();
      splashRef.current!.setMatrixAt(i, dummy.matrix);
      const sc2 = splashCol.clone();
      sc2.multiplyScalar(1 - splashPhase * 0.5);
      splashRef.current!.setColorAt(i, sc2);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    splashRef.current.instanceMatrix.needsUpdate = true;
    if (splashRef.current.instanceColor) splashRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[dropGeom, undefined, DROPS_PER]}>
        <meshStandardMaterial color="#4fc3f7" roughness={0.05} metalness={0.1} transparent opacity={0.85} depthWrite={false} />
      </instancedMesh>
      <instancedMesh ref={splashRef} args={[splashGeom, undefined, DROPS_PER]}>
        <meshStandardMaterial color="#81d4fa" roughness={0.1} metalness={0.0} transparent opacity={0.5} depthWrite={false} />
      </instancedMesh>
    </>
  );
};

/* ═══════════════════════════════════════════════════
   DRIP EMITTER
   Dripper is near the tree trunk (treeX + 1.5, treeZ).
   It connects to the lateral pipe (shifted to treeZ - 2.5) via a Z branch pipe.
═══════════════════════════════════════════════════ */
const DripEmitter = ({ treeX, treeZ, pipeY, isOpen = true }: {
  treeX: number; treeZ: number; pipeY: number; isOpen?: boolean;
}) => {
  const emitterX = treeX + 1.5;
  const emitterZ = treeZ;
  const emitterY = pipeY;
  const dripTipY = groundY + 0.6;

  return (
    <group>
      {/* Short vertical drop-pipe from lateral branch to dripper nozzle */}
      <mesh castShadow position={[emitterX, (emitterY + dripTipY) / 2, emitterZ]}>
        <cylinderGeometry args={[0.08, 0.08, emitterY - dripTipY, 8]} />
        <meshStandardMaterial color="#1a5276" roughness={0.45} metalness={0.5} />
      </mesh>

      {/* Horizontal connector from lateral (at treeZ - 2.5) to the vertical drop pipe (at treeZ) */}
      <mesh castShadow position={[emitterX, pipeY, treeZ - 1.25]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
        <meshStandardMaterial color={PIPE_COLOR} roughness={0.35} metalness={0.45} />
      </mesh>

      {/* Dripper nozzle */}
      <mesh castShadow position={[emitterX, dripTipY - 0.12, emitterZ]}>
        <cylinderGeometry args={[0.06, 0.14, 0.28, 8]} />
        <meshStandardMaterial color="#0d3b66" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Drip ring */}
      <mesh castShadow position={[emitterX, dripTipY - 0.26, emitterZ]}>
        <torusGeometry args={[0.08, 0.025, 8, 12]} />
        <meshStandardMaterial color="#1565c0" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Wet soil patch */}
      <mesh receiveShadow position={[emitterX, groundY + 0.01, emitterZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 12]} />
        <meshStandardMaterial color="#8a6942" roughness={1} transparent opacity={0.6} />
      </mesh>

      {/* Droplet animations */}
      {isOpen && <WaterDroplets position={[emitterX, dripTipY - 0.3, emitterZ]} />}
    </group>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════ */
export const IrrigationPipes = () => {
  const pipeY = groundY + PIPE_OUTER_R + 0.55;

  // The trees rows run at Z = -32, -21, -10, 1, 12, 23, 34
  const rowZPositions  = [-32, -21, -10, 1, 12, 23, 34];
  const lateralEnd     = 40;
  const trunkX         = -35;

  const trunkStart:    Vec3 = [trunkX, pipeY, -37];
  const trunkEnd:      Vec3 = [trunkX, pipeY, 38];
  const subTrunkStart: Vec3 = [-21, pipeY, -30];
  const subTrunkEnd:   Vec3 = [trunkX, pipeY, -30];

  const lateralSupportXs = [-24, -13, -2, 9, 20, 31];
  const lateralValveX = trunkX + 2.5;

  const { borewellOn, lateralValves, waterLevel } = useIrrigationStore();
  const hasWater = waterLevel > 0;

  return (
    <group>
      {/* ── MAIN TRUNK PIPE (Pipe 1) ── */}
      <Pipe 
        start={trunkStart} 
        end={trunkEnd} 
        radius={PIPE_OUTER_R * 1.3} 
        pipeId="pipe-1" 
        pipeName="Main Supply Line" 
        isOpen={borewellOn} 
      />
      {rowZPositions.map((z, i) => (
        <PipeSupport key={`ts-${i}`} x={trunkX} z={z - 2.5} pipeY={pipeY} />
      ))}

      {/* ── SUB-TRUNK (Pipe 2) ── */}
      <Pipe 
        start={subTrunkStart} 
        end={subTrunkEnd} 
        radius={PIPE_OUTER_R * 1.15} 
        pipeId="pipe-2" 
        pipeName="Pond Delivery Line" 
        isOpen={hasWater} 
      />
      <PipeSupport x={(subTrunkStart[0] + subTrunkEnd[0]) / 2} z={-30} pipeY={pipeY} />

      {/* VALVE: at pond outlet */}
      <BallValve position={[subTrunkStart[0] + 1.8, pipeY, subTrunkStart[2]]} pipeAxis="x" isOpen={hasWater} />

      {/* VALVE: at sub-trunk entry into main trunk */}
      <BallValve position={[trunkX + 0.5, pipeY, -30]} pipeAxis="x" isOpen={hasWater} />

      {/* ── LATERAL ROW PIPES (Pipe 3 to Pipe 9) ── */}
      {rowZPositions.map((z, i) => (
        <Pipe 
          key={`lat-${i}`} 
          start={[trunkX, pipeY, z - 2.5]} 
          end={[lateralEnd, pipeY, z - 2.5]} 
          pipeId={`pipe-${i + 3}`} 
          pipeName={`Lateral Pipe Row ${i + 1}`} 
          isOpen={lateralValves[i] && hasWater} 
        />
      ))}

      {/* Lateral supports (shifted by -2.5) */}
      {rowZPositions.map((z, ri) =>
        lateralSupportXs.map((x, si) => (
          <PipeSupport key={`ls-${ri}-${si}`} x={x} z={z - 2.5} pipeY={pipeY} />
        ))
      )}

      {/* VALVES: at start of every lateral (shifted by -2.5) */}
      {rowZPositions.map((z, i) => (
        <BallValve key={`lv-${i}`} position={[lateralValveX, pipeY, z - 2.5]} pipeAxis="x" isOpen={lateralValves[i] && hasWater} />
      ))}

      {/* ── JUNCTION FITTINGS ── */}
      {rowZPositions.map((z, i) => (
        <JunctionFitting key={`jf-${i}`} position={[trunkX, pipeY, z - 2.5]} radius={PIPE_OUTER_R * 1.3} />
      ))}
      <JunctionFitting position={subTrunkStart} radius={PIPE_OUTER_R * 1.15} />
      <JunctionFitting position={[trunkX, pipeY, -30]} radius={PIPE_OUTER_R * 1.3} />

      {/* ── DRIP EMITTERS: one beside EACH tree ── */}
      {TREE_DATA.map((tree, i) => {
        const rowIndex = rowZPositions.indexOf(tree.z);
        const isOpen = rowIndex !== -1 ? lateralValves[rowIndex] && hasWater : hasWater;
        return (
          <DripEmitter key={`drip-${i}`} treeX={tree.x} treeZ={tree.z} pipeY={pipeY} isOpen={isOpen} />
        );
      })}
    </group>
  );
};
