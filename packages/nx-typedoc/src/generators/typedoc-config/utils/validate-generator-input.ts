import { Tree, readProjectConfiguration, ProjectConfiguration,  } from "@nx/devkit";
import { TypeDocProjectConfigGeneratorSchema } from "../schema";

export const getProjectConfig = (tree: Tree, project: TypeDocProjectConfigGeneratorSchema['project']): ProjectConfiguration => {
    const projectConfig = readProjectConfiguration(tree, project);
    
    return projectConfig;
};