type Task<T> = { execute: () => T; resolve: (val: T) => void; reject: (err: unknown) => void };

class MessageQueue {
  private queue: Task<unknown>[] = [];
  private processing = false;
  private currentAbort: AbortController | null = null;

  enqueue<T>(execute: () => T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ execute, resolve, reject } as Task<unknown>);
      if (!this.processing) this.processNext();
    });
  }

  cancelPending(): void {
    this.currentAbort?.abort();
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      task.reject(new DOMException('Cancelled', 'AbortError'));
    }
  }

  get isProcessing(): boolean {
    return this.processing;
  }

  private async processNext(): Promise<void> {
    if (this.queue.length === 0) { this.processing = false; return; }
    this.processing = true;
    this.currentAbort = new AbortController();

    const task = this.queue.shift()!;
    try {
      const result = task.execute();
      task.resolve(result);
    } catch (err) {
      task.reject(err);
    }
    this.currentAbort = null;
    this.processNext();
  }
}

export const messageQueue = new MessageQueue();
