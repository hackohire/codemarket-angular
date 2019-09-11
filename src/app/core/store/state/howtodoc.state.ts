import { Howtodoc } from 'src/app/shared/models/howtodoc.model';

export interface HowtodocState {
    howtodocs: Howtodoc[];
    selectedHowtodoc: Howtodoc;
    allHowtodocs: Howtodoc[];
}

export const initialHowtodocState: HowtodocState = {
    howtodocs: null,
    selectedHowtodoc: null,
    allHowtodocs: null
};

