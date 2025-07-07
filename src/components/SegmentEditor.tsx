// src/components/editor/SegmentEditor.tsx
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import type { TranscriptSegment } from "@/stores/transcriptStore";

interface SegmentEditorProps {
	segment: TranscriptSegment;
	onEdit: (id: string, text: string) => void;
	onTimeChange?: (id: string, start: number, end: number) => void;
}

export const SegmentEditor: React.FC<SegmentEditorProps> = ({
	segment,
	onEdit,
	onTimeChange,
}) => {
	const [text, setText] = useState(segment.text);
	const [startTime, setStartTime] = useState(segment.start);
	const [endTime, setEndTime] = useState(segment.end);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// 当外部传入的segment.text变化时更新（例如翻译后）
	useEffect(() => {
		setText(segment.text);
		setStartTime(segment.start);
		setEndTime(segment.end);
	}, [segment]);

	// 自动调整文本域高度
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${Math.max(
				textareaRef.current.scrollHeight,
				40,
			)}px`;
		}
	}, []);

	// 保存文本编辑
	const handleTextBlur = () => {
		if (text.trim() !== segment.text) {
			onEdit(segment.id, text.trim());
		}
	};

	// 保存时间编辑
	const handleTimeBlur = (type: "start" | "end") => {
		if (onTimeChange) {
			if (type === "start" && startTime !== segment.start) {
				onTimeChange(segment.id, startTime, segment.end);
			} else if (type === "end" && endTime !== segment.end) {
				onTimeChange(segment.id, segment.start, endTime);
			}
		}
	};

	// 时间输入变化处理
	const handleTimeChange = (value: string, type: "start" | "end") => {
		const time = parseFloat(value);
		if (!Number.isNaN(time)) {
			if (type === "start") {
				setStartTime(time);
			} else {
				setEndTime(time);
			}
		}
	};

	return (
		<div className="space-y-2">
			{onTimeChange && (
				<div className="flex items-center space-x-2">
					<div className="flex items-center">
						<span className="text-xs text-gray-500 mr-1">开始:</span>
						<Input
							type="number"
							step="0.1"
							value={startTime.toFixed(1)}
							onChange={(e) => handleTimeChange(e.target.value, "start")}
							onBlur={() => handleTimeBlur("start")}
							className="w-20 h-7 text-xs"
						/>
					</div>
					<span className="text-gray-400">→</span>
					<div className="flex items-center">
						<span className="text-xs text-gray-500 mr-1">结束:</span>
						<Input
							type="number"
							step="0.1"
							value={endTime.toFixed(1)}
							onChange={(e) => handleTimeChange(e.target.value, "end")}
							onBlur={() => handleTimeBlur("end")}
							className="w-20 h-7 text-xs"
						/>
					</div>
				</div>
			)}

			<textarea
				ref={textareaRef}
				value={text}
				onChange={(e) => setText(e.target.value)}
				onBlur={handleTextBlur}
				className="w-full bg-white border rounded p-2 text-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
				rows={1}
			/>
		</div>
	);
};
