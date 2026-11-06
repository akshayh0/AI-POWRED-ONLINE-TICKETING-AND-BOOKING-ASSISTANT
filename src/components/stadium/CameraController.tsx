'use client';

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CameraMode, SeatData } from '@/types/stadium';

interface CameraControllerProps {
  cameraMode: CameraMode;
  selectedSeat: SeatData | null;
  zoomTrigger: number;
  rotateTrigger: number;
  resetTrigger: number;
}

export function CameraController({
  cameraMode,
  selectedSeat,
  zoomTrigger,
  rotateTrigger,
  resetTrigger,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Target camera position and lookAt point for smooth lerping
  const targetCamPos = useRef(new THREE.Vector3(0, 55, 75));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  // Compute desired camera destination based on mode
  useEffect(() => {
    isTransitioning.current = true;

    if (cameraMode === 'overview') {
      targetCamPos.current.set(0, 52, 72);
      targetLookAt.current.set(0, 0, 0);
    } else if (cameraMode === 'stand') {
      targetCamPos.current.set(48, 18, 2);
      targetLookAt.current.set(30, 4, 0);
    } else if (cameraMode === 'firstPerson') {
      if (selectedSeat) {
        // Place spectator camera right at seat eye-level
        const [sx, sy, sz] = selectedSeat.position;
        targetCamPos.current.set(sx + 0.3, sy + 0.7, sz);
        // Look out towards the cricket pitch center & pitch action
        targetLookAt.current.set(0, 1.5, 0);
      } else {
        // Default Row 12 seat position
        targetCamPos.current.set(33.8, 2.8, 0.2);
        targetLookAt.current.set(0, 1.5, 0);
      }
    } else if (cameraMode === 'pitch') {
      targetCamPos.current.set(0, 2.2, 16);
      targetLookAt.current.set(0, 1.2, -6);
    }
  }, [cameraMode, selectedSeat]);

  // Handle zoom in/out button pulses
  useEffect(() => {
    if (zoomTrigger === 0 || !controlsRef.current) return;
    const factor = zoomTrigger > 0 ? 0.8 : 1.25;
    camera.position.multiplyScalar(factor);
    controlsRef.current.update();
  }, [zoomTrigger, camera]);

  // Handle 360° rotate pulse
  useEffect(() => {
    if (rotateTrigger === 0 || !controlsRef.current) return;
    const angle = Math.PI / 4;
    const x = camera.position.x;
    const z = camera.position.z;
    camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
    camera.position.z = x * Math.sin(angle) + z * Math.cos(angle);
    controlsRef.current.update();
  }, [rotateTrigger, camera]);

  // Handle reset view pulse
  useEffect(() => {
    if (resetTrigger === 0 || !controlsRef.current) return;
    isTransitioning.current = true;
    targetCamPos.current.set(0, 52, 72);
    targetLookAt.current.set(0, 0, 0);
  }, [resetTrigger]);

  // Smooth lerp frame loop
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const lerpSpeed = Math.min(delta * 3.5, 0.15);

      camera.position.lerp(targetCamPos.current, lerpSpeed);
      controlsRef.current.target.lerp(targetLookAt.current, lerpSpeed);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(targetCamPos.current);
      const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);

      if (distPos < 0.2 && distTarget < 0.2) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxDistance={120}
      minDistance={2}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.05}
    />
  );
}

