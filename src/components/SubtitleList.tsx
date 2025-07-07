// src/components/player/SubtitleList.tsx
import { useRef } from "react";
import { SegmentEditor } from "@/components/SegmentEditor";
import { Button } from "@/components/ui/button";
import { usePlaybackSync } from "@/hooks/usePlaybackSync";
import { usePlayerStore } from "@/stores/playerStore";
import { useTranscriptStore } from "@/stores/transcriptStore";

/**
 * 格式化时间（秒）为字符串 (HH:MM:SS.ms)
 * @param seconds 时间（秒）
 * @returns 格式化的时间字符串
 */
const formatTime = (seconds: number): string => {
	const date = new Date(0);
	date.setSeconds(seconds);
	return date.toISOString().substr(11, 12).replace(".", ",");
};

export const SubtitleList = () => {
	const listRef = useRef<HTMLDivElement>(null);
	const { segments, actions } = useTranscriptStore();
	const { actions: playerActions } = usePlayerStore();
	usePlaybackSync(listRef); // 启用音字同步

	// 点击字幕跳转到对应时间
	const handleSegmentClick = (startTime: number) => {
		playerActions.seekTo(startTime);
		playerActions.setIsPlaying(true);
	};

	// 添加新的空白字幕段
	const handleAddSegment = () => {
		const newSegment = {
			id: `seg-${Date.now()}`,
			start: segments.length > 0 ? segments[segments.length - 1].end + 0.1 : 0,
			end: segments.length > 0 ? segments[segments.length - 1].end + 5 : 5,
			text: "新字幕内容",
		};
		actions.setSegments([...segments, newSegment]);
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex justify-between items-center mb-3">
				<h2 className="text-xl font-bold">字幕编辑区</h2>
				<Button variant="outline" size="sm" onClick={handleAddSegment}>
					添加字幕
				</Button>
			</div>

			<div
				ref={listRef}
				className="flex-1 overflow-y-auto border rounded-lg p-2 bg-white"
			>
				{segments.length === 0 ? (
					<div className="h-full flex items-center justify-center text-gray-500">
						无字幕内容，请上传音频或添加新字幕
					</div>
				) : (
					segments.map((segment) => (
						<div
							key={segment.id}
							id={`segment-${segment.id}`}
							className="py-2 px-3 mb-2 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group"
							onClick={() => handleSegmentClick(segment.start)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleSegmentClick(segment.start);
								}
							}}
						>
							<div className="flex justify-between items-start mb-1">
								<div className="text-xs text-gray-500">
									{formatTime(segment.start)} → {formatTime(segment.end)}
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={(e) => {
										e.stopPropagation();
										actions.setSegments(
											segments.filter((s) => s.id !== segment.id),
										);
									}}
								>
									<TrashIcon className="w-4 h-4 text-red-500" />
								</Button>
							</div>

							<SegmentEditor segment={segment} onEdit={actions.updateSegment} />
						</div>
					))
				)}
			</div>
		</div>
	);
};

// 简单的删除图标组件
const TrashIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		className={className}
	>
		<title>delete</title>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
		/>
	</svg>
);
