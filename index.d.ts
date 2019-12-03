import { Context } from 'react';

interface IMap {
  [key: number]: any;
};

export const CellContext: Context<[number, number] | null>;

export const useBreakpoints: (widthMap?: IMap, heightMap?: IMap) => [any, any];
