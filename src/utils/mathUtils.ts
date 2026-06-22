export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number) => Math.floor(randomRange(min, max));

/** Gaussian random number approximation */
export const randomGaussian = (mean: number = 0, stdev: number = 1) => {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
};
