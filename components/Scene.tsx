import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { SoftShadows, Loader, TransformControls } from '@react-three/drei';
import { Controls } from './Controls';
import { MainVilla, Annex } from './House';
import { LowPolyTree, Cloud } from './Decorations';
import * as THREE from 'three';

// Component to handle dynamic FOV updates
const CameraHandler: React.FC<{ fov: number }> = ({ fov }) => {
  const { camera } = useThree();
  
  // Update FOV
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);

  return null;
};

interface SceneProps {
  fov: number;
  showLines: boolean;
  transformMode: 'translate' | 'rotate';
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export const Scene: React.FC<SceneProps> = ({ 
  fov, 
  showLines, 
  transformMode,
  selectedId,
  setSelectedId
}) => {
  const mainRef = useRef<THREE.Group>(null);
  const annexRef = useRef<THREE.Group>(null);
  const orbitControlsRef = useRef<any>(null); // Ref to access OrbitControls directly

  // Determine which object ref to attach controls to
  const selectedRef = selectedId === 'main' ? mainRef : selectedId === 'annex' ? annexRef : null;

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [20, 10, 30], fov: fov }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        className="w-full h-full"
        // Clicking the background deselects
        onPointerMissed={(e) => {
          if (e.type === 'click') setSelectedId(null);
        }}
      >
        <CameraHandler fov={fov} />
        
        {/* Environment & Lighting - White Scene Setup */}
        <color attach="background" args={['#f0f4f8']} />
        <fog attach="fog" args={['#f0f4f8', 20, 120]} />
        
        <ambientLight intensity={0.8} />
        
        {/* Main Sunlight */}
        <directionalLight 
          position={[50, 100, 30]} 
          intensity={1.8} 
          color="#ffffff" 
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0005}
        >
          <orthographicCamera attach="shadow-camera" args={[-80, 80, -80, 80, 0.1, 300]} />
        </directionalLight>

        {/* Fill Light to soften shadows */}
        <directionalLight position={[-20, 30, -20]} intensity={0.6} color="#ddeeff" />

        {/* --- Houses with Selection Logic --- */}
        <MainVilla 
          ref={mainRef}
          showLines={showLines}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId('main');
          }}
        />

        <Annex 
          ref={annexRef}
          position={[-25, 0, 5]} 
          rotation={[0, Math.PI / 6, 0]} 
          showLines={showLines}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedId('annex');
          }}
        />

        {/* --- Transformation Controls --- */}
        {selectedRef && selectedRef.current && (
          <TransformControls 
            object={selectedRef.current} 
            mode={transformMode}
            // If translating, hide Y axis (no vertical move)
            showY={transformMode === 'translate' ? false : true}
            // If rotating, only show Y axis (rotate around ground normal)
            showX={transformMode === 'rotate' ? false : true}
            showZ={transformMode === 'rotate' ? false : true}
            translationSnap={0.5}
            rotationSnap={Math.PI / 12}
            onDraggingChanged={(e) => {
              const controls = orbitControlsRef.current;
              if (controls) {
                // Disable orbit controls when dragging starts, enable when it ends
                controls.enabled = !e.value; 
              }
            }}
          />
        )}

        {/* Trees - Scattered around */}
        <LowPolyTree position={[-15, 0, -5]} scale={1.2} />
        <LowPolyTree position={[-18, 0, 5]} scale={1.5} />
        <LowPolyTree position={[-12, 0, 10]} scale={0.9} />
        <LowPolyTree position={[20, 0, -10]} scale={1.3} />
        <LowPolyTree position={[15, 0, -15]} scale={1.1} />
        <LowPolyTree position={[25, 0, 5]} scale={1.4} />
        
        {/* Clouds - Floating above */}
        <Cloud position={[-30, 25, -20]} speed={2} />
        <Cloud position={[10, 20, -30]} speed={1.5} />
        <Cloud position={[-10, 28, 20]} speed={1.8} />

        {/* Ground with Grid */}
        <group position={[0, -0.15, 0]}>
          {/* Shadow Catcher Plane */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            receiveShadow
            onClick={(e) => setSelectedId(null)} // Explicit floor click deselect
          >
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#ffffff" roughness={1} />
          </mesh>
          
          {/* Grid Helper */}
          <gridHelper args={[200, 50, '#333333', '#cccccc']} position={[0, 0.01, 0]} />
        </group>

        {/* User Interaction */}
        <Controls ref={orbitControlsRef} />
        
        <SoftShadows size={10} focus={0.5} samples={10} />
      </Canvas>
      <Loader containerStyles={{ background: '#f0f4f8' }} dataInterpolation={(p) => `Loading ${p.toFixed(0)}%`} />
    </>
  );
};