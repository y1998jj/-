import React, { useRef, useLayoutEffect, useMemo, forwardRef } from 'react';
import { DoubleSide, Group } from 'three';
import { Edges, Line } from '@react-three/drei';
import * as THREE from 'three';
import { GroupProps } from '@react-three/fiber';

// Solid architectural materials
const concreteMaterial = { 
  color: '#e0e0e0', 
  roughness: 0.5,
  metalness: 0.1
};

const stoneMaterial = {
  color: '#666666',
  roughness: 0.9,
  metalness: 0.1
};

const glassMaterial = {
  color: '#88ccff',
  transparent: true,
  opacity: 0.3,
  roughness: 0.1,
  metalness: 0.9,
  side: DoubleSide
};

const waterMaterial = {
  color: '#00ffff',
  transparent: true,
  opacity: 0.7,
  roughness: 0.1,
  metalness: 0.5
};

const lightMaterial = {
  color: '#ffaa33',
  emissive: '#ffaa33',
  emissiveIntensity: 2,
  toneMapped: false
};

// --- Perspective Guide Lines Helper ---
const PerspectiveLine: React.FC<{ position: [number, number, number], axis: 'x' | 'z', length?: number, visible: boolean }> = ({ position, axis, length = 1000, visible }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    const pts = [];
    if (axis === 'x') {
       pts.push(new THREE.Vector3(-length, 0, 0));
       pts.push(new THREE.Vector3(length, 0, 0));
    } else {
       pts.push(new THREE.Vector3(0, 0, -length));
       pts.push(new THREE.Vector3(0, 0, length));
    }
    return pts;
  }, [axis, length]);

  useLayoutEffect(() => {
    if (lineRef.current) {
      lineRef.current.geometry.setFromPoints(points);
      lineRef.current.computeLineDistances(); 
    }
  }, [points]);

  return (
    <group position={position} visible={visible}>
      <line ref={lineRef as any}>
        <bufferGeometry />
        <lineDashedMaterial 
          color="#222222" 
          dashSize={2} 
          gapSize={2} 
          scale={1}
          opacity={0.8} 
          transparent 
        />
      </line>
    </group>
  );
};

interface BuildingProps extends GroupProps {
  showLines: boolean;
}

