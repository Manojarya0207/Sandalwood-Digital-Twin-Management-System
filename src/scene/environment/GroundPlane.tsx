export const GroundPlane = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[640, 640]} />
      {/* Following PRD palette, no green. Using a slate/grey base for the ground */}
      <meshStandardMaterial color="#E8EDF3" roughness={0.8} />
    </mesh>
  );
};
