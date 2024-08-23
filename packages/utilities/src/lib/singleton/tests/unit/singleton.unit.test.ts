import { Singleton } from '../../singleton';

// A sample singleton class to use in tests
class MySingleton extends Singleton {}

describe('Singleton', () => {
  beforeEach(() => {
    // Reset instances before each test to ensure test isolation
    MySingleton['instances'].clear();
  });

  it('should create a single instance of MySingleton', () => {
    const instance1 = MySingleton.getInstance();
    const instance2 = MySingleton.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should create different instances for different singleton classes', () => {
    // Another sample singleton class
    class AnotherSingleton extends Singleton {}

    const mySingletonInstance = MySingleton.getInstance();
    const anotherSingletonInstance = AnotherSingleton.getInstance();

    expect(mySingletonInstance).not.toBe(anotherSingletonInstance);
  });

  it('should reset the instances map', () => {
    const instance1 = MySingleton.getInstance();
    MySingleton['instances'].clear();
    const instance2 = MySingleton.getInstance();

    expect(instance1).not.toBe(instance2);
  });
});
