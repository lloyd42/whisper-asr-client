import { useMutation } from "@tanstack/react-query";
import type { TranscriptSegment } from "@/stores/transcriptStore";
import { useTranscriptStore } from "@/stores/transcriptStore";

const API_URL: string = import.meta.env.VITE_WHISPER_API_URL;

export const useTranscribeAudio = () => {
	const { actions } = useTranscriptStore();
	return useMutation({
		mutationFn: async (file: File) => {
			actions.setIsProcessing(true);

			const formData = new FormData();
			formData.append("audio", file);
			formData.append("output_format", "srt");
			const response = await fetch(`${API_URL}/asr`, {
				method: "POST",
				body: formData,
			});
			if (!response.ok) {
				throw new Error(`转录失败: ${response.statusText}`);
			}

			const srtText = await response.text();
			return parseSRT(srtText);
		},
		onSuccess: (segments) => {
			actions.setSegments(segments);
			actions.setTranscriptionStatus("completed");
		},
		onError: (error) => {
			console.error("转录错误:", error);
			actions.setTranscriptionStatus("error");
			actions.setProcessingError(error.message);
		},
		onSettled: () => {
			actions.setIsProcessing(false);
		},
	});
};

// 解析SRT格式为结构化数据
const parseSRT = (srt: string): TranscriptSegment[] => {
	const segments: TranscriptSegment[] = [];
	const blocks = srt.trim().split(/\n\s*\n/); // 分割字幕块

	blocks.forEach((block, index) => {
		const lines = block.trim().split("\n");
		if (lines.length < 3) return;

		// 解析时间轴 (00:00:00,000 --> 00:00:02,000)
		const timeMatch = lines[1].match(
			/(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/,
		);
		if (!timeMatch) return;

		const startTime =
			parseInt(timeMatch[1]) * 3600 +
			parseInt(timeMatch[2]) * 60 +
			parseInt(timeMatch[3]) +
			parseInt(timeMatch[4]) / 1000;

		const endTime =
			parseInt(timeMatch[5]) * 3600 +
			parseInt(timeMatch[6]) * 60 +
			parseInt(timeMatch[7]) +
			parseInt(timeMatch[8]) / 1000;

		// 合并多行文本
		const text = lines.slice(2).join("\n");

		segments.push({
			id: `seg-${index + 1}`,
			start: startTime,
			end: endTime,
			text,
		});
	});

	return segments;
};
