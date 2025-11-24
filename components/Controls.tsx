import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { KeyMap } from '../types';

const MOVEMENT_SPEED = 0.2;

export const Controls = forwardRef((props, ref) => {
  const { camera } = useThree();
  const orbitRef = useRef<any>(null);

  // Expose the internal OrbitControls instance to the parent via the forwarded ref
  useImperativeHandle(ref, () => orbitRef.current);
  
  // Track active keys
  const [keys, setKeys] = useState<KeyMap>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key) || keys.hasOwnProperty(e.code)) {
        setKeys((prev) => ({ ...prev, [e.key]: true }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (keys.hasOwnProperty(e.key) || keys.hasOwnProperty(e.code)) {
        setKeys((prev) => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!orbitRef.current) return;

    // Calculate forward/right vectors relative to camera (ignoring Y for walking)
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    const moveVector = new THREE.Vector3(0, 0, 0);

    if (keys.ArrowUp || keys.w) moveVector.add(forward);
    if (keys.ArrowDown || keys.s) moveVector.sub(forward);
    if (keys.ArrowLeft || keys.a) moveVector.sub(right);
    if (keys.ArrowRight || keys.d) moveVector.add(right);

    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(MOVEMENT_SPEED);
      
      // Move both camera and orbit target to maintain relative viewing angle
      camera.position.add(moveVector);
      orbitRef.current.target.add(moveVector);
    }
  });

  return (
    <OrbitControls
      ref={orbitRef}
      makeDefault
      enablePan={false} // Disable pan so drag only rotates
      enableZoom={true}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent going under ground
      minDistance={5}
      maxDistance={50}
      target={[0, 2, 0]} // Initial look target
    />
  );
});