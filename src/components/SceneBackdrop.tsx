import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'

// Atmospheric glow and orbital planet in deep space
function OrbitalPlanet({ isMars = true }: { isMars?: boolean }) {
  const planetRef = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)
  const atmosphereRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.02
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.026
    }
  })

  // Planet surface colors
  const surfaceColor = isMars ? '#993d1f' : '#1e3a8a'
  const atmosphereColor = isMars ? '#fb923c' : '#38bdf8'

  const planetMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: surfaceColor,
        roughness: 0.85,
        metalness: 0.1,
      }),
    [surfaceColor],
  )

  const cloudMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: isMars ? '#fed7aa' : '#ffffff',
        transparent: true,
        opacity: isMars ? 0.25 : 0.4,
        blending: THREE.AdditiveBlending,
      }),
    [isMars],
  )

  const atmoMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: atmosphereColor,
        transparent: true,
        opacity: 0.35,
        side: THREE.BackSide,
      }),
    [atmosphereColor],
  )

  return (
    <group position={[0, -7.8, -5]} rotation={[0.4, 0, -0.2]}>
      {/* Planetary Body (Mars / Earth Horizon Curve) */}
      <mesh ref={planetRef} material={planetMat}>
        <sphereGeometry args={[7.2, 64, 48]} />
      </mesh>

      {/* Atmospheric Cloud / Dust Layer */}
      <mesh ref={cloudsRef} material={cloudMat}>
        <sphereGeometry args={[7.25, 48, 36]} />
      </mesh>

      {/* Atmospheric Rayleigh Scattering Glow Limb */}
      <mesh ref={atmosphereRef} material={atmoMat}>
        <sphereGeometry args={[7.42, 48, 36]} />
      </mesh>
    </group>
  )
}

// Distant Orbital Relay Satellite
function OrbitalRelay() {
  const relayRef = useRef<THREE.Group>(null!)
  const beaconRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (relayRef.current) {
      relayRef.current.position.x = Math.sin(t * 0.08) * 3 + 2.5
      relayRef.current.position.y = Math.cos(t * 0.06) * 1 + 1.8
      relayRef.current.rotation.y = t * 0.1
    }
    if (beaconRef.current) {
      const mat = beaconRef.current.material as THREE.MeshBasicMaterial
      mat.color.set(Math.sin(t * 4) > 0 ? '#00f0ff' : '#0369a1')
    }
  })

  return (
    <group ref={relayRef} position={[2.5, 1.8, -3.5]} scale={0.45}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Central Satellite Chassis */}
        <mesh>
          <boxGeometry args={[0.3, 0.45, 0.3]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Solar Arrays (Left & Right) */}
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[1.0, 0.28, 0.02]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#0284c7" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0, 0]}>
          <boxGeometry args={[1.0, 0.28, 0.02]} />
          <meshStandardMaterial color="#1e3a8a" emissive="#0284c7" emissiveIntensity={0.3} metalness={0.8} />
        </mesh>

        {/* Communications Dish */}
        <mesh position={[0, 0.3, 0]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.02, 0.08, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Pulsing Navigation Beacon */}
        <mesh ref={beaconRef} position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </Float>
    </group>
  )
}

export default function SceneBackdrop() {
  const { pathname } = useLocation()
  const isMars = pathname !== '/about' // Earth for about page, Mars for mission pages

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[6, 8, 4]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-6, -2, -2]} intensity={0.4} color="#38bdf8" />

        {/* Multi-layered Deep Space Starfield */}
        <Stars radius={50} depth={30} count={900} factor={3.5} saturation={0.2} fade speed={0.6} />
        <Sparkles count={50} scale={8} size={1.6} speed={0.2} opacity={0.35} color="#38bdf8" />

        {/* Cinematic Orbital Planet Horizon */}
        <OrbitalPlanet isMars={isMars} />

        {/* Subtle Autonomous Orbital Satellite */}
        <OrbitalRelay />
      </Canvas>
    </div>
  )
}
