import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { createNestJSMicroserviceGenerator } from './generator';
import { CreateNestJSMicroserviceGeneratorSchema } from './schema';

describe('Create NestJS Microservice generator', () => {
  let tree: Tree;
  const options: CreateNestJSMicroserviceGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await createNestJSMicroserviceGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
