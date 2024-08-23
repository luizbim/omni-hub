import { Throttle } from '../../throttle';

jest.useFakeTimers();

describe('Throttle', () => {
  it('should process tasks within the limit', async () => {
    const throttle = new Throttle(2, 1000);

    const task = jest.fn().mockResolvedValue('result');

    const taskExecPromises = Array.from({ length: 3 }, () => throttle.add(task));

    expect(task).toHaveBeenCalledTimes(2);
    await Promise.resolve();

    jest.advanceTimersByTime(1000);
    expect(task).toHaveBeenCalledTimes(3);
    await expect(Promise.all(taskExecPromises)).resolves.toEqual(['result', 'result', 'result']);
  });

  it('should handle task resolution and rejection', async () => {
    const throttle = new Throttle(1, 1000);

    const successTask = jest.fn().mockResolvedValue('success');
    const failureTask = jest.fn().mockRejectedValue(new Error('failure'));

    await expect(throttle.add(successTask)).resolves.toBe('success');
    await expect(throttle.add(failureTask)).rejects.toThrow('failure');
  });

  it('should respect the rate limit', async () => {
    const throttle = new Throttle(2, 100);
    const task1 = jest.fn().mockResolvedValue('task1');
    const task2 = jest.fn().mockResolvedValue('task2');
    const task3 = jest.fn().mockResolvedValue('task3');
    const task4 = jest.fn().mockResolvedValue('task4');

    const result1 = throttle.add(task1);
    const result2 = throttle.add(task2);
    const result3 = throttle.add(task3);
    const result4 = throttle.add(task4);

    expect(task1).toHaveBeenCalled();
    expect(task2).toHaveBeenCalled();
    expect(task3).not.toHaveBeenCalled();
    expect(task4).not.toHaveBeenCalled();
    await expect(result1).resolves.toBe('task1');
    await expect(result2).resolves.toBe('task2');

    jest.advanceTimersByTime(100);
    expect(task3).toHaveBeenCalled();
    expect(task4).toHaveBeenCalled();

    await expect(result3).resolves.toBe('task3');
    await expect(result4).resolves.toBe('task4');
  });

  it('should stop the interval when queue is empty', async () => {
    const throttle = new Throttle(2, 1000);

    const task = jest.fn().mockResolvedValue('result');
    await throttle.add(task);
    await throttle.add(task);

    expect(throttle['intervalId']).toBe(null);
  });

  it('should process queued tasks after active tasks complete', async () => {
    const throttle = new Throttle(2, 100);
    const task1 = jest.fn().mockResolvedValue('task1');
    const task2 = jest.fn().mockResolvedValue('task2');
    const task3 = jest.fn().mockResolvedValue('task3');

    const result1 = throttle.add(task1);
    const result2 = throttle.add(task2);
    const result3 = throttle.add(task3);

    expect(task3).not.toHaveBeenCalled();

    await expect(result1).resolves.toBe('task1');
    await expect(result2).resolves.toBe('task2');

    jest.advanceTimersByTime(100);
    expect(task3).toHaveBeenCalled();
    await expect(result3).resolves.toBe('task3');
  });

  it('should throw an error if limit is less than 1', () => {
    expect(() => new Throttle(0, 1000)).toThrow('Limit must be greater than 0');
  });
});
