import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { typeDocProjectConfigGenerator } from './generator';
import { TypeDocProjectConfigGeneratorSchema } from './schema';

describe('TypeDoc Project Config generator', () => {
  let tree: Tree;
  const options: TypeDocProjectConfigGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await typeDocProjectConfigGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
