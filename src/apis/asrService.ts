import type { TranscriptSegment } from "@/stores/transcriptStore";
import apiClient from "./axiosClient";

// 定义接口参数类型
export interface ASROptions {
	encode?: boolean;
	task?: "transcribe" | "translate";
	language?: string;
	initial_prompt?: string;
	vad_filter?: boolean;
	word_timestamps?: boolean;
	output?: "txt" | "vtt" | "srt" | "tsv" | "json";
}

export interface LanguageDetectionOptions {
	encode?: boolean;
}

export interface LanguageDetectionResult {
	detected_language: string;
	language_code: string;
	confidence: number;
}

interface ResponseJson {
	language: string;
	text: string;
	segments: {
		id: number;
		seek: number;
		start: number;
		end: number;
		text: string;
		tokens: number[];
		avg_logprob: number;
		compression_ratio: number;
		no_speech_prob: number;
		words: null;
		temperature: number;
	}[];
}

// 解析SRT格式为结构化数据
export const parseSRT = (srt: string): TranscriptSegment[] => {
	const segments: TranscriptSegment[] = [];
	const blocks = srt.trim().split(/\n\s*\n/); // 按空行分割

	blocks.forEach((block) => {
		const lines = block.split("\n");
		if (lines.length < 3) return; // 跳过无效块

		const id = parseInt(lines[0]);
		if (Number.isNaN(id)) return; // 跳过无效ID

		const timeMatch = lines[1].match(
			/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/,
		);
		if (!timeMatch) return; // 跳过无效时间格式

		const start = timeStrToSeconds(timeMatch[1]);
		const end = timeStrToSeconds(timeMatch[2]);
		const text = lines.slice(2).join(" ").trim();

		segments.push({
			id: id.toString(),
			start,
			end,
			text,
		});
	});

	return segments;
};

// 时间字符串转换为秒数
const timeStrToSeconds = (timeStr: string): number => {
	const [hours, minutes, secs] = timeStr.split(":");
	const [seconds, milliseconds] = secs.split(",");

	return (
		parseInt(hours) * 3600 +
		parseInt(minutes) * 60 +
		parseInt(seconds) +
		parseInt(milliseconds) / 1000
	);
};

// ASR服务
export const asrApi = {
	/**
	 * 转录音频文件
	 * @param file 音频文件
	 * @param options 转录选项
	 * @returns 转录结果的原始数据
	 */
	transcribeAudio: async (
		file: File,
		options: ASROptions = {},
	): Promise<string | object> => {
		const formData = new FormData();
		formData.append("audio_file", file);

		// 设置默认值
		const params: ASROptions = {
			encode: true,
			task: "transcribe",
			output: "srt",
			...options,
		};

		// 创建查询参数字符串
		const queryParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				queryParams.append(key, value.toString());
			}
		});

		try {
			const response = await apiClient.post(`/asr?${queryParams}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			// 根据输出格式返回不同结果
			if (params.output === "json") {
				return response.data;
			} else {
				return response.data as string;
			}
		} catch (error: unknown) {
			console.error("ASR转录失败:", error);
			const message =
				error instanceof Error
					? error.message || "ASR转录服务错误"
					: "ASR转录服务错误";
			throw new Error(message);
		}
	},

	/**
	 * 检测音频语言
	 * @param file 音频文件
	 * @param options 检测选项
	 * @returns 语言检测结果
	 */
	detectLanguage: async (
		file: File,
		options: LanguageDetectionOptions = {},
	): Promise<LanguageDetectionResult> => {
		const formData = new FormData();
		formData.append("audio_file", file);

		const params: LanguageDetectionOptions = {
			encode: true,
			...options,
		};

		const queryParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				queryParams.append(key, value.toString());
			}
		});

		try {
			const response = await apiClient.post(
				`/detect-language?${queryParams}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			return response.data as LanguageDetectionResult;
		} catch (error: unknown) {
			console.error("语言检测失败:", error);
			const message =
				error instanceof Error
					? error.message || "语言检测服务错误"
					: "语言检测服务错误";
			throw new Error(message);
		}
	},

	/**
	 * 解析转录结果
	 * @param data 转录响应数据
	 * @param outputFormat 输出格式
	 * @returns 结构化的转录分段
	 */
	parseTranscript: (
		data: string | object,
		outputFormat: string,
	): TranscriptSegment[] => {
		if (outputFormat === "srt" && typeof data === "string") {
			return parseSRT(data);
		}

		// 处理其他格式
		if (typeof data === "string") {
			// 处理 txt、vtt 等格式
			return [
				{
					id: "1",
					start: 0,
					end: 0,
					text: data,
				},
			];
		} else if (outputFormat === "json") {
			// 解析JSON格式响应
			const jsonData = data as unknown as ResponseJson;
			return jsonData.segments.map((seg, index: number) => ({
				id: (index + 1).toString(),
				start: seg.start,
				end: seg.end,
				text: seg.text,
			}));
		}

		return [];
	},
};
