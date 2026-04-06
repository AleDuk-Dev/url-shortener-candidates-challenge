import { describe, it, expect } from "vitest";
import { RateLimiter } from "../rate-limiter.js";

describe("RateLimiter", () => {
  it("allows requests within limit", () => {
    const limiter = new RateLimiter(3, 60_000);
    expect(limiter.isAllowed("key1")).toBe(true);
    expect(limiter.isAllowed("key1")).toBe(true);
    expect(limiter.isAllowed("key1")).toBe(true);
  });

  it("blocks requests exceeding limit", () => {
    const limiter = new RateLimiter(2, 60_000);
    expect(limiter.isAllowed("key2")).toBe(true);
    expect(limiter.isAllowed("key2")).toBe(true);
    expect(limiter.isAllowed("key2")).toBe(false);
  });

  it("resets after window expires", async () => {
    const limiter = new RateLimiter(1, 50);
    expect(limiter.isAllowed("key3")).toBe(true);
    expect(limiter.isAllowed("key3")).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(limiter.isAllowed("key3")).toBe(true);
  });

  it("tracks different keys independently", () => {
    const limiter = new RateLimiter(1, 60_000);
    expect(limiter.isAllowed("a")).toBe(true);
    expect(limiter.isAllowed("b")).toBe(true);
    expect(limiter.isAllowed("a")).toBe(false);
    expect(limiter.isAllowed("b")).toBe(false);
  });
});