export const MainVilla = forwardRef<Group, BuildingProps>(({ showLines, ...props }, ref) => {
  const edgeColor = "#333333";

  return (
    <group ref={ref} {...props}>
      {/* --- CONSTRUCTION LINES (Internal to MainVilla) --- */}
       {/* Living Block (Left) Guide Lines */}
       <PerspectiveLine visible={showLines} axis="x" position={[0, 0.1, -4]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 4.0, -4]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 0.1, 8]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 4.0, 8]} />

       <PerspectiveLine visible={showLines} axis="z" position={[-11, 0.1, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[-11, 4.0, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[-1, 0.1, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[-1, 4.0, 0]} />

       {/* Garage Block (Right) Guide Lines */}
       <PerspectiveLine visible={showLines} axis="x" position={[0, 0.1, -7]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 4.0, -7]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 0.1, 3]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 4.0, 3]} />

       <PerspectiveLine visible={showLines} axis="z" position={[2, 0.1, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[2, 4.0, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[12, 0.1, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[12, 4.0, 0]} />

       {/* Top Floor Block (Upper) Guide Lines */}
       <PerspectiveLine visible={showLines} axis="x" position={[0, 4.2, -1]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 8.2, -1]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 4.2, 9]} />
       <PerspectiveLine visible={showLines} axis="x" position={[0, 8.2, 9]} />

       <PerspectiveLine visible={showLines} axis="z" position={[-9, 4.2, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[-9, 8.2, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[5, 4.2, 0]} />
       <PerspectiveLine visible={showLines} axis="z" position={[5, 8.2, 0]} />


      {/* --- GROUND FLOOR --- */}
      
      {/* Foundation / Floor Slab */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[25, 0.2, 20]} />
        <meshStandardMaterial {...concreteMaterial} color="#999999" />
        <Edges color={edgeColor} threshold={15} />
      </mesh>

      {/* Living Room Volume (Left) */}
      <group position={[-6, 2.1, 2]}>
        {/* Floor */}
        <mesh position={[0, -1.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 0.2, 12]} />
          <meshStandardMaterial {...concreteMaterial} />
          <Edges color={edgeColor} threshold={15} />
        </mesh>
        {/* Ceiling */}
        <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 0.2, 12]} />
          <meshStandardMaterial {...concreteMaterial} />
          <Edges color={edgeColor} threshold={15} />
        </mesh>
        {/* Back Wall */}
        <mesh position={[0, 0, -5.9]} castShadow receiveShadow>
          <boxGeometry args={[9.5, 3.8, 0.2]} />
          <meshStandardMaterial {...concreteMaterial} />
          <Edges color={edgeColor} threshold={15} />
        </mesh>
        {/* Stone Feature Wall */}
        <mesh position={[-4.9, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3.8, 12]} />
          <meshStandardMaterial {...stoneMaterial} />
          <Edges color={edgeColor} threshold={15} />
        </mesh>
        {/* Glass Front */}
        <mesh position={[0, 0, 5.9]}>
          <planeGeometry args={[10, 3.8]} />
          <meshStandardMaterial {...glassMaterial} />
          <Edges color="#446688" threshold={15} />
        </mesh>
        {/* Glass Right */}
        <mesh position={[4.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[12, 3.8]} />
          <meshStandardMaterial {...glassMaterial} />
          <Edges color="#446688" threshold={15} />
        </mesh>
        
        {/* Interior Lighting/Furniture Proxy */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[1, 0.1, 4]} />
          <meshStandardMaterial {...lightMaterial} />
        </mesh>
      </group>

      {/* Garage/Entrance Volume (Right, recessed) */}
      <mesh position={[7, 2.1, -2]} castShadow receiveShadow>
        <boxGeometry args={[10, 4, 10]} />
        <meshStandardMaterial {...stoneMaterial} color="#555" />
        <Edges color={edgeColor} threshold={15} />
      </mesh>

      {/* --- SECOND FLOOR (Cantilevered) --- */}
      <group position={[-2, 6.2, 4]}>
         {/* Main Bedroom Block */}
         <mesh castShadow receiveShadow>
            <boxGeometry args={[14, 4, 10]} />
            <meshStandardMaterial {...concreteMaterial} />
            <Edges color={edgeColor} threshold={15} />
         </mesh>
         {/* Large Window Cutout */}
         <mesh position={[0, 0, 5.01]}>
            <planeGeometry args={[10, 2.5]} />
            <meshStandardMaterial color="#111" roughness={0.2} />
         </mesh>
         <mesh position={[0, 0, 5.02]}>
            <planeGeometry args={[10, 2.5]} />
            <meshStandardMaterial {...glassMaterial} />
            <Edges color="#446688" threshold={15} />
         </mesh>
         {/* Balcony Railing */}
         <mesh position={[0, -1.5, 5.5]} castShadow>
            <boxGeometry args={[14, 0.1, 1]} />
            <meshStandardMaterial {...concreteMaterial} />
            <Edges color={edgeColor} threshold={15} />
         </mesh>
         <mesh position={[0, -0.5, 6]}>
            <planeGeometry args={[14, 1]} />
            <meshStandardMaterial {...glassMaterial} />
            <Edges color="#446688" threshold={15} />
         </mesh>
      </group>

      {/* --- POOL --- */}
      <group position={[8, 0.1, 8]}>
        {/* Water */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[8, 12]} />
          <meshStandardMaterial {...waterMaterial} />
        </mesh>
        {/* Coping Stones */}
        <mesh position={[0, -0.05, -6.2]} castShadow receiveShadow>
           <boxGeometry args={[8.4, 0.1, 0.4]} />
           <meshStandardMaterial {...concreteMaterial} />
           <Edges color={edgeColor} threshold={15} />
        </mesh>
        <mesh position={[0, -0.05, 6.2]} castShadow receiveShadow>
           <boxGeometry args={[8.4, 0.1, 0.4]} />
           <meshStandardMaterial {...concreteMaterial} />
           <Edges color={edgeColor} threshold={15} />
        </mesh>
        <mesh position={[-4.2, -0.05, 0]} castShadow receiveShadow>
           <boxGeometry args={[0.4, 0.1, 12.8]} />
           <meshStandardMaterial {...concreteMaterial} />
           <Edges color={edgeColor} threshold={15} />
        </mesh>
        <mesh position={[4.2, -0.05, 0]} castShadow receiveShadow>
           <boxGeometry args={[0.4, 0.1, 12.8]} />
           <meshStandardMaterial {...concreteMaterial} />
           <Edges color={edgeColor} threshold={15} />
        </mesh>
        
        {/* Pool Lights */}
        <pointLight position={[0, -0.5, 0]} color="#00ffff" intensity={1} distance={8} decay={2} />
        <pointLight position={[0, -0.5, 4]} color="#00ffff" intensity={1} distance={8} decay={2} />
        <pointLight position={[0, -0.5, -4]} color="#00ffff" intensity={1} distance={8} decay={2} />
      </group>

      {/* --- ENVIRONMENT DETAILS --- */}
      {/* Pillars */}
      <mesh position={[-10, 2.1, 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 4]} />
        <meshStandardMaterial {...concreteMaterial} />
        <Edges color={edgeColor} threshold={15} />
      </mesh>
       <mesh position={[-6, 2.1, 8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 4]} />
        <meshStandardMaterial {...concreteMaterial} />
        <Edges color={edgeColor} threshold={15} />
      </mesh>

      {/* Exterior Lights */}
      <pointLight position={[-6, 3.8, 7]} intensity={0.5} color="#ffcc77" distance={8} />
      <pointLight position={[0, 8, 9]} intensity={0.5} color="#ffcc77" distance={10} />
    </group>
  );
});

