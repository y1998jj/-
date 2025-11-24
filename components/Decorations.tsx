import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Low Poly Tree Component ---
export const LowPolyTree: React.FC<{ position: [number, number, number], scale?: number }> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 6]} />
        <meshStandardMaterial color="#8B4513" flatShading roughness={1} />
      </mesh>
      {/* Foliage (Layer 1) */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#66cc88" flatShading roughness={1} />
      </mesh>
      {/* Foliage (Layer 2) */}
      <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#88eeaa" flatShading roughness={1} />
      </mesh>
    </group>
  );
};

// --- Cloud Component ---
export const Cloud: React.FC<{ position: [number, number, number], speed?: number }> = ({ position: initialPosition, speed = 0.5 }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
       groupRef.current.position.x += speed * delta;
       // Reset position if it goes too far
       if (groupRef.current.position.x > 60) {
         groupRef.current.position.x = -60;
       }
    }
  });

  return (
    <group ref={groupRef} position={initialPosition}>
        <mesh position={[0, 0, 0]} castShadow>
           <dodecahedronGeometry args={[2.5, 0]} />
           <meshStandardMaterial color="#ffffff" flatShading opacity={0.9} transparent />
        </mesh>
         <mesh position={[2.5, 0.5, 0]} castShadow>
           <dodecahedronGeometry args={[2, 0]} />
           <meshStandardMaterial color="#ffffff" flatShading opacity={0.9} transparent />
        </mesh>
         <mesh position={[-2.5, -0.5, 0]} castShadow>
           <dodecahedronGeometry args={[2.2, 0]} />
           <meshStandardMaterial color="#ffffff" flatShading opacity={0.9} transparent />
        </mesh>
    </group>
  )
}