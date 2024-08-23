import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { getProjectConfig } from './utils';

import { TypeDocProjectConfigGeneratorSchema } from './schema';

export async function typeDocProjectConfigGenerator(
  tree: Tree,
  options: TypeDocProjectConfigGeneratorSchema
) {
  const projectConfig = getProjectConfig(tree, options.project);
  const typeDocConfig = {
    ...projectConfig,
    ...options,
  };
  generateFiles(tree, path.join(__dirname, 'files'), projectConfig.root, typeDocConfig);
  await formatFiles(tree);
}

export default typeDocProjectConfigGenerator;
