import { Design } from 'src/app/shared/models/design.model';

export interface DesignState {
    designs: Design[];
    selectedDesign: Design;
    allDesigns: Design[];
}

export const initialDesignState: DesignState = {
    designs: null,
    selectedDesign: null,
    allDesigns: null
};

