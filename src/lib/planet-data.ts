export interface BodyData {
  name: string;
  gm: number; // gravitational parameter au^3/day^2
  equatorialRadiusKm: number;
  polarRadiusKm: number;
}

import {
  JUPITER_EQUATORIAL_RADIUS_KM,
  JUPITER_POLAR_RADIUS_KM,
} from '@/lib/astronomy';

export const BODY_DATA: BodyData[] = [
  {
    name: 'Mercury',
    gm: 0.4912547451450812e-10,
    equatorialRadiusKm: 2439.7,
    polarRadiusKm: 2439.7,
  },
  {
    name: 'Venus',
    gm: 0.7243452486162703e-09,
    equatorialRadiusKm: 6051.8,
    polarRadiusKm: 6051.8,
  },
  {
    name: 'Earth',
    gm: 0.8887692390113509e-09,
    equatorialRadiusKm: 6378.137,
    polarRadiusKm: 6356.752,
  },
  {
    name: 'Mars',
    gm: 0.9549535105779258e-10,
    equatorialRadiusKm: 3396.2,
    polarRadiusKm: 3376.2,
  },
  {
    name: 'Jupiter',
    gm: 0.2825345909524226e-06,
    equatorialRadiusKm: JUPITER_EQUATORIAL_RADIUS_KM,
    polarRadiusKm: JUPITER_POLAR_RADIUS_KM,
  },
  {
    name: 'Saturn',
    gm: 0.8459715185680659e-07,
    equatorialRadiusKm: 60268,
    polarRadiusKm: 54364,
  },
  {
    name: 'Uranus',
    gm: 0.1292024916781969e-07,
    equatorialRadiusKm: 25559,
    polarRadiusKm: 24973,
  },
  {
    name: 'Neptune',
    gm: 0.1524358900784276e-07,
    equatorialRadiusKm: 24764,
    polarRadiusKm: 24341,
  },
  {
    name: 'Pluto',
    gm: 0.2188699765425970e-11,
    equatorialRadiusKm: 1188.3,
    polarRadiusKm: 1188.3,
  },
  {
    name: 'Moon',
    gm: 0.8887692390113509e-09 / 81.30056,
    equatorialRadiusKm: 1738.1,
    polarRadiusKm: 1736.0,
  },
  {
    name: 'Sun',
    gm: 0.2959122082855911e-03,
    equatorialRadiusKm: 695700,
    polarRadiusKm: 695700,
  },
];
