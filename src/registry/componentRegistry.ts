// RoundLabs — the single safe component registry (master prompt §16).
// AI/analysis may only SELECT from these registered components. It may not
// generate executable UI code. Unknown component types fail validation and are
// never rendered.

import type { LabComponentType } from "../types/lab-spec";
import type { LabComponent } from "../components/lab/componentProps";

import { MapBoard } from "../components/lab/MapBoard";
import { DecisionTree } from "../components/lab/DecisionTree";
import { Timeline } from "../components/lab/Timeline";
import { RiskRewardPanel } from "../components/lab/RiskRewardPanel";
import { InformationCard } from "../components/lab/InformationCard";
import { AlternativeSelector } from "../components/lab/AlternativeSelector";
import { TelemetryPanel } from "../components/lab/TelemetryPanel";
import { StrategyComparison } from "../components/lab/StrategyComparison";
import { EvidencePanel } from "../components/lab/EvidencePanel";
import { DrillCard } from "../components/lab/DrillCard";

export const componentRegistry: Record<LabComponentType, LabComponent> = {
  "map-board": MapBoard,
  "decision-tree": DecisionTree,
  timeline: Timeline,
  "risk-reward": RiskRewardPanel,
  "information-card": InformationCard,
  "alternative-selector": AlternativeSelector,
  "telemetry-panel": TelemetryPanel,
  "strategy-comparison": StrategyComparison,
  "evidence-panel": EvidencePanel,
  "drill-card": DrillCard,
};

export function resolveComponent(type: string): LabComponent | undefined {
  return (componentRegistry as Record<string, LabComponent>)[type];
}
