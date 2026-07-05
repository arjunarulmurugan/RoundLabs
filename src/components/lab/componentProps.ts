import type { LabComponentSpec, LabSpec } from "../../types/lab-spec";

// Every registered lab component receives the same props: the full validated
// spec (for cross-cutting panels like evidence) plus its own component spec,
// and the shared selected-alternative state owned by the renderer.
export interface LabComponentProps {
  spec: LabSpec;
  component: LabComponentSpec;
  selectedAlternativeId: string | null;
  onSelectAlternative: (id: string) => void;
}

export type LabComponent = (props: LabComponentProps) => JSX.Element | null;
