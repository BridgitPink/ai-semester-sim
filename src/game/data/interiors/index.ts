import type { InteriorConfig, InteriorObject } from "../../types/interiorObject";
import { ADVISOR_OFFICE_INTERIOR_CONFIG } from "./advisorOffice";
import { CAFE_INTERIOR_CONFIG } from "./cafe";
import { CLASSROOM_INTERIOR_CONFIG } from "./classroom";
import { DORM_INTERIOR_CONFIG } from "./dorm";
import { LAB_INTERIOR_CONFIG } from "./lab";
import { LIBRARY_INTERIOR_CONFIG } from "./library";

const interiorRegistry: Record<string, InteriorConfig> = {
  classroom: CLASSROOM_INTERIOR_CONFIG,
  dorm: DORM_INTERIOR_CONFIG,
  library: LIBRARY_INTERIOR_CONFIG,
  cafe: CAFE_INTERIOR_CONFIG,
  lab: LAB_INTERIOR_CONFIG,
  "advisor-office": ADVISOR_OFFICE_INTERIOR_CONFIG,
};

export function getInteriorConfig(buildingId: string): InteriorConfig | undefined {
  return interiorRegistry[buildingId];
}

export function getInteriorObjects(buildingId: string): InteriorObject[] {
  return interiorRegistry[buildingId]?.objects ?? [];
}

export {
  ADVISOR_OFFICE_INTERIOR_CONFIG,
  CAFE_INTERIOR_CONFIG,
  CLASSROOM_INTERIOR_CONFIG,
  DORM_INTERIOR_CONFIG,
  LAB_INTERIOR_CONFIG,
  LIBRARY_INTERIOR_CONFIG,
};