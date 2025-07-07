// src/features/asr/useASR.ts
import { useRef, useState } from "react";
import { asrApi, type LanguageDetectionResult } from "@/apis/asrService";
import type { TranscriptSegment } from "@/stores/transcriptStore";
import { useTranscriptStore } from "@/stores/transcriptStore";
import { secondsToVttTime } from "@/utils/time";

/**
 * 自定义Hook：管理ASR（自动语音识别）功能
 * 包括文件上传、转录处理和状态管理
 */
export const useASR = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const { audioFile, actions } = useTranscriptStore();
	const asrOptions = useTranscriptStore((state) => state.asrOptions);
	const transcriptionStatus = useTranscriptStore(
		(state) => state.transcriptionStatus,
	);
	const processingError = useTranscriptStore((state) => state.processingError);
	const language = useTranscriptStore((state) => state.language);

	// 处理文件选择
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadError(null);
		actions.setProcessingError(null);

		// 验证文件类型
		if (
			!file.type.startsWith("audio/") &&
			!file.name.match(/\.(mp3|wav|flac|m4a|ogg)$/i)
		) {
			setUploadError(
				"不支持的文件格式。请上传音频文件 (MP3, WAV, FLAC, M4A, OGG)",
			);
			return;
		}

		// 验证文件大小 (最大100MB)
		if (file.size > 100 * 1024 * 1024) {
			setUploadError("文件过大。最大支持100MB");
			return;
		}

		actions.setAudioFile(file);
		actions.setTranscriptionStatus("idle");
	};

	// 处理文件拖放
	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files?.[0]) {
			const file = e.dataTransfer.files[0];
			const event = {
				target: {
					files: [file],
				},
			} as unknown as React.ChangeEvent<HTMLInputElement>;
			handleFileChange(event);
		}
	};

	// 检测语言
	const detectLanguage = async (): Promise<boolean> => {
		if (!audioFile) return false;

		try {
			actions.setTranscriptionStatus("language_detecting");
			const result: LanguageDetectionResult =
				await asrApi.detectLanguage(audioFile);
			console.log("检测到语言:", result.detected_language);
			actions.setLanguage(result.language_code);
			return true;
		} catch (error: unknown) {
			console.error("语言检测失败:", error);
			const message =
				error instanceof Error
					? error.message || "语言检测失败"
					: "语言检测失败";
			actions.setProcessingError(message);
			actions.setTranscriptionStatus("error");
			return false;
		}
	};

	// 手动触发转录
	const handleTranscribe = async () => {
		if (!audioFile) {
			setUploadError("请先上传音频文件");
			return;
		}

		try {
			// 如果未设置语言，则先检测语言
			if (!asrOptions.language && asrOptions.task === "transcribe") {
				const detected = await detectLanguage();
				if (!detected) return;

				// 设置检测到的语言
				actions.setAsrOption("language", language);
			}

			// 开始转录
			actions.setTranscriptionStatus("processing");
			const response = await asrApi.transcribeAudio(audioFile, asrOptions);

			// 解析转录结果
			const segments = asrApi.parseTranscript(response, asrOptions.output);
			actions.setSegments(segments);
			actions.setTranscriptionStatus("completed");
		} catch (error: unknown) {
			console.error("转录错误:", error);
			const message =
				error instanceof Error
					? error.message || "转录服务出错"
					: "转录服务出错";
			actions.setTranscriptionStatus("error");
			actions.setProcessingError(message);
		}
	};

	// 生成VTT预览文件
	const generateVttPreview = (segments: TranscriptSegment[]) => {
		let vttContent = "WEBVTT\n\n";
		segments.forEach((seg) => {
			vttContent += `${secondsToVttTime(seg.start)} --> ${secondsToVttTime(seg.end)}\n`;
			vttContent += `${seg.text}\n\n`;
		});
		return URL.createObjectURL(new Blob([vttContent], { type: "text/vtt" }));
	};

	// 重置ASR状态
	const reset = () => {
		actions.reset();
		setUploadError(null);
	};

	// 更新ASR选项
	const updateAsrOption = <K extends keyof typeof asrOptions>(
		key: K,
		value: (typeof asrOptions)[K],
	) => {
		actions.setAsrOption(key, value);
	};

	return {
		fileInputRef,
		audioFile,
		isProcessing: transcriptionStatus === "processing",
		isDetectingLanguage: transcriptionStatus === "language_detecting",
		handleFileChange,
		handleDrop,
		asrOptions,
		language,
		uploadError,
		processingError,
		transcriptionStatus,
		handleTranscribe,
		reset,
		updateAsrOption,
		generateVttPreview,
	};
};
