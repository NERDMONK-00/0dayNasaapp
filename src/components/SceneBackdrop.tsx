import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'
import { useMissionState } from '../state/store'

type Pose = { x: number; y: number; s: number; ry: number; rx: number }

const POSES: Record<string, Pose> = {
  '/': { x: 2.1, y: -0.1, s: 1.15, ry: -0.4, rx: 0.1 },
  '/astronauts': { x: -2.3, y: -0.2, s: 0.95, ry: 0.5, rx: 0 },
  '/test': { x: 2.3, y: -0.3, s: 0.85, ry: -0.6, rx: -0.1 },
  '/results': { x: -2.2, y: -0.3, s: 0.85, ry: 0.6, rx: 0.1 },
  '/how-it-works': { x: 2.2, y: -0.2, s: 0.9, ry: -0.3, rx: 0 },
  '/about': { x: 0, y: -0.4, s: 0.9, ry: 0, rx: 0.05 },
}

function BackdropAstronaut() {
  const { pathname } = useLocation()
  const { missionState, selectedAstronautId } = useMissionState()
  const reading = missionState.currentReadings[selectedAstronautId]
  const group = useRef<THREE.Group>(null!)
  const ledRef = useRef<THREE.Mesh>(null!)

  const statusColor = useMemo(() => {
    if (reading.spo2 < 90 || reading.temp > 38.5 || reading.hr > 120) {
      return new THREE.Color('#ef4444')
    }
    if (reading.hr > 90 || reading.spo2 < 95 || reading.temp > 37.6) {
      return new THREE.Color('#f59e0b')
    }
    return new THREE.Color('#38bdf8')
  }, [reading])

  useFrame(({ viewport }, dt) => {
    const base = POSES[pathname] ?? POSES['/about']
    const isNarrow = viewport.width < 6.5
    const p: Pose = isNarrow
      ? { x: 0, y: 1.8, s: base.s * 0.45, ry: base.ry, rx: base.rx }
      : base

    const g = group.current
    if (!g) return

    const t = 1 - Math.pow(0.003, dt)
    g.position.x = THREE.MathUtils.lerp(g.position.x, p.x, t)
    g.position.y = THREE.MathUtils.lerp(g.position.y, p.y, t)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, p.ry, t)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, p.rx, t)
    const currentScale = THREE.MathUtils.lerp(g.scale.x, p.s, t)
    g.scale.setScalar(currentScale)

    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshStandardMaterial
      mat.color.copy(statusColor)
      mat.emissive.copy(statusColor)
    }
  })

  // Procedural backdrop model
  const suitMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.65,
        metalness: 0.2,
      }),
    [],
  )
  const visorMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f59e0b',
        emissive: '#b45309',
        emissiveIntensity: 0.3,
        metalness: 0.95,
        roughness: 0.1,
      }),
    [],
  )
  const jointMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.4,
        metalness: 0.7,
      }),
    [],
  )

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        {/* Helmet */}
        <group position={[0, 1.45, 0]}>
          <mesh material={suitMat}>
            <sphereGeometry args={[0.35, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.02, 0.15]} rotation={[-0.08, 0, 0]} material={visorMat}>
            <sphereGeometry args={[0.3, 24, 16, 0, Math.PI, 0, Math.PI * 0.68]} />
          </mesh>
        </group>

        {/* Torso */}
        <group position={[0, 0.72, 0]}>
          <mesh material={suitMat}>
            <boxGeometry args={[0.72, 0.8, 0.42]} />
          </mesh>
          {/* Chest DCM Console */}
          <mesh position={[0, 0.1, 0.23]} material={jointMat}>
            <boxGeometry args={[0.4, 0.34, 0.08]} />
          </mesh>
          {/* Glowing Status LED */}
          <mesh ref={ledRef} position={[0, 0.12, 0.28]}>
            <planeGeometry args={[0.26, 0.08]} />
            <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={1.5} />
          </mesh>
          {/* PLSS Backpack */}
          <mesh position={[0, 0.08, -0.3]} material={suitMat}>
            <boxGeometry args={[0.66, 0.9, 0.32]} />
          </mesh>
          {/* Twin O2 Tanks */}
          <mesh position={[-0.16, 0.08, -0.48]} material={jointMat}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 14]} />
          </mesh>
          <mesh position={[0.16, 0.08, -0.48]} material={jointMat}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 14]} />
          </mesh>
        </group>

        {/* Left Arm */}
        <group position={[-0.5, 0.92, 0]}>
          <mesh rotation={[0, 0, 0.4]} material={suitMat}>
            <capsuleGeometry args={[0.11, 0.7, 6, 12]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group position={[0.5, 0.92, 0]}>
          <mesh rotation={[0, 0, -0.4]} material={suitMat}>
            <capsuleGeometry args={[0.11, 0.7, 6, 12]} />
          </mesh>
        </group>

        {/* Legs */}
        <group position={[0, 0.15, 0]}>
          <mesh position={[-0.2, -0.55, 0]} material={suitMat}>
            <capsuleGeometry args={[0.13, 0.85, 6, 12]} />
          </mesh>
          <mesh position={[0.2, -0.55, 0]} material={suitMat}>
            <capsuleGeometry args={[0.13, 0.85, 6, 12]} />
          </mesh>
        </group>

        {/* Subtle Biometric Aura Ring */}
        <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.92, 0.012, 12, 48]} />
          <meshStandardMaterial
            color={statusColor}
            emissive={statusColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  )
}

export default function SceneBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-85 transition-opacity duration-700"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 4]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#38bdf8" />

        <Stars radius={45} depth={25} count={500} factor={3} saturation={0} fade speed={0.8} />
        <Sparkles count={30} scale={5} size={1.5} speed={0.3} opacity={0.3} color="#38bdf8" />

        <BackdropAstronaut />
      </Canvas>
    </div>
  )
}
