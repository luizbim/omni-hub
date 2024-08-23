/**
 * @class Throttle
 * @description Represents a throttle utility that limits the number of concurrent tasks.
 * @param limit The maximum number of tasks that can run concurrently.
 * @param interval The interval in milliseconds to check for available slots.
 * @throws Error if limit is less than 1.
 * @example
 * const throttle = new Throttle(2, 100);
 * const task = () => Promise.resolve('result');
 * const tasks = [throttle.add(task), throttle.add(task), throttle.add(task)];
 * await Promise.all(tasks); // it should take 200ms to complete all tasks
 *
 */
class Throttle {
  private queue: (() => void)[] = [];
  private activeCount = 0;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private limit: number,
    private interval: number,
  ) {
    if (limit < 1) {
      throw new Error('Limit must be greater than 0');
    }
  }

  /**
   * @private
   * @description Starts the interval to process the queue.
   * @returns void
   */
  private startInterval() {
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.processQueue();
      }, this.interval);
    }
  }

  /**
   * @private
   * @description Stops the interval.
   * @returns void
   */
  private stopInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * @private
   * @description Processes the queue by running tasks until the limit is reached.
   * @returns void
   *
   */
  private processQueue() {
    while (this.queue.length > 0 && this.activeCount < this.limit) {
      const next = this.queue.shift();
      if (next) {
        this.activeCount++;
        next();
      }
    }

    if (this.queue.length === 0 && this.activeCount === 0) {
      this.stopInterval();
    }
  }

  /**
   * @description Adds a task to the queue and returns a promise that resolves when the task is complete.
   * @param fn The function to run.
   * @returns Promise<FunctionResult>
   * @example
   * const throttle = new Throttle(2, 100);
   * const task = () => Promise.resolve('result');
   * const result = throttle.add(task);
   * await result; // it should resolve to 'result'
   */
  async add<FunctionResult>(fn: () => Promise<FunctionResult>): Promise<FunctionResult> {
    this.startInterval();
    return new Promise<FunctionResult>((resolve, reject) => {
      const task = async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeCount--;
          this.processQueue();
        }
      };

      this.queue.push(task);
      this.processQueue();
    });
  }
}

export { Throttle };
