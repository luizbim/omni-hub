import { Tree, readProjectConfiguration, ProjectConfiguration } from "@nx/devkit";
import { TypeDocProjectConfigGeneratorSchema } from "../schema";

export const getProjectConfig = (tree: Tree, project: TypeDocProjectConfigGeneratorSchema['project']): ProjectConfiguration => {
    const projectConfig = readProjectConfiguration(tree, project);
    
    if (!projectConfig) {
        throw new Error(`Cannot find project configuration for ${project}`);
    }
    
    return projectConfig;
};