import type { Project } from '../backend';
import type { DesignerState, DesignElement } from './designerTypes';

export function deserializeProject(project: Project): Partial<DesignerState> {
  return {
    garmentType: project.garmentType as any,
    baseColor: project.baseColor,
    elements: project.elements.map((el) => ({
      id: `${el.type}-${Date.now()}-${Math.random()}`,
      type: el.type as any,
      x: Number(el.posX),
      y: Number(el.posY),
      width: Number(el.size),
      height: Number(el.size),
      rotation: 0,
      color: el.color,
      content: el.content,
    })),
    selectedElementId: null,
  };
}
