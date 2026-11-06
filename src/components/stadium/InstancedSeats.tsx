'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { SeatData } from '@/types/stadium';

interface InstancedSeatsProps {
  selectedSeatIds: string[];
  hoveredSeatId: string | null;
  onSelectSeat: (seat: SeatData, multi?: boolean) => void;
  onHoverSeat: (seatId: string | null) => void;
}

const COLOR_AVAILABLE = new THREE.Color('#22c55e');
const COLOR_SOLD = new THREE.Color('#7a3b45');
const COLOR_SELECTED = new THREE.Color('#8b5cf6');
const COLOR_HOVERED = new THREE.Color('#ff8a3d');

export function InstancedSeats({
  selectedSeatIds,
  hoveredSeatId,
  onSelectSeat,
  onHoverSeat,
}: InstancedSeatsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate individual procedural seats in East Stand (Target Block D and surrounds)
  const seatsData = useMemo<SeatData[]>(() => {
    const seats: SeatData[] = [];
    const rows = [10, 11, 12, 13, 14, 15, 16, 17];
    const seatsPerRow = 24;

    // Default 4 selected seats matching Stitch spec
    const defaultSelected = [
      'EST-D-R12-S41',
      'EST-D-R12-S42',
      'EST-D-R12-S43',
      'EST-D-R12-S44',
    ];

    rows.forEach((rowNum) => {
      const radius = 31.8 + (rowNum - 10) * 0.65;
      const height = 1.35 + (rowNum - 10) * 0.44;

      for (let s = 1; s <= seatsPerRow; s++) {
        const seatNum = 32 + s;
        const id = `EST-D-R${rowNum}-S${seatNum}`;

        // Angle along East arc (facing pitch center [0,0,0])
        const angle = -0.34 + (s / (seatsPerRow - 1)) * 0.68;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        // Realistic availability seed
        let status: 'available' | 'sold' | 'selected' = 'available';
        const hash = (rowNum * 31 + seatNum * 17) % 100;
        if (defaultSelected.includes(id)) {
          status = 'selected';
        } else if (hash < 32 && !defaultSelected.includes(id)) {
          status = 'sold';
        }

        const tier = rowNum <= 13 ? 'Lower Tier' : 'Upper Tier';
        const price = rowNum <= 13 ? 3200 : 2800;

        seats.push({
          id,
          stand: 'East Stand',
          standKn: 'ಪೂರ್ವ ಗ್ಯಾಲರಿ',
          block: 'Block D',
          row: rowNum,
          seatNumber: seatNum,
          tier,
          price,
          status,
          position: [x, height, z],
          viewAngle: 'Unobstructed 42° Angle',
          sightlineQuality: '96% Pitch Visibility',
          gate: 'Gate 12 / Gate 7',
          metroDistance: 'Cubbon Park ~300m',
          canopyShade: true,
        });
      }
    });

    return seats;
  }, []);

  // Update instance matrices on mount
  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    seatsData.forEach((seat, idx) => {
      dummy.position.set(seat.position[0], seat.position[1], seat.position[2]);

      // Aim seat towards pitch center [0, 0, 0]
      const angleToCenter = Math.atan2(-seat.position[2], -seat.position[0]);
      dummy.rotation.y = angleToCenter + Math.PI / 2;
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(idx, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [seatsData]);

  // Update instance colors when selection or hover changes
  useEffect(() => {
    if (!meshRef.current) return;

    seatsData.forEach((seat, idx) => {
      let color = COLOR_AVAILABLE;

      if (selectedSeatIds.includes(seat.id)) {
        color = COLOR_SELECTED;
      } else if (hoveredSeatId === seat.id) {
        color = COLOR_HOVERED;
      } else if (seat.status === 'sold') {
        color = COLOR_SOLD;
      }

      meshRef.current!.setColorAt(idx, color);
    });

    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [seatsData, selectedSeatIds, hoveredSeatId]);

  // Seat interaction handlers
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && seatsData[e.instanceId]) {
      const seat = seatsData[e.instanceId];
      if (seat.status !== 'sold') {
        onHoverSeat(seat.id);
        document.body.style.cursor = 'pointer';
        return;
      }
    }
    document.body.style.cursor = 'default';
  };

  const handlePointerOut = () => {
    onHoverSeat(null);
    document.body.style.cursor = 'default';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && seatsData[e.instanceId]) {
      const seat = seatsData[e.instanceId];
      if (seat.status === 'sold') return;

      const isMulti = e.nativeEvent.shiftKey || e.nativeEvent.ctrlKey;
      onSelectSeat(seat, isMulti);
    }
  };

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, seatsData.length]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        {/* Custom 3D Seat Geometry (chair cushion & backrest) */}
        <boxGeometry args={[0.46, 0.48, 0.42]} />
        <meshStandardMaterial roughness={0.4} metalness={0.2} />
      </instancedMesh>

      {/* Target Sector Highlight Aura around Block D */}
      <mesh position={[34, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[30.5, 37.5, 32, 1, -0.4, 0.8]} />
        <meshBasicMaterial color={0x8b5cf6} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

