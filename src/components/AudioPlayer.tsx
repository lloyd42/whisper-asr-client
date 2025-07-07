import { useEffect, useRef } from "react";
import { useTranscriptStore } from "@/stores/transcriptStore";

export const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const { audioFile } = useTranscriptStore();

	// 当音频文件变化时更新播放器
	useEffect(() => {
		if (audioFile && audioRef.current) {
			const objectUrl = URL.createObjectURL(audioFile);
			audioRef.current.src = objectUrl;

			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [audioFile]);

	return (
		<div className="space-y-3">
			<audio ref={audioRef} id="audio-player" controls className="w-full">
				<track kind="captions" />
			</audio>

			<div className="flex justify-center space-x-4">
				<button
					type="button"
					className="px-3 py-1 bg-blue-500 text-white rounded"
					onClick={() => audioRef.current?.play()}
				>
					播放
				</button>
				<button
					type="button"
					className="px-3 py-1 bg-gray-500 text-white rounded"
					onClick={() => audioRef.current?.pause()}
				>
					暂停
				</button>
			</div>
		</div>
	);
};
