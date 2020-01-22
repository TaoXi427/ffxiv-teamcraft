import { Component, OnInit } from '@angular/core';
import { EquipmentPiece } from '../../../model/gearset/equipment-piece';
import { LazyDataService } from '../../../core/data/lazy-data.service';
import { MateriaService } from '../../../modules/gearsets/materia.service';
import { NzModalRef } from 'ng-zorro-antd';
import { StatsService } from '../../../modules/gearsets/stats.service';


interface MateriaMenuEntry {
  baseParamId: number;
  materias: number[];
}

@Component({
  selector: 'app-materias-popup',
  templateUrl: './materias-popup.component.html',
  styleUrls: ['./materias-popup.component.less']
})
export class MateriasPopupComponent implements OnInit {

  equipmentPiece: EquipmentPiece;

  job: number;

  materiaMenu: MateriaMenuEntry[] = [];

  constructor(private lazyData: LazyDataService, public materiasService: MateriaService,
              private modalRef: NzModalRef, private statsService: StatsService) {
  }

  getBonus(materia: number, index: number): { overcapped: boolean, value: number } {
    return this.materiasService.getMateriaBonus(this.equipmentPiece, materia, index);
  }

  getMeldingChances(materiaItemId: number, slot: number): number {
    const materia = this.materiasService.getMateria(materiaItemId);
    const overmeldSlot = slot - this.equipmentPiece.materiaSlots;
    if (overmeldSlot < 0) {
      return 100;
    }
    return this.lazyData.meldingRates[materia.tier - 1][overmeldSlot];
  }

  resetMaterias(index: number): void {
    for (let i = index; i < this.equipmentPiece.materias.length; i++) {
      this.equipmentPiece.materias[i] = 0;
    }
  }

  apply(): void {
    this.modalRef.close(this.equipmentPiece);
  }

  cancel(): void {
    this.modalRef.close(null);
  }

  getMaxValuesTable(): number[][] {
    return this.statsService.getRelevantBaseStats(this.job)
      .map(baseParamId => {
        return [
          baseParamId,
          this.materiasService.getTotalStat(this.getStartingValue(this.equipmentPiece, baseParamId), this.equipmentPiece, baseParamId),
          this.materiasService.getItemCapForStat(this.equipmentPiece.itemId, baseParamId)
        ];
      });
  }

  private getStartingValue(equipmentPiece: EquipmentPiece, baseParamId: number): number {
    const itemStats = this.lazyData.data.itemStats[equipmentPiece.itemId];
    const matchingStat: any = Object.values(itemStats).find((stat: any) => stat.ID === baseParamId);
    if (matchingStat) {
      if (equipmentPiece.hq) {
        return matchingStat.HQ;
      } else {
        return matchingStat.NQ;
      }
    }
    return 0;
  }

  ngOnInit(): void {
    const relevantBaseParamsIds = this.statsService.getRelevantBaseStats(this.job);
    this.materiaMenu = this.lazyData.data.materias
      .filter(materia => relevantBaseParamsIds.indexOf(materia.baseParamId) > -1)
      .reduce((acc, materia) => {
        let menuRow = acc.find(row => row.baseParamId === materia.baseParamId);
        if (menuRow === undefined) {
          acc.push({
            baseParamId: materia.baseParamId,
            materias: []
          });
          menuRow = acc[acc.length - 1];
        }
        menuRow.materias.push(materia.itemId);
        return acc;
      }, []);
  }

}
