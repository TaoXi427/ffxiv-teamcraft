import { EquipmentPiece } from './equipment-piece';

export interface GearsetsComparison {
  statsDifferences: {
    id: number,
    values: {
      a: number,
      b: number
    }
  }[];
  materiasDifferences: {
    id: number,
    amounts: {
      a: number,
      b: number
    }
  }[];
  meldingChances: {
    a: number,
    b: number
  }
  piecesDiff: {
    a: EquipmentPiece,
    b: EquipmentPiece
  }[]
}
