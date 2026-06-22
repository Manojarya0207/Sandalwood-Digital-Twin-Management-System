import * as THREE from 'three';
import { clamp } from './mathUtils';

/**
 * Returns a blue-grey color intensity based on tree health.
 * Low health -> Grey (#64748B)
 * High health -> Vibrant blue (#4A90E2)
 */
export const getHealthColor = (health: number): THREE.Color => {
  const normalized = clamp(health / 100, 0, 1);
  const color = new THREE.Color();
  const lowColor = new THREE.Color('#64748B');
  const highColor = new THREE.Color('#4A90E2');
  
  color.lerpColors(lowColor, highColor, normalized);
  return color;
};

export const getHealthColorString = (health: number): string => {
  return '#' + getHealthColor(health).getHexString();
};
