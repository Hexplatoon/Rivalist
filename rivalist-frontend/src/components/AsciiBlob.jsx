import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

const AsciiBlob = ({ position = [0, 0, 0], color = "#4444ff", emissiveColor = "#000066" }) => {
  const mesh = useRef();
  const geometryRef = useRef();
  const materialRef = useRef();
  const originalPositions = useRef([]);
  const phaseOffset = useRef(Math.random() * 1000);

  useEffect(() => {
    if (geometryRef.current) {
      const positions = geometryRef.current.attributes.position.array;
      originalPositions.current = Float32Array.from(positions);
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime + phaseOffset.current;
    const meshObj = mesh.current;
    const geometry = geometryRef.current;
    if (!meshObj || !geometry) return;

    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const ox = originalPositions.current[i];
      const oy = originalPositions.current[i + 1];
      const oz = originalPositions.current[i + 2];

      const noise = noise3D(ox * 0.3, oy * 0.3, time * 0.8);
      const displacement = noise * 0.4;

      const length = Math.sqrt(ox * ox + oy * oy + oz * oz);
      positions[i] = ox + (ox / length) * displacement;
      positions[i + 1] = oy + (oy / length) * displacement;
      positions[i + 2] = oz + (oz / length) * displacement;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();

    // Breathing
    const scale = 1 + Math.sin(time * 1.2) * 0.2;
    meshObj.scale.set(scale, scale, scale);

    // Emissive glow
    if (materialRef.current) {
      materialRef.current.emissive.setHSL((time * 0.1) % 1, 0.5, 0.5);
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry ref={geometryRef} args={[3.5, 128, 128]} />
      <meshPhongMaterial
        ref={materialRef}
        color={color}
        emissive={emissiveColor}
        shininess={100}
        specular="#ffffff"
      />
    </mesh>
  );
};

export default AsciiBlob;
