import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'
import { toonify, ToonLights } from '../theme/toon3d'

// The project is intentionally browser-only and should not crash if a GLB asset is missing.
type Pose = { x: number; y: number; s: number; ry: number }
const POSES: Record<string, Pose> = {
  '/': { x: 2.0, y: 0, s: 1.4, ry: -0.5 },
  '/astronauts': { x: -2.2, y: -0.2, s: 1.0, ry: 0.5 },
  '/test': { x: 2.4, y: -0.4, s: 0.8, ry: -0.8 },
  '/results': { x: -2.4, y: -0.4, s: 0.8, ry: 0.8 },
  '/how-it-works': { x: 2.4, y: -0.2, s: 0.9, ry: -0.3 },
  '/about': { x: 0, y: -0.2, s: 1.0, ry: 0 },
}

function makeFallbackAstronaut() {
  const group = new THREE.Group()

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.42, 1.2, 8, 18),
    new THREE.MeshToonMaterial({ color: '#edf3ff' }),
  )
  torso.position.y = 0.2
  group.add(torso)

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 24, 24),
    new THREE.MeshToonMaterial({ color: '#f5efe7' }),
  )
  head.position.y = 1.55
  group.add(head)

  const leftArm = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.11, 0.8, 8, 14),
    new THREE.MeshToonMaterial({ color: '#edf3ff' }),
  )
  leftArm.position.set(-0.56, 0.3, 0)
  leftArm.rotation.z = -Math.PI / 2.5
  group.add(leftArm)

  const rightArm = leftArm.clone()
  rightArm.position.x = 0.56
  rightArm.rotation.z = Math.PI / 2.5
  group.add(rightArm)

  const legs = new THREE.Group()
  const leftLeg = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.16, 0.9, 8, 14),
    new THREE.MeshToonMaterial({ color: '#edf3ff' }),
  )
  leftLeg.position.set(-0.16, -1.05, 0)
  legs.add(leftLeg)

  const rightLeg = leftLeg.clone()
  rightLeg.position.x = 0.16
  legs.add(rightLeg)
  group.add(legs)

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.07, 16, 64),
    new THREE.MeshStandardMaterial({ color: '#4de1ff', emissive: '#4de1ff', emissiveIntensity: 0.5 }),
  )
  ring.rotation.x = Math.PI / 2
  ring.position.y = -0.1
  group.add(ring)

  group.rotation.z = -0.2
  return group
}

function Astronaut() {
  const { pathname } = useLocation()
  const group = useRef<THREE.Group>(null!)
  const model = useMemo(() => {
    const clone = makeFallbackAstronaut()
    return toonify(clone)
  }, [])

  useFrame(({ viewport }, dt) => {
    const base = POSES[pathname] ?? POSES['/about']
    const narrow = viewport.width < 5
    const p: Pose = narrow ? { x: 0, y: 1.5, s: base.s * 0.5, ry: base.ry } : base
    const g = group.current
    const t = 1 - Math.pow(0.002, dt)
    g.position.x = THREE.MathUtils.lerp(g.position.x, p.x, t)
    g.position.y = THREE.MathUtils.lerp(g.position.y, p.y, t)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, p.ry, t)
    const s = THREE.MathUtils.lerp(g.scale.x, p.s, t)
    g.scale.setScalar(s)
  })

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.8}>
        <primitive object={model} />
      </Float>
    </group>
  )
}

export default function SceneBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 1.5]}>
        <ToonLights />
        <Suspense fallback={null}>
          <Astronaut />
        </Suspense>
      </Canvas>
    </div>
  )
}
