'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ProceduralStadiumProps {
  performanceMode?: 'high' | 'balanced' | 'low';
}

export function ProceduralStadium({ performanceMode = 'high' }: ProceduralStadiumProps) {
  const isLow = performanceMode === 'low';

  // Materials with dark futuristic stadium aesthetic
  const grassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1b4d2e,
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  const grassRingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x225c38,
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  const pitchMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xc8b08b,
        roughness: 0.95,
        metalness: 0.05,
      }),
    []
  );

  const whiteLineMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xf8fafc,
      }),
    []
  );

  const concreteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x141828,
        roughness: 0.9,
        metalness: 0.2,
      }),
    []
  );

  const concreteAccentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x1e243b,
        roughness: 0.8,
        metalness: 0.3,
      }),
    []
  );

  const roofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x2a3352,
        roughness: 0.4,
        metalness: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );

  const ledBannerMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x42d9ff,
      }),
    []
  );

  const floodlightMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }),
    []
  );

  const pylonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x494454,
        roughness: 0.5,
        metalness: 0.8,
      }),
    []
  );

  // Procedural crowd representation (instanced particles in stands)
  const crowdMeshRef = useRef<THREE.InstancedMesh>(null);
  const crowdCount = isLow ? 400 : 1600;

  useMemo(() => {
    // Crowd setup will be handled when mesh is mounted
  }, [crowdCount]);

  useFrame(() => {
    if (crowdMeshRef.current && !isLow) {
      // Subtle ambient crowd excitement shimmer
    }
  });

  return (
    <group>
      {/* ================= 1. CRICKET OUTFIELD & PLAYING SURFACE ================= */}
      {/* Main Oval Grass Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={grassMaterial}>
        <circleGeometry args={[28, 64]} />
      </mesh>

      {/* Mowing Pattern Rings (Subtle contrasting concentric rings) */}
      {[7, 14, 21].map((r, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, 0]}
          material={grassRingMaterial}
        >
          <ringGeometry args={[r, r + 3.5, 64]} />
        </mesh>
      ))}

      {/* Outer Boundary Rope */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={whiteLineMaterial}>
        <ringGeometry args={[27.6, 27.9, 64]} />
      </mesh>

      {/* 30-Yard Fielding Restriction Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={whiteLineMaterial}>
        <ringGeometry args={[13.5, 13.65, 64]} />
      </mesh>

      {/* 22-Yard Central Cricket Pitch Strip */}
      <mesh position={[0, 0.03, 0]} material={pitchMaterial} receiveShadow>
        <boxGeometry args={[3.2, 0.04, 11]} />
      </mesh>

      {/* Pitch Creases (White Markings) */}
      <mesh position={[0, 0.04, 4.2]} material={whiteLineMaterial}>
        <boxGeometry args={[2.8, 0.02, 0.1]} />
      </mesh>
      <mesh position={[0, 0.04, -4.2]} material={whiteLineMaterial}>
        <boxGeometry args={[2.8, 0.02, 0.1]} />
      </mesh>
      <mesh position={[0, 0.04, 5.1]} material={whiteLineMaterial}>
        <boxGeometry args={[2.8, 0.02, 0.08]} />
      </mesh>
      <mesh position={[0, 0.04, -5.1]} material={whiteLineMaterial}>
        <boxGeometry args={[2.8, 0.02, 0.08]} />
      </mesh>

      {/* Cricket Stumps & Bails (North & South ends) */}
      {[-4.6, 4.6].map((zPos, endIdx) => (
        <group key={endIdx} position={[0, 0.05, zPos]}>
          {[-0.22, 0, 0.22].map((xOffset, stumpIdx) => (
            <mesh key={stumpIdx} position={[xOffset, 0.4, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
              <meshStandardMaterial color={0xe5c158} roughness={0.3} metalness={0.2} />
            </mesh>
          ))}
          {/* Bail */}
          <mesh position={[0, 0.81, 0]}>
            <boxGeometry args={[0.55, 0.03, 0.03]} />
            <meshStandardMaterial color={0xe5c158} roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ================= 2. PERIMETER LED ADVERTISING RIBBON ================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.4, 0]}>
        <ringGeometry args={[28.5, 29.2, 64]} />
        <meshBasicMaterial color={0x10162a} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.7, 0]} material={ledBannerMaterial}>
        <ringGeometry args={[28.6, 29.0, 64]} />
      </mesh>

      {/* ================= 3. STADIUM CONCRETE TIERS (BOWL ARCHITECTURE) ================= */}
      {/* Tier 1: Lower Concourse Tier */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.2, 0]} material={concreteMaterial}>
        <ringGeometry args={[30, 37, 64]} />
      </mesh>

      {/* Tier 1 to Tier 2 Riser Slope */}
      <mesh position={[0, 3.2, 0]} material={concreteAccentMaterial}>
        <cylinderGeometry args={[42, 36.8, 3.8, 64, 1, true]} />
      </mesh>

      {/* Tier 2: Mid / Upper Seating Tier */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 5.1, 0]} material={concreteMaterial}>
        <ringGeometry args={[42, 49, 64]} />
      </mesh>

      {/* Outer Stadium Perimeter Wall */}
      <mesh position={[0, 4.5, 0]} material={concreteAccentMaterial}>
        <cylinderGeometry args={[49.5, 49.5, 9, 64, 1, true]} />
      </mesh>

      {/* ================= 4. CANTILEVERED ROOF CANOPIES ================= */}
      {/* East Stand Roof Canopy (Curved aerodynamic arch over target sector) */}
      <mesh position={[38, 14, 0]} rotation={[0, 0, -0.3]} material={roofMaterial} castShadow>
        <boxGeometry args={[18, 0.4, 42]} />
      </mesh>

      {/* West Stand Roof Canopy */}
      <mesh position={[-38, 14, 0]} rotation={[0, 0, 0.3]} material={roofMaterial} castShadow>
        <boxGeometry args={[18, 0.4, 42]} />
      </mesh>

      {/* North Pavilion Stand Roof Canopy */}
      <mesh position={[0, 15, -38]} rotation={[0.3, 0, 0]} material={roofMaterial} castShadow>
        <boxGeometry args={[38, 0.4, 16]} />
      </mesh>

      {/* ================= 5. SOUTH STAND DIGITAL SCOREBOARD ================= */}
      <group position={[0, 11, 46]} rotation={[0, Math.PI, 0]}>
        {/* Scoreboard Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[20, 7.5, 1]} />
          <meshStandardMaterial color={0x080b18} roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Glowing Screen Area */}
        <mesh position={[0, 0, 0.55]}>
          <planeGeometry args={[19, 6.5]} />
          <meshBasicMaterial color={0x10162a} />
        </mesh>
        {/* Match Header Bar */}
        <mesh position={[0, 2.2, 0.58]}>
          <planeGeometry args={[18, 1.2]} />
          <meshBasicMaterial color={0x8b5cf6} />
        </mesh>
        {/* Live Score Display simulation */}
        <mesh position={[0, -0.4, 0.58]}>
          <planeGeometry args={[18, 3.2]} />
          <meshBasicMaterial color={0x171e35} />
        </mesh>
      </group>

      {/* ================= 6. FOUR HIGH-INTENSITY FLOODLIGHT TOWERS ================= */}
      {[
        { pos: [38, 0, 36] as [number, number, number], rotY: Math.PI * 0.75 },
        { pos: [-38, 0, 36] as [number, number, number], rotY: Math.PI * 0.25 },
        { pos: [38, 0, -36] as [number, number, number], rotY: -Math.PI * 0.75 },
        { pos: [-38, 0, -36] as [number, number, number], rotY: -Math.PI * 0.25 },
      ].map((tower, idx) => (
        <group key={idx} position={tower.pos} rotation={[0, tower.rotY, 0]}>
          {/* Main Angled Lattice Pylons */}
          <mesh position={[0, 14, 0]} material={pylonMaterial}>
            <cylinderGeometry args={[0.5, 1.4, 28, 6]} />
          </mesh>
          <mesh position={[-1, 14, 0]} material={pylonMaterial}>
            <cylinderGeometry args={[0.3, 0.8, 28, 6]} />
          </mesh>
          <mesh position={[1, 14, 0]} material={pylonMaterial}>
            <cylinderGeometry args={[0.3, 0.8, 28, 6]} />
          </mesh>

          {/* Cross Truss Braces */}
          {[6, 12, 18, 24].map((h, bIdx) => (
            <mesh key={bIdx} position={[0, h, 0]} material={pylonMaterial}>
              <boxGeometry args={[3, 0.3, 1]} />
            </mesh>
          ))}

          {/* Top Floodlight Head (Bank of High-Power LED Projectors) */}
          <group position={[0, 27, 1]} rotation={[0.45, 0, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[7, 3.5, 0.8]} />
              <meshStandardMaterial color={0x1c1f2d} roughness={0.3} metalness={0.9} />
            </mesh>
            {/* Glowing Lamp Array */}
            <mesh position={[0, 0, 0.45]} material={floodlightMaterial}>
              <planeGeometry args={[6.4, 3.0]} />
            </mesh>
            {/* Real Three.js SpotLight projecting onto the pitch */}
            <spotLight
              position={[0, 0, 0.6]}
              target-position={[0, 0, 0]}
              intensity={isLow ? 1.5 : 2.8}
              angle={0.65}
              penumbra={0.5}
              color={0xe0f2fe}
              castShadow={!isLow && idx === 0}
            />
          </group>
        </group>
      ))}

      {/* Center Ambient & Turf Lights */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[0, 45, 20]} intensity={1.2} color={0xffffff} />
      <pointLight position={[0, 8, 0]} intensity={0.8} color={0x42d9ff} distance={40} />
    </group>
  );
}
