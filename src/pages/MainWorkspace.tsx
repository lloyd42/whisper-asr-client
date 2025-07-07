import { AsrUploader } from "@/components/AsrUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { ExportModal } from "@/components/ExportModal";
import { SubtitleList } from "@/components/SubtitleList";
import { TranslatePanel } from "@/components/TranslatePanel";
import { useTranscriptStore } from "@/stores/transcriptStore";

export default function App() {
	const { segments } = useTranscriptStore();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-6 bg-gray-50 min-h-screen">
			{/* 控制面板 */}
			<div className="lg:col-span-3 space-y-6">
				<AsrUploader />
				<TranslatePanel />
				<ExportModal />

				<div className="border rounded-lg p-4 bg-white shadow-sm">
					<h3 className="font-semibold mb-2">统计信息</h3>
					<p className="text-sm">
						{segments.length} 条字幕 | 总时长:{" "}
						{segments.length
							? Math.round(segments[segments.length - 1].end)
							: 0}{" "}
						秒
					</p>
				</div>
			</div>

			{/* 主工作区 */}
			<div className="lg:col-span-7 space-y-6">
				<div className="bg-white rounded-xl shadow-md p-4">
					<h2 className="text-xl font-bold mb-4">音频播放</h2>
					<AudioPlayer />
				</div>

				<div className="bg-white rounded-xl shadow-md p-4">
					<h2 className="text-xl font-bold mb-4">字幕编辑</h2>
					<div className="h-[calc(100vh-400px)] min-h-[300px]">
						<SubtitleList />
					</div>
				</div>
			</div>
		</div>
	);
}
