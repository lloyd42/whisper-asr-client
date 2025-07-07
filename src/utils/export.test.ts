import { describe, expect, it } from "vitest";
import type { TranscriptSegment } from "@/stores/transcriptStore";
import { exportFormats } from "./export";

const sampleSegments: TranscriptSegment[] = [
	{ id: "1", start: 1.23, end: 4.56, text: "Hello world" },
	{ id: "2", start: 5.0, end: 7.89, text: "Testing export" },
];

describe("导出功能", () => {
	it("导出SRT格式", () => {
		const result = exportFormats.srt(sampleSegments);
		expect(result).toContain("00:00:01,230 --> 00:00:04,560");
		expect(result).toContain("Hello world");
	});

	it("导出VTT格式", () => {
		const result = exportFormats.vtt(sampleSegments);
		expect(result).toMatch(/^WEBVTT/);
		expect(result).toContain("00:00:05.000 --> 00:00:07.890");
	});

	it("导出TXT格式", () => {
		const result = exportFormats.txt(sampleSegments);
		expect(result).toBe("Hello world\nTesting export");
	});
});
