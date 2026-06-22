import { OrbitControls, Sky } from '@react-three/drei';
import { FarmGround } from './environment/FarmGround';
import { BoundaryWall } from './environment/BoundaryWall';
import { FarmTrees } from './trees/FarmTrees';
import { IrrigationPipes } from './irrigation/IrrigationPipes';
import { WaterPond } from './environment/WaterPond';
import { Borewell } from './infrastructure/Borewell';
import { GatewayPoles } from './infrastructure/GatewayPoles';
import { SensorNodes } from './infrastructure/SensorNodes';

export const FarmScene = () => {
  return (
    <>
      {/* Sky & Atmosphere */}
      <Sky
        distance={450000}
        sunPosition={[1, 0.4, 0]}
        inclination={0.5}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={8}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Soft gradient ambient */}
      <ambientLight intensity={1.2} color="#f0f4f8" />

      {/* Main sun light — warm from top-right */}
      <directionalLight
        castShadow
        position={[80, 120, 60]}
        intensity={2.0}
        color="#fff8ee"
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0005}
      />

      {/* Fill light from opposite side */}
      <directionalLight position={[-60, 40, -40]} intensity={0.4} color="#dceeff" />

      {/* Scene components */}
      <FarmGround />
      <BoundaryWall />
      <WaterPond />
      <Borewell />
      <IrrigationPipes />
      <FarmTrees />
      <GatewayPoles />
      <SensorNodes />

      {/* Camera controls — isometric-friendly */}
      <OrbitControls
        makeDefault
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={30}
        maxDistance={400}
        target={[0, 0, 0]}
      />
    </>
  );
};
