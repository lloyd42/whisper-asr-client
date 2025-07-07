import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranscriptStore } from "@/stores/transcriptStore";
import type { ExportFormat } from "@/utils/export";
import { exportFormats } from "@/utils/export";

export const ExportModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("srt");
	const { segments } = useTranscriptStore();

	const handleExport = () => {
		if (!segments.length) return;

		const exporter = exportFormats[selectedFormat];
		const content = exporter(segments);

		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `transcript.${selectedFormat}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		setIsOpen(false);
	};

	return (
		<>
			<div className="border rounded-lg p-4 bg-white shadow-sm">
				<h3 className="font-semibold mb-3">导出字幕</h3>
				<Button
					variant="outline"
					onClick={() => setIsOpen(true)}
					disabled={!segments.length}
				>
					导出文件
				</Button>
			</div>

			{isOpen && (
				<div className="fixed h-full w-full top-0 left-0 bg-black/50 flex items-center justify-center p-4 z-50">
					<div className="bg-white border rounded-lg p-6 w-full max-w-md">
						<h3 className="font-semibold text-lg mb-4">选择导出格式</h3>

						<div className="space-y-3 mb-5">
							{Object.entries(exportFormats).map(([format]) => (
								<div key={format} className="flex items-center">
									<input
										type="radio"
										id={`format-${format}`}
										name="exportFormat"
										checked={selectedFormat === format}
										onChange={() => setSelectedFormat(format as ExportFormat)}
										className="mr-2"
									/>
									<label htmlFor={`format-${format}`}>
										{format.toUpperCase()} 格式
									</label>
								</div>
							))}
						</div>

						<div className="flex justify-end space-x-3">
							<Button variant="outline" onClick={() => setIsOpen(false)}>
								取消
							</Button>
							<Button variant="outline" onClick={handleExport}>
								导出
							</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
