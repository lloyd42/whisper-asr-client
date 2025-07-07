import type { TranscriptSegment } from "@/stores/transcriptStore";

// 时间格式化函数
export const formatSecond = (seconds: number, msSeparator = "."): string => {
	const date = new Date(0);
	date.setSeconds(seconds);
	return date.toISOString().substring(11, 23).replace(".", msSeparator);
};

// 导出格式处理器
export const exportFormats = {
	srt: (segments: TranscriptSegment[]) => {
		return segments
			.map((seg, idx) => {
				return (
					`${idx + 1}\n` +
					`${formatSecond(seg.start, ",")} --> ${formatSecond(seg.end, ",")}\n` +
					`${seg.text}\n`
				);
			})
			.join("\n");
	},

	vtt: (segments: TranscriptSegment[]) => {
		let output = "WEBVTT\n\n";
		output += segments
			.map((seg) => {
				return (
					`${formatSecond(seg.start)} --> ${formatSecond(seg.end)}\n` +
					`${seg.text}`
				);
			})
			.join("\n\n");
		return output;
	},

	txt: (segments: TranscriptSegment[]) => {
		return segments.map((seg) => seg.text).join("\n");
	},

	json: (segments: TranscriptSegment[]) => {
		return JSON.stringify(segments, null, 2);
	},
};

export type ExportFormat = keyof typeof exportFormats;
