// Loading state manager to prevent duplicate API calls
// This helps reduce egress by preventing multiple simultaneous requests for the same data

class LoadingManager {
  private loadingStates: Map<string, Promise<any>> = new Map();

  async execute<T>(key: string, apiCall: () => Promise<T>): Promise<T> {
    // If already loading, return the existing promise
    if (this.loadingStates.has(key)) {
      return this.loadingStates.get(key) as Promise<T>;
    }

    // Create new promise and store it
    const promise = apiCall()
      .finally(() => {
        // Remove from loading states when complete
        this.loadingStates.delete(key);
      });

    this.loadingStates.set(key, promise);
    return promise;
  }

  isLoading(key: string): boolean {
    return this.loadingStates.has(key);
  }

  clear(): void {
    this.loadingStates.clear();
  }
}

export const loadingManager = new LoadingManager();
