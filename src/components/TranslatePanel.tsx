import { useState } from "react";
import { translateSegments } from "@/apis/openaiClient";
import { Button } from "@/components/ui/button";
import { useTranscriptStore } from "@/stores/transcriptStore";

const LANGUAGES = [
	{ value: "en", label: "英语" },
	{ value: "es", label: "西班牙语" },
	{ value: "fr", label: "法语" },
	{ value: "de", label: "德语" },
	{ value: "ja", label: "日语" },
];

export const TranslatePanel = () => {
	const [targetLang, setTargetLang] = useState("en");
	const [isTranslating, setIsTranslating] = useState(false);
	const { segments, actions } = useTranscriptStore();

	const handleTranslate = async () => {
		if (!segments.length) return;

		setIsTranslating(true);
		try {
			const translated = await translateSegments(segments, targetLang);
			actions.applyTranslation(translated);
		} catch (error) {
			console.error("Translation failed:", error);
		} finally {
			setIsTranslating(false);
		}
	};

	return (
		<div className="border rounded-lg p-4 bg-white shadow-sm">
			<h3 className="font-semibold mb-3">翻译设置</h3>

			<div className="space-y-3">
				<div>
					<label
						htmlFor="targetLang"
						className="block text-sm font-medium mb-1"
					>
						目标语言
					</label>
					<select
						id="targetLang"
						value={targetLang}
						onChange={(e) => setTargetLang(e.target.value)}
						className="w-full p-2 border rounded"
					>
						{LANGUAGES.map((lang) => (
							<option key={lang.value} value={lang.value}>
								{lang.label}
							</option>
						))}
					</select>
				</div>

				<Button
					variant="outline"
					onClick={handleTranslate}
					disabled={isTranslating || !segments.length}
				>
					{isTranslating ? "翻译中..." : "开始翻译"}
				</Button>
			</div>
		</div>
	);
};
