import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

function makeGradient(steps = 4) {
  const data = new Uint8Array(steps)
  for (let i = 0; i < steps; i++) data[i] = Math.round(((i + 1) / steps) * 255)
  const tex = new THREE.DataTexture(data, steps, 1, THREE.RedFormat)
  tex.minFilter = tex.magFilter = THREE.NearestFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  return tex
}

function makeOutlineMaterial(color = '#120f3a', thickness = 0.02) {
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide })

  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `vec3 transformed = position + normal * ${thickness.toFixed(4)};`,
    )
  }

  return material
}

export function toonify(root: THREE.Object3D, opts: { steps?: number; outline?: string; thickness?: number } = {}) {
  const { steps = 4, outline = '#120f3a', thickness = 0.02 } = opts
  const gradient = makeGradient(steps)
  const meshes: THREE.Mesh[] = []

  root.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      meshes.push(object as THREE.Mesh)
    }
  })

  meshes.forEach((mesh) => {
    const previous = mesh.material as THREE.MeshStandardMaterial
    mesh.material = new THREE.MeshToonMaterial({
      color: previous.color ?? new THREE.Color('#ffffff'),
      map: previous.map ?? null,
      gradientMap: gradient,
    })

    if (!(mesh as THREE.SkinnedMesh).isSkinnedMesh) {
      const shell = new THREE.Mesh(mesh.geometry, makeOutlineMaterial(outline, thickness))
      shell.name = 'outline'
      mesh.add(shell)
    }
  })

  return root
}

export function ToonModel({
  url,
  ...props
}: { url: string } & React.JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF(url)
  const toon = useMemo(() => toonify(scene.clone(true)), [scene])
  return <primitive object={toon} {...props} />
}

export function ToonLights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={2} color="#fff3d1" />
      <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#4de1ff" />
    </>
  )
}
