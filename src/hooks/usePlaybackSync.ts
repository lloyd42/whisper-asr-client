// src/features/playback/usePlaybackSync.ts
import { useEffect, useMemo, useRef } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import { useTranscriptStore } from "@/stores/transcriptStore";

export const usePlaybackSync = (
	listRef: React.RefObject<HTMLDivElement | null>,
) => {
	const { segments } = useTranscriptStore();
	const { currentTime } = usePlayerStore();
	const highlightedRef = useRef<HTMLElement | null>(null);
	const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

	// 查找当前播放的字幕段
	const getCurrentSegmentIndex = useMemo(() => {
		return segments.findIndex(
			(seg) => currentTime >= seg.start && currentTime <= seg.end,
		);
	}, [currentTime, segments]);

	// 同步滚动和高亮
	useEffect(() => {
		const index = getCurrentSegmentIndex;
		if (index === -1 || !listRef.current) return;

		const segmentId = `segment-${segments[index].id}`;
		const activeElement = document.getElementById(segmentId);
		if (!activeElement) return;

		// 移除旧的高亮样式
		if (highlightedRef.current) {
			highlightedRef.current.classList.remove(
				"bg-yellow-100",
				"ring-2",
				"ring-blue-500",
			);
		}

		// 添加新高亮样式
		activeElement.classList.add("bg-yellow-100", "ring-2", "ring-blue-500");
		highlightedRef.current = activeElement;

		// 平滑滚动到可见区域（带缓冲）
		if (scrollTimerRef.current) {
			clearTimeout(scrollTimerRef.current);
		}

		scrollTimerRef.current = setTimeout(() => {
			if (listRef.current) {
				const container = listRef.current;
				const elementTop = activeElement.offsetTop - container.offsetTop;
				const elementHeight = activeElement.offsetHeight;
				const scrollViewTop = container.scrollTop;
				const scrollViewHeight = container.clientHeight;

				// 计算是否需要滚动
				const isAbove = elementTop < scrollViewTop;
				const isBelow =
					elementTop + elementHeight > scrollViewTop + scrollViewHeight;

				if (isAbove || isBelow) {
					container.scrollTo({
						top: elementTop - scrollViewHeight / 3,
						behavior: "smooth",
					});
				}
			}
		}, 300);

		return () => {
			if (scrollTimerRef.current) {
				clearTimeout(scrollTimerRef.current);
			}
		};
	}, [segments, getCurrentSegmentIndex, listRef.current]);
};
