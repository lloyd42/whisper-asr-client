// src/services/api/openaiClient.ts
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { TranscriptSegment } from "@/stores/transcriptStore";

/**
 * 翻译字幕片段
 * @param segments 字幕片段数组
 * @param targetLanguage 目标语言代码 (如 'en', 'zh')
 * @returns 翻译后的字幕片段数组
 */
export const translateSegments = async (
	segments: TranscriptSegment[],
	targetLanguage: string,
): Promise<TranscriptSegment[]> => {
	// 如果字幕为空，直接返回
	if (segments.length === 0) {
		return [];
	}

	// 合并短句以减少API调用
	const BATCH_SIZE = 8;
	const results: TranscriptSegment[] = [];
	let batch: TranscriptSegment[] = [];
	let batchText = "";

	// 创建批处理
	const processBatch = async () => {
		if (batch.length === 0) return;

		try {
			const { text: translatedText } = await generateText({
				model: openai("gpt-4-turbo"),
				system: `你是一名专业的翻译。请将以下文本翻译成${targetLanguage}，保持相同的换行和分段。不要添加额外内容。`,
				prompt: batchText,
				temperature: 0.2,
				maxTokens: 2000,
			});

			// 将翻译结果按行分割，并映射回原片段
			const translatedLines = translatedText.split("\n");
			batch.forEach((segment, index) => {
				results.push({
					...segment,
					text: translatedLines[index] || segment.text, // 如果翻译行数不匹配，则保留原文
				});
			});
		} catch (error) {
			console.error("翻译批处理失败:", error);
			// 当前批处理失败，将原片段推入结果
			batch.forEach((segment) => results.push(segment));
		}
	};

	// 分批处理字幕
	for (const segment of segments) {
		// 如果当前批次已满或添加新内容会超过上下文限制
		if (
			batch.length >= BATCH_SIZE ||
			(batchText + segment.text).length > 1500
		) {
			await processBatch();
			batch = [];
			batchText = "";
		}

		batch.push(segment);
		batchText += `${segment.text}\n`;
	}

	// 处理最后一批
	if (batch.length > 0) {
		await processBatch();
	}

	return results;
};

/**
 * 润色字幕文本
 * @param segments 字幕片段数组
 * @returns 润色后的字幕片段数组
 */
export const polishSegments = async (
	segments: TranscriptSegment[],
): Promise<TranscriptSegment[]> => {
	// 如果字幕为空，直接返回
	if (segments.length === 0) {
		return [];
	}

	const results: TranscriptSegment[] = [];
	const text = segments.map((seg) => seg.text).join("\n");

	try {
		const { text: polishedText } = await generateText({
			model: openai("gpt-4-turbo"),
			system:
				"你是一名专业的文字编辑。请润色以下文字，修正语法错误，使表达更流畅自然，但保持原有的意思和风格。不要添加或删除任何信息。",
			prompt: text,
			temperature: 0.3,
			maxTokens: 4000,
		});

		// 将润色结果按行分割，并映射回原片段
		const polishedLines = polishedText.split("\n");
		segments.forEach((segment, index) => {
			results.push({
				...segment,
				text: polishedLines[index] || segment.text,
			});
		});
	} catch (error) {
		console.error("润色失败:", error);
		return segments; // 失败时返回原始内容
	}

	return results;
};
