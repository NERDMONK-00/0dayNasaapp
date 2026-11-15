import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, Stars } from '@react-three/drei'

function ISSModel() {
  return (
    <group rotation={[0.5, -0.8, 0]} position={[0, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.18, 1.4]} />
        <meshStandardMaterial color="#dfe7f4" metalness={0.7} roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.6, 0.18, 1.2]} />
        <meshStandardMaterial color="#cdd8ea" metalness={0.7} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[1.4, 0.18, 1.1]} />
        <meshStandardMaterial color="#cdd8ea" metalness={0.7} roughness={0.4} />
      </mesh>

      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 2.2, 16]} />
        <meshStandardMaterial color="#dfe7f4" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 2.2, 16]} />
        <meshStandardMaterial color="#dfe7f4" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 1.8, 14]} />
        <meshStandardMaterial color="#9ddcff" emissive="#4da3ff" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, 0, -0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 1.8, 14]} />
        <meshStandardMaterial color="#9ddcff" emissive="#4da3ff" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.75, 0.12, 0.75]} />
        <meshStandardMaterial color="#a7d9ff" emissive="#4da3ff" emissiveIntensity={0.2} />
      </mesh>

      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[0.75, 0.12, 0.75]} />
        <meshStandardMaterial color="#a7d9ff" emissive="#4da3ff" emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

function AstronautFigure() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={[2.1, 0.5, 0.8]} rotation={[0.2, 0.8, -0.6]}>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial color="#f8f0eb" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <capsuleGeometry args={[0.28, 0.9, 8, 18]} />
          <meshStandardMaterial color="#edf5ff" />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <capsuleGeometry args={[0.18, 0.8, 8, 16]} />
          <meshStandardMaterial color="#edf5ff" />
        </mesh>
        <mesh position={[0.42, 0.4, 0]} rotation={[0, 0, Math.PI / 2.8]}>
          <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
          <meshStandardMaterial color="#edf5ff" />
        </mesh>
        <mesh position={[-0.42, 0.4, 0]} rotation={[0, 0, -Math.PI / 2.8]}>
          <capsuleGeometry args={[0.1, 0.8, 8, 16]} />
          <meshStandardMaterial color="#edf5ff" />
        </mesh>
      </group>
    </Float>
  )
}

export function SpaceScene() {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0a1020] shadow-[0_30px_80px_rgba(0,0,0,0.45)] md:h-[560px]">
      <Canvas camera={{ position: [0, 0.8, 6], fov: 42 }}>
        <color attach="background" args={['#0a1020']} />
        <fog attach="fog" args={['#0a1020', 5, 18]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 4, 3]} intensity={1.6} color="#dfeeff" />
        <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#7dd3fc" />
        <Stars radius={30} depth={20} count={2000} factor={4} saturation={0} fade speed={0.8} />
        <ISSModel />
        <AstronautFigure />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
