import { Draft, EntityId, PayloadAction } from "@reduxjs/toolkit";
import { Recipe } from "material-science-experiment-recipes/lib/recipe";

export enum VariableAction {
    AddDeclaration,
    RemoveDeclaration,
    ChangeDeclaration,
    AddExport,
    RemoveExport,
    ChangeExport,
}

export interface VariablePayload {
    id: EntityId,
    action: VariableAction,
    name: string,
    scope: 'private' | 'public',
    destination: string
}

export function handleVariableAction(recipe: Draft<Recipe> | undefined, { payload }: PayloadAction<VariablePayload>) {
    if (!recipe) return;
    switch (payload.action) {
        case VariableAction.AddDeclaration:
            (payload.scope === 'private' ? recipe.privateVariables : recipe.publicVariables).push({
                name: payload.name,
                alias: payload.destination
            });
            break;
        case VariableAction.RemoveDeclaration:
            const removeVariableIndex =
                (payload.scope === 'private' ? recipe.privateVariables : recipe.publicVariables)
                    .findIndex(variable => (variable.name === payload.name));
            if (removeVariableIndex >= 0) {
                (payload.scope === 'private' ? recipe.privateVariables : recipe.publicVariables).splice(removeVariableIndex, 1);
            }
            break;
        case VariableAction.ChangeDeclaration:
            const changeVariableIndex =
                (payload.scope === 'private' ? recipe.privateVariables : recipe.publicVariables)
                    .findIndex(variable => (variable.name === payload.name));
            if (changeVariableIndex >= 0) {
                (payload.scope === 'private' ? recipe.privateVariables : recipe.publicVariables)[changeVariableIndex].alias = payload.destination;
            }
            break;
        case VariableAction.AddExport:
            (payload.scope === 'private' ? recipe.privateExports : recipe.publicExports).push({
                name: payload.name,
                column: payload.destination
            });
            break;
        case VariableAction.RemoveExport:
            const removeExportIndex =
                (payload.scope === 'private' ? recipe.privateExports : recipe.publicExports)
                    .findIndex(variable => (variable.name === payload.name));
            if (removeExportIndex >= 0) {
                (payload.scope === 'private' ? recipe.privateExports : recipe.publicExports).splice(removeExportIndex, 1);
            }
            break;
        case VariableAction.ChangeExport:
            const changeExportIndex =
                (payload.scope === 'private' ? recipe.privateExports : recipe.publicExports)
                    .findIndex(variable => (variable.name === payload.name));
            if (changeExportIndex >= 0) {
                (payload.scope === 'private' ? recipe.privateExports : recipe.publicExports)[changeExportIndex].column = payload.destination;
            }
            break;
    }
}
