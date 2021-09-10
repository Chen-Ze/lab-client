import { Recipe } from "material-science-experiment-recipes/lib/recipe";
import React from "react";
import { ExperimentEntity } from "../subsequence/subsequenceSlice";

export interface ExperimentTabProps {
    entity: ExperimentEntity<Recipe>,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    remove: () => any
}