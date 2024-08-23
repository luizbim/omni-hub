/**
 * @description Base class for singletons. It should not be used by multi-level inheritance
 * @hideconstructor
 * @example
 * ```ts
 * class MyChildClassSingleton extends Singleton {
 *    private constructor() {
 *      super();
 *    }
 * }
 * const mySingleton = MySingleton.getInstance();
 * ```
 */
class UtilitySingleton {
  /**
   * @description A map of childClass to the instance of it making the childClass a singleton. In that way you can create multiple subClasses singletons using the same instance of Singleton.
   * @property { Map<any, Singleton> } instances - A map of instances of the child classes
   */
  private static instances: Map<any, UtilitySingleton> = new Map();

  /**
   * @description Method that creates a new Child class instance if it does not exist
   * @returns { ChildClassType }
   */
  public static getInstance<ChildClassType extends UtilitySingleton>(this: new () => ChildClassType): ChildClassType {
    if (!UtilitySingleton.instances.has(this)) {
      UtilitySingleton.instances.set(this, new this());
    }
    return UtilitySingleton.instances.get(this) as ChildClassType;
  }
}

export { UtilitySingleton };
