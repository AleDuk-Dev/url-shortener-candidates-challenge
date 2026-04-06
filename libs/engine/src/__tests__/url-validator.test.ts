import { describe, it, expect } from "vitest";
import { validateUrl } from "../url-validator.js";

describe("validateUrl", () => {
  it("returns valid for http URL", () => {
    const result = validateUrl("http://example.com");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns valid for https URL", () => {
    const result = validateUrl("https://example.com/path?q=1");
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("normalizes URL (returns normalizedUrl)", () => {
    const result = validateUrl("https://example.com");
    expect(result.valid).toBe(true);
    expect(result.normalizedUrl).toBeDefined();
    expect(typeof result.normalizedUrl).toBe("string");
  });

  it('returns invalid + "URL is required" for empty string', () => {
    const result = validateUrl("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("URL is required");
  });

  it('returns invalid + "URL is required" for whitespace', () => {
    const result = validateUrl("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("URL is required");
  });

  it('returns invalid + "URL is too long" for >2048 chars', () => {
    const result = validateUrl("https://x.com/" + "a".repeat(2048));
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/too long/);
  });

  it('returns invalid + "Only HTTP and HTTPS" for ftp://', () => {
    const result = validateUrl("ftp://example.com/file.txt");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Only HTTP and HTTPS/);
  });

  it("rejects javascript: protocol", () => {
    const result = validateUrl("javascript:alert(1)");
    expect(result.valid).toBe(false);
  });

  it('returns invalid + "Invalid URL format" for non-URL string', () => {
    const result = validateUrl("not a url at all");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Invalid URL format/);
  });
});
