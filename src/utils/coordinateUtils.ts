/**
 * Coordinate utilities for the 640x640m farm area
 * Assuming (0,0) is the center of the scene.
 */
export const worldToMap = (x: number, z: number, mapSize: number = 640) => {
  return {
    mapX: x + mapSize / 2,
    mapY: z + mapSize / 2,
  };
};

export const mapToWorld = (mapX: number, mapY: number, mapSize: number = 640) => {
  return {
    x: mapX - mapSize / 2,
    z: mapY - mapSize / 2,
  };
};
