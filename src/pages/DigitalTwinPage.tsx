import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FarmScene } from '../scene/FarmScene';
import { Loader } from '@react-three/drei';

export default function DigitalTwinPage() {
  return (
    <div className="w-full h-full relative bg-[#e0e8ef]">
      <Canvas
        shadows
        camera={{ position: [120, 100, 120], fov: 45, near: 0.1, far: 2000 }}
        gl={{ antialias: true, toneMapping: 4 }}
      >
        <Suspense fallback={null}>
          <FarmScene />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