export const Annex = forwardRef<Group, BuildingProps>(({ showLines, ...props }, ref) => {
  const edgeColor = "#333333";
  
  return (
    <group ref={ref} {...props}>
         {/* --- CONSTRUCTION LINES (Internal to Annex) --- */}
         {/* Note: These are local to the Annex group, so positions are relative to the annex origin */}
          {/* X-Axis Lines (along Z faces) */}
          <PerspectiveLine visible={showLines} axis="x" position={[0, 0.1, -5]} />
          <PerspectiveLine visible={showLines} axis="x" position={[0, 4.0, -5]} />
          <PerspectiveLine visible={showLines} axis="x" position={[0, 0.1, 5]} />
          <PerspectiveLine visible={showLines} axis="x" position={[0, 4.0, 5]} />
          
          {/* Z-Axis Lines (along X faces) */}
          <PerspectiveLine visible={showLines} axis="z" position={[-5, 0.1, 0]} />
          <PerspectiveLine visible={showLines} axis="z" position={[-5, 4.0, 0]} />
          <PerspectiveLine visible={showLines} axis="z" position={[5, 0.1, 0]} />
          <PerspectiveLine visible={showLines} axis="z" position={[5, 4.0, 0]} />

          {/* Upper Floor Bounds */}
          {/* X-Axis Lines */}
          <PerspectiveLine visible={showLines} axis="x" position={[0, 8.2, -5]} />
          <PerspectiveLine visible={showLines} axis="x" position={[0, 8.2, 5]} />
          
          {/* Z-Axis Lines */}
          <PerspectiveLine visible={showLines} axis="z" position={[-6, 8.2, 0]} />
          <PerspectiveLine visible={showLines} axis="z" position={[6, 8.2, 0]} />


         {/* --- GEOMETRY --- */}
         {/* Foundation */}
         <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[14, 0.2, 14]} />
            <meshStandardMaterial {...concreteMaterial} color="#999999" />
            <Edges color={edgeColor} threshold={15} />
         </mesh>

         {/* Ground Floor Volume - Stone */}
         <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[10, 4, 10]} />
            <meshStandardMaterial {...stoneMaterial} />
            <Edges color={edgeColor} threshold={15} />
         </mesh>
         
         {/* Glass front for Annex */}
         <mesh position={[0, 2.1, 5.1]}>
            <planeGeometry args={[8, 3.5]} />
            <meshStandardMaterial {...glassMaterial} />
            <Edges color="#446688" threshold={15} />
         </mesh>
         <mesh position={[5.01, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
             <planeGeometry args={[8, 3.5]} />
            <meshStandardMaterial {...glassMaterial} />
            <Edges color="#446688" threshold={15} />
         </mesh>

         {/* Upper Floor (Cantilevered) - Concrete */}
         <mesh position={[0, 6.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[12, 4, 10]} />
            <meshStandardMaterial {...concreteMaterial} />
            <Edges color={edgeColor} threshold={15} />
         </mesh>

         {/* Upper Window */}
         <mesh position={[0, 6.2, 5.1]}>
            <planeGeometry args={[10, 3]} />
            <meshStandardMaterial {...glassMaterial} />
            <Edges color="#446688" threshold={15} />
         </mesh>

         {/* Balcony / Overhang detail */}
         <mesh position={[0, 4.2, 6]} castShadow>
            <boxGeometry args={[12, 0.2, 2]} />
            <meshStandardMaterial {...concreteMaterial} />
            <Edges color={edgeColor} threshold={15} />
         </mesh>
    </group>
  );
});