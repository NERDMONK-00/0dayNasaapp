import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { AlertLevel, VitalReading } from '../types'

interface Astronaut3DProps {
  status?: AlertLevel
  reading?: VitalReading
  interactive?: boolean
  onSelectSubsystem?: (subsystem: string) => void
  selectedSubsystem?: string | null
}

function ProceduralAstronautModel({
  status = 'normal',
  reading,
  onSelectSubsystem,
  selectedSubsystem,
}: {
  status: AlertLevel
  reading?: VitalReading
  onSelectSubsystem?: (subsystem: string) => void
  selectedSubsystem?: string | null
}) {
  const group = useRef<THREE.Group>(null!)
  const chestLedRef = useRef<THREE.Mesh>(null!)
  const holoRingRef = useRef<THREE.Group>(null!)
  const visorRef = useRef<THREE.Mesh>(null!)

  // Color tone based on alert level
  const statusColor = useMemo(() => {
    if (status === 'critical') return new THREE.Color('#ef4444')
    if (status === 'warning') return new THREE.Color('#f59e0b')
    return new THREE.Color('#00f0ff')
  }, [status])

  // Materials
  const suitFabric = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f1f5f9',
        roughness: 0.65,
        metalness: 0.15,
      }),
    [],
  )

  const suitJoints = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.45,
        metalness: 0.7,
      }),
    [],
  )

  const goldVisorMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f59e0b',
        emissive: '#d97706',
        emissiveIntensity: 0.25,
        metalness: 0.95,
        roughness: 0.08,
        reflectivity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),
    [],
  )

  const dcmMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f172a',
        metalness: 0.85,
        roughness: 0.3,
      }),
    [],
  )

  const titaniumMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        metalness: 0.9,
        roughness: 0.2,
      }),
    [],
  )

  // Subtle floating microgravity drift & biometric pulse animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const bpm = reading?.hr ?? 72
    const heartPulse = Math.sin(t * ((bpm / 60) * Math.PI * 2)) * 0.5 + 0.5

    if (chestLedRef.current) {
      const mat = chestLedRef.current.material as THREE.MeshStandardMaterial
      const intensity = status === 'critical' ? (Math.sin(t * 8) > 0 ? 2.5 : 0.2) : 1.2 + heartPulse * 0.6
      mat.emissiveIntensity = intensity
    }

    if (holoRingRef.current) {
      holoRingRef.current.rotation.y = t * 0.3
      holoRingRef.current.rotation.z = Math.sin(t * 0.4) * 0.15
    }

    if (group.current) {
      // Microgravity breathing and sway
      group.current.rotation.y = Math.sin(t * 0.5) * 0.08
    }
  })

  const isHelmetSelected = selectedSubsystem === 'helmet'
  const isDcmSelected = selectedSubsystem === 'dcm'
  const isPlssSelected = selectedSubsystem === 'plss'
  const isBootsSelected = selectedSubsystem === 'boots'

  return (
    <group ref={group}>
      {/* ================= 1. HELMET & VISOR ASSEMBLY ================= */}
      <group
        position={[0, 1.48, 0]}
        scale={isHelmetSelected ? 1.06 : 1.0}
        onClick={(e) => {
          e.stopPropagation()
          onSelectSubsystem?.('helmet')
        }}
      >
        {/* Outer Helmet Dome */}
        <mesh material={suitFabric}>
          <sphereGeometry args={[0.36, 32, 28]} />
        </mesh>

        {/* Neck Bearing Ring */}
        <mesh position={[0, -0.32, 0]} material={titaniumMat}>
          <cylinderGeometry args={[0.26, 0.28, 0.07, 32]} />
        </mesh>

        {/* Gold Reflective EVA Visor */}
        <mesh
          ref={visorRef}
          position={[0, 0.02, 0.16]}
          rotation={[-0.08, 0, 0]}
          material={goldVisorMat}
        >
          <sphereGeometry args={[0.31, 32, 20, 0, Math.PI, 0, Math.PI * 0.68]} />
        </mesh>

        {/* Brow Sunshade Peak */}
        <mesh position={[0, 0.24, 0.22]} rotation={[0.4, 0, 0]} material={suitJoints}>
          <boxGeometry args={[0.34, 0.05, 0.12]} />
        </mesh>

        {/* Dual Helmet Spotlights (Left & Right) */}
        <group position={[-0.34, 0.08, 0.12]}>
          <mesh material={suitJoints}>
            <cylinderGeometry args={[0.045, 0.055, 0.12, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
        <group position={[0.34, 0.08, 0.12]}>
          <mesh material={suitJoints}>
            <cylinderGeometry args={[0.045, 0.055, 0.12, 16]} />
          </mesh>
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Comm Antenna */}
        <mesh position={[-0.28, 0.35, -0.1]} material={titaniumMat}>
          <cylinderGeometry args={[0.012, 0.012, 0.28, 8]} />
        </mesh>
      </group>

      {/* ================= 2. EMU HARD UPPER TORSO (HUT) ================= */}
      <group
        position={[0, 0.72, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectSubsystem?.('torso')
        }}
      >
        {/* Main Torso Chassis */}
        <mesh material={suitFabric}>
          <boxGeometry args={[0.74, 0.82, 0.44]} />
        </mesh>

        {/* Ribbed Thermal Panels */}
        <mesh position={[0, 0.02, 0.22]} material={suitJoints}>
          <boxGeometry args={[0.62, 0.74, 0.03]} />
        </mesh>

        {/* ================= CHEST DCM (Display & Control Module) ================= */}
        <group
          position={[0, 0.1, 0.26]}
          scale={isDcmSelected ? 1.08 : 1.0}
          onClick={(e) => {
            e.stopPropagation()
            onSelectSubsystem?.('dcm')
          }}
        >
          {/* Main DCM Console Box */}
          <mesh material={dcmMaterial}>
            <boxGeometry args={[0.42, 0.36, 0.09]} />
          </mesh>

          {/* Mini Telemetry Readout Screen */}
          <mesh position={[0, 0.08, 0.05]}>
            <planeGeometry args={[0.32, 0.12]} />
            <meshBasicMaterial color="#022c22" />
          </mesh>

          {/* Glowing Status LED / Vital Indicator */}
          <mesh ref={chestLedRef} position={[0, 0.08, 0.052]}>
            <planeGeometry args={[0.28, 0.08]} />
            <meshStandardMaterial
              color={statusColor}
              emissive={statusColor}
              emissiveIntensity={1.4}
            />
          </mesh>

          {/* Control Valves & D-Rings */}
          <mesh position={[-0.12, -0.09, 0.06]} rotation={[0, 0, Math.PI / 4]} material={titaniumMat}>
            <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
          </mesh>
          <mesh position={[0.12, -0.09, 0.06]} rotation={[0, 0, -Math.PI / 4]} material={titaniumMat}>
            <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
          </mesh>

          {/* NASA Crest Decal Plaque */}
          <mesh position={[-0.12, -0.02, 0.05]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color="#1e40af" />
          </mesh>
        </group>
      </group>

      {/* ================= 3. PLSS LIFE SUPPORT BACKPACK ================= */}
      <group
        position={[0, 0.82, -0.32]}
        scale={isPlssSelected ? 1.08 : 1.0}
        onClick={(e) => {
          e.stopPropagation()
          onSelectSubsystem?.('plss')
        }}
      >
        {/* Main PLSS Box Chassis */}
        <mesh material={suitFabric}>
          <boxGeometry args={[0.7, 0.96, 0.34]} />
        </mesh>

        {/* Sublimator Radiator Louvers on Top */}
        <mesh position={[0, 0.44, 0]} material={suitJoints}>
          <boxGeometry args={[0.56, 0.12, 0.28]} />
        </mesh>

        {/* Twin High-Pressure Oxygen Cylinders */}
        <mesh position={[-0.18, 0.02, -0.16]} material={titaniumMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.65, 16]} />
        </mesh>
        <mesh position={[0.18, 0.02, -0.16]} material={titaniumMat}>
          <cylinderGeometry args={[0.08, 0.08, 0.65, 16]} />
        </mesh>

        {/* SAFER Emergency Cold-Gas Thrusters (4 Nozzles) */}
        <mesh position={[-0.24, -0.42, 0]} rotation={[Math.PI, 0, 0]} material={titaniumMat}>
          <coneGeometry args={[0.04, 0.08, 12]} />
        </mesh>
        <mesh position={[0.24, -0.42, 0]} rotation={[Math.PI, 0, 0]} material={titaniumMat}>
          <coneGeometry args={[0.04, 0.08, 12]} />
        </mesh>
        <mesh position={[-0.24, -0.42, -0.12]} rotation={[Math.PI, 0, 0]} material={titaniumMat}>
          <coneGeometry args={[0.04, 0.08, 12]} />
        </mesh>
        <mesh position={[0.24, -0.42, -0.12]} rotation={[Math.PI, 0, 0]} material={titaniumMat}>
          <coneGeometry args={[0.04, 0.08, 12]} />
        </mesh>

        {/* Umbilical Loop Hose from PLSS to Torso */}
        <mesh position={[0.34, 0, 0.22]} rotation={[0, 0, 0.6]} material={suitJoints}>
          <torusGeometry args={[0.18, 0.035, 12, 24, Math.PI]} />
        </mesh>
      </group>

      {/* ================= 4. ARTICULATED ARMS & GLOVES ================= */}
      {/* Left Arm */}
      <group position={[-0.52, 0.94, 0]}>
        {/* Shoulder Joint Ring */}
        <mesh material={suitJoints}>
          <sphereGeometry args={[0.14, 16, 16]} />
        </mesh>

        {/* Upper Arm */}
        <mesh position={[-0.08, -0.28, 0]} rotation={[0, 0, 0.35]} material={suitFabric}>
          <capsuleGeometry args={[0.11, 0.34, 8, 16]} />
        </mesh>

        {/* Elbow Joint */}
        <mesh position={[-0.2, -0.52, 0.04]} material={suitJoints}>
          <sphereGeometry args={[0.11, 14, 14]} />
        </mesh>

        {/* Forearm & Wrist Module */}
        <mesh position={[-0.24, -0.76, 0.16]} rotation={[0.45, 0, 0.2]} material={suitFabric}>
          <capsuleGeometry args={[0.1, 0.32, 8, 16]} />
        </mesh>

        {/* Wrist Telemetry HUD Display */}
        <mesh position={[-0.26, -0.82, 0.25]} rotation={[0.45, 0, 0.2]}>
          <boxGeometry args={[0.12, 0.08, 0.03]} />
          <meshStandardMaterial
            color={statusColor}
            emissive={statusColor}
            emissiveIntensity={1.8}
          />
        </mesh>

        {/* Pressurized Glove */}
        <mesh position={[-0.28, -0.98, 0.28]} material={suitJoints}>
          <boxGeometry args={[0.12, 0.16, 0.09]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.52, 0.94, 0]}>
        {/* Shoulder Joint Ring */}
        <mesh material={suitJoints}>
          <sphereGeometry args={[0.14, 16, 16]} />
        </mesh>

        {/* Upper Arm */}
        <mesh position={[0.08, -0.28, 0]} rotation={[0, 0, -0.35]} material={suitFabric}>
          <capsuleGeometry args={[0.11, 0.34, 8, 16]} />
        </mesh>

        {/* Elbow Joint */}
        <mesh position={[0.2, -0.52, 0.04]} material={suitJoints}>
          <sphereGeometry args={[0.11, 14, 14]} />
        </mesh>

        {/* Forearm */}
        <mesh position={[0.24, -0.76, 0.16]} rotation={[0.45, 0, -0.2]} material={suitFabric}>
          <capsuleGeometry args={[0.1, 0.32, 8, 16]} />
        </mesh>

        {/* Pressurized Glove */}
        <mesh position={[0.28, -0.98, 0.28]} material={suitJoints}>
          <boxGeometry args={[0.12, 0.16, 0.09]} />
        </mesh>
      </group>

      {/* ================= 5. LOWER TORSO ASSEMBLY & BOOTS ================= */}
      <group
        position={[0, 0.18, 0]}
        scale={isBootsSelected ? 1.05 : 1.0}
        onClick={(e) => {
          e.stopPropagation()
          onSelectSubsystem?.('boots')
        }}
      >
        {/* Waist Rotation Bearing */}
        <mesh material={suitJoints}>
          <cylinderGeometry args={[0.3, 0.28, 0.14, 24]} />
        </mesh>

        {/* Left Leg */}
        <group position={[-0.22, -0.35, 0]}>
          {/* Thigh */}
          <mesh rotation={[0.08, 0, 0.08]} material={suitFabric}>
            <capsuleGeometry args={[0.13, 0.45, 8, 16]} />
          </mesh>

          {/* Knee Pad */}
          <mesh position={[0, -0.32, 0.09]} material={suitJoints}>
            <boxGeometry args={[0.18, 0.16, 0.08]} />
          </mesh>

          {/* Shin */}
          <mesh position={[0, -0.65, 0.02]} material={suitFabric}>
            <capsuleGeometry args={[0.12, 0.44, 8, 16]} />
          </mesh>

          {/* Heavy Lunar/Martian EVA Boot */}
          <group position={[0, -0.98, 0.08]}>
            <mesh material={suitJoints}>
              <boxGeometry args={[0.22, 0.18, 0.38]} />
            </mesh>
            {/* Magnetic Sole Tread */}
            <mesh position={[0, -0.09, 0]} material={titaniumMat}>
              <boxGeometry args={[0.23, 0.03, 0.39]} />
            </mesh>
          </group>
        </group>

        {/* Right Leg */}
        <group position={[0.22, -0.35, 0]}>
          {/* Thigh */}
          <mesh rotation={[0.08, 0, -0.08]} material={suitFabric}>
            <capsuleGeometry args={[0.13, 0.45, 8, 16]} />
          </mesh>

          {/* Knee Pad */}
          <mesh position={[0, -0.32, 0.09]} material={suitJoints}>
            <boxGeometry args={[0.18, 0.16, 0.08]} />
          </mesh>

          {/* Shin */}
          <mesh position={[0, -0.65, 0.02]} material={suitFabric}>
            <capsuleGeometry args={[0.12, 0.44, 8, 16]} />
          </mesh>

          {/* Heavy Lunar/Martian EVA Boot */}
          <group position={[0, -0.98, 0.08]}>
            <mesh material={suitJoints}>
              <boxGeometry args={[0.22, 0.18, 0.38]} />
            </mesh>
            {/* Magnetic Sole Tread */}
            <mesh position={[0, -0.09, 0]} material={titaniumMat}>
              <boxGeometry args={[0.23, 0.03, 0.39]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ================= 6. HOLOGRAPHIC BIO-TELEMETRY RINGS ================= */}
      <group ref={holoRingRef} position={[0, 0.7, 0]}>
        {/* Inner Vital Halo Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.016, 16, 64]} />
          <meshStandardMaterial
            color={statusColor}
            emissive={statusColor}
            emissiveIntensity={1.8}
            wireframe
          />
        </mesh>

        {/* Outer Orbit Reticle Ring */}
        <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
          <torusGeometry args={[1.25, 0.008, 12, 48]} />
          <meshStandardMaterial
            color={statusColor}
            emissive={statusColor}
            emissiveIntensity={1.2}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>
    </group>
  )
}

export function Astronaut3D({
  status = 'normal',
  reading,
  interactive = true,
  onSelectSubsystem,
  selectedSubsystem,
}: Astronaut3DProps) {
  return (
    <div className="relative h-full w-full select-none">
      <Canvas
        camera={{ position: [0, 0.5, 3.8], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[0, -2, 2]} intensity={0.5} color="#00f0ff" />

        <Stars radius={40} depth={20} count={600} factor={3} saturation={0} fade speed={1} />
        <Sparkles count={40} scale={4} size={1.8} speed={0.4} opacity={0.4} color="#38bdf8" />

        <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.45}>
          <ProceduralAstronautModel
            status={status}
            reading={reading}
            onSelectSubsystem={onSelectSubsystem}
            selectedSubsystem={selectedSubsystem}
          />
        </Float>

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2.4}
            maxDistance={5.5}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3.5}
          />
        )}
      </Canvas>
    </div>
  )
}
