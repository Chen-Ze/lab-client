import React from "react";
import { ExperimentEntity } from "../subsequence/subsequenceSlice";

export interface ExperimentTabProps {
    entity: ExperimentEntity,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    remove: () => any
}