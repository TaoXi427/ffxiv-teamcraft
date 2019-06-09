import { RotationTip } from '../rotation-tip';
import { RotationTipType } from '../rotation-tip-type';
import { SimulationResult } from '../../simulation/simulation-result';
import { PrudentTouch } from '../../model/actions/quality/prudent-touch';
import { ManipulationII } from '../../model/actions/buff/manipulation-ii';
import { HastyTouchII } from '../../model/actions/quality/hasty-touch-ii';

export class UsePrudentTouchManipulation extends RotationTip {

  constructor() {
    super(RotationTipType.INFO, 'Use_prudent_touch_manipulation');
  }

  canBeAppliedTo(simulationResult: SimulationResult): boolean {
    return !this.simulationHasAction(simulationResult, PrudentTouch)
      && !this.simulationHasAction(simulationResult, ManipulationII)
      && simulationResult.simulation.crafterStats.level >= 66;
  }

  matches(simulationResult: SimulationResult): boolean {
    return simulationResult.simulation.progression < simulationResult.simulation.recipe.progress
      && simulationResult.hqPercent > 1 && this.simulationHasAction(simulationResult, HastyTouchII);
  }

}