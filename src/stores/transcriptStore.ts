import { create } from "zustand";

export type TranscriptSegment = {
	id: string;
	start: number;
	end: number;
	text: string;
};

type TranscriptionStatus =
	| "idle"
	| "processing"
	| "language_detecting"
	| "completed"
	| "error";
export type OutOption = "txt" | "vtt" | "srt" | "tsv" | "json";

interface TranscriptState {
	segments: TranscriptSegment[];
	currentEditId: string | null;
	audioFile: File | null;
	isProcessing: boolean;
	transcriptionStatus: TranscriptionStatus;
	language?: string;
	processingError: string | null;
	asrOptions: {
		encode: boolean;
		task: "transcribe" | "translate";
		language?: string;
		initial_prompt?: string;
		vad_filter: boolean;
		word_timestamps: boolean;
		output: OutOption;
	};
	actions: {
		setAudioFile: (file: File | null) => void;
		setSegments: (segments: TranscriptSegment[]) => void;
		updateSegment: (id: string, text: string) => void;
		updateTiming: (id: string, start: number, end: number) => void;
		setCurrentEdit: (id: string | null) => void;
		applyTranslation: (translatedSegments: TranscriptSegment[]) => void;
		setIsProcessing: (value: boolean) => void;
		setTranscriptionStatus: (status: TranscriptionStatus) => void;
		setLanguage: (language: string) => void;
		setProcessingError: (error: string | null) => void;
		setAsrOption: <K extends keyof TranscriptState["asrOptions"]>(
			key: K,
			value: TranscriptState["asrOptions"][K],
		) => void;
		reset: () => void;
	};
}

const defaultAsrOptions: TranscriptState["asrOptions"] = {
	encode: true,
	task: "transcribe",
	vad_filter: false,
	word_timestamps: false,
	output: "srt",
};

export const useTranscriptStore = create<TranscriptState>((set) => ({
	segments: [],
	currentEditId: null,
	audioFile: null,
	isProcessing: false,
	transcriptionStatus: "idle", // 初始状态
	processingError: null,
	asrOptions: defaultAsrOptions,
	actions: {
		setAudioFile: (file) => set({ audioFile: file }),
		setSegments: (segments) => set({ segments }),
		updateSegment: (id, text) =>
			set((state) => ({
				segments: state.segments.map((seg) =>
					seg.id === id ? { ...seg, text } : seg,
				),
			})),
		updateTiming: (id, start, end) =>
			set((state) => ({
				segments: state.segments.map((seg) =>
					seg.id === id ? { ...seg, start, end } : seg,
				),
			})),
		setCurrentEdit: (id) => set({ currentEditId: id }),
		applyTranslation: (translatedSegments) =>
			set((state) => ({
				segments: state.segments.map((seg) => {
					const translated = translatedSegments.find((t) => t.id === seg.id);
					return translated ? { ...seg, text: translated.text } : seg;
				}),
			})),
		setIsProcessing: (value) => set({ isProcessing: value }),
		setTranscriptionStatus: (transcriptionStatus) =>
			set({ transcriptionStatus }),
		setLanguage: (language) => set({ language }),
		setProcessingError: (processingError) => set({ processingError }),
		setAsrOption: (key, value) =>
			set((state) => ({
				asrOptions: { ...state.asrOptions, [key]: value },
			})),
		reset: () =>
			set({
				audioFile: null,
				segments: [],
				isProcessing: false,
				transcriptionStatus: "idle",
				language: undefined,
				processingError: null,
				asrOptions: defaultAsrOptions,
			}),
	},
}));
