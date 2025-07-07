// src/features/asr/AsrUploader.tsx

import {
	CrossCircledIcon,
	FileIcon,
	GearIcon,
	GlobeIcon,
	UpdateIcon,
	UploadIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useASR } from "@/hooks/useASR";
import type { OutOption } from "@/stores/transcriptStore";

const LANGUAGE_OPTIONS = [
	"af",
	"am",
	"ar",
	"as",
	"az",
	"ba",
	"be",
	"bg",
	"bn",
	"bo",
	"br",
	"bs",
	"ca",
	"cs",
	"cy",
	"da",
	"de",
	"el",
	"en",
	"es",
	"et",
	"eu",
	"fa",
	"fi",
	"fo",
	"fr",
	"gl",
	"gu",
	"ha",
	"haw",
	"he",
	"hi",
	"hr",
	"ht",
	"hu",
	"hy",
	"id",
	"is",
	"it",
	"ja",
	"jw",
	"ka",
	"kk",
	"km",
	"kn",
	"ko",
	"la",
	"lb",
	"ln",
	"lo",
	"lt",
	"lv",
	"mg",
	"mi",
	"mk",
	"ml",
	"mn",
	"mr",
	"ms",
	"mt",
	"my",
	"ne",
	"nl",
	"nn",
	"no",
	"oc",
	"pa",
	"pl",
	"ps",
	"pt",
	"ro",
	"ru",
	"sa",
	"sd",
	"si",
	"sk",
	"sl",
	"sn",
	"so",
	"sq",
	"sr",
	"su",
	"sv",
	"sw",
	"ta",
	"te",
	"tg",
	"th",
	"tk",
	"tl",
	"tr",
	"tt",
	"uk",
	"ur",
	"uz",
	"vi",
	"yi",
	"yo",
	"yue",
	"zh",
];

export const AsrUploader = () => {
	const {
		fileInputRef,
		isProcessing,
		isDetectingLanguage,
		uploadError,
		processingError,
		audioFile,
		asrOptions,
		language,
		transcriptionStatus,
		handleFileChange,
		handleDrop,
		handleTranscribe,
		updateAsrOption,
		reset,
	} = useASR();

	const [settingsOpen, setSettingsOpen] = useState(false);

	// 获取状态文本
	const getStatusText = () => {
		if (isProcessing) return "正在转写音频...";
		if (isDetectingLanguage) return "正在检测语言...";
		if (processingError) return "转写出错";
		if (transcriptionStatus === "completed") return "转写完成";
		if (audioFile) return "音频已准备好转写";
		return "上传音频开始";
	};

	// 获取状态颜色
	const getStatusColor = () => {
		if (isProcessing) return "text-blue-500";
		if (processingError) return "text-red-500";
		if (transcriptionStatus === "completed") return "text-green-500";
		return "text-gray-500";
	};

	return (
		<div className="border rounded-lg p-4 bg-white shadow-sm">
			<div className="flex justify-between items-center mb-3">
				<h3 className="font-semibold">音频转写</h3>
				<div className="flex items-center">
					{language && (
						<div className="flex items-center mr-3 bg-blue-50 px-2 py-1 rounded text-sm">
							<GlobeIcon className="h-4 w-4 mr-1 text-blue-600" />
							<span className="font-medium text-blue-700">{language}</span>
						</div>
					)}
					<div className={`text-sm font-medium ${getStatusColor()}`}>
						{getStatusText()}
					</div>
				</div>
			</div>

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="audio/*"
				className="hidden"
			/>

			<div
				className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
					isProcessing
						? "bg-blue-50 border-blue-200"
						: uploadError || processingError
							? "bg-red-50 border-red-200"
							: "bg-gray-50 hover:bg-gray-100 cursor-pointer border-gray-200"
				}`}
				onDrop={handleDrop}
				onDragOver={(e) => e.preventDefault()}
				onClick={() => !audioFile && fileInputRef.current?.click()}
				onKeyDown={(e) =>
					e.key === "Enter" && !audioFile && fileInputRef.current?.click()
				}
			>
				{isProcessing ? (
					<div className="flex flex-col items-center justify-center space-y-2">
						<UpdateIcon className="h-8 w-8 animate-spin text-blue-500" />
						<p className="text-sm text-gray-600">音频转写中，请稍候...</p>
					</div>
				) : isDetectingLanguage ? (
					<div className="flex flex-col items-center justify-center space-y-2">
						<UpdateIcon className="h-8 w-8 animate-spin text-blue-500" />
						<p className="text-sm text-gray-600">正在检测音频语言...</p>
					</div>
				) : uploadError ? (
					<div className="space-y-2 text-red-500">
						<CrossCircledIcon className="mx-auto h-8 w-8" />
						<p className="font-medium">{uploadError}</p>
						<Button
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={(e) => {
								e.stopPropagation();
								reset();
							}}
						>
							重新上传
						</Button>
					</div>
				) : processingError ? (
					<div className="space-y-2 text-red-500">
						<CrossCircledIcon className="mx-auto h-8 w-8" />
						<p className="font-medium">转写出错: {processingError}</p>
						<div className="flex justify-center gap-2 mt-2">
							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									reset();
								}}
							>
								重新上传
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									reset();
								}}
							>
								清除
							</Button>
						</div>
					</div>
				) : audioFile ? (
					<div className="space-y-4">
						<div className="flex items-center justify-center">
							<FileIcon className="h-8 w-8 text-green-500" />
							<div className="ml-3 text-left">
								<p className="font-medium truncate max-w-xs">
									{audioFile.name}
								</p>
								<p className="text-sm text-gray-500">
									{(audioFile.size / 1024 / 1024).toFixed(1)} MB
								</p>
							</div>
						</div>

						<div className="flex flex-wrap justify-center gap-2">
							<Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											setSettingsOpen(true);
										}}
									>
										<GearIcon className="h-4 w-4 mr-1" />
										设置
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-80 bg-white"
									align="start"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="grid gap-4">
										<div className="space-y-2">
											<h4 className="font-medium leading-none">转写设置</h4>
											<p className="text-sm text-gray-500">
												自定义音频转写选项
											</p>
										</div>
										<div className="grid gap-4">
											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="task" className="flex justify-end">
													任务类型
												</Label>
												<Select
													value={asrOptions.task}
													onValueChange={(value: "transcribe" | "translate") =>
														updateAsrOption("task", value)
													}
												>
													<SelectTrigger className="col-span-2">
														<SelectValue placeholder="选择任务类型" />
													</SelectTrigger>
													<SelectContent className="bg-white">
														<SelectItem value="transcribe">转录</SelectItem>
														<SelectItem value="translate">翻译</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="output" className="flex justify-end">
													输出格式
												</Label>
												<Select
													value={asrOptions.output}
													onValueChange={(value: OutOption) =>
														updateAsrOption("output", value)
													}
												>
													<SelectTrigger className="col-span-2">
														<SelectValue placeholder="选择输出格式" />
													</SelectTrigger>
													<SelectContent className="bg-white">
														<SelectItem value="txt">文本 (TXT)</SelectItem>
														<SelectItem value="vtt">WebVTT</SelectItem>
														<SelectItem value="srt">字幕 (SRT)</SelectItem>
														<SelectItem value="tsv">
															制表符分隔 (TSV)
														</SelectItem>
														<SelectItem value="json">JSON</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="language" className="flex justify-end">
													语言
												</Label>
												<Select
													value={asrOptions.language || ""}
													onValueChange={(value) =>
														updateAsrOption("language", value || undefined)
													}
													disabled={asrOptions.task === "translate"}
												>
													<SelectTrigger className="col-span-2">
														<SelectValue
															placeholder={
																asrOptions.task === "translate"
																	? "自动检测"
																	: "选择语言"
															}
														/>
													</SelectTrigger>
													<SelectContent className="max-h-60 overflow-y-auto bg-white">
														<SelectItem value={"auto"}>自动检测</SelectItem>
														{LANGUAGE_OPTIONS.map((lang) => (
															<SelectItem key={lang} value={lang}>
																{lang}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="vad" className="flex justify-end">
													语音活动检测
												</Label>
												<Switch
													id="vad"
													checked={asrOptions.vad_filter}
													onCheckedChange={(checked) =>
														updateAsrOption("vad_filter", checked)
													}
													className="col-span-2"
												/>
											</div>
											<div className="grid grid-cols-3 items-center gap-4">
												<Label
													htmlFor="timestamps"
													className="flex justify-end"
												>
													词级时间戳
												</Label>
												<Switch
													id="timestamps"
													checked={asrOptions.word_timestamps}
													onCheckedChange={(checked) =>
														updateAsrOption("word_timestamps", checked)
													}
													className="col-span-2 !bg-blue-500"
												/>
											</div>
										</div>
									</div>
								</PopoverContent>
							</Popover>

							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									handleTranscribe();
								}}
								disabled={isProcessing || isDetectingLanguage}
							>
								{transcriptionStatus === "completed" ? "重新转写" : "开始转写"}
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									fileInputRef.current?.click();
								}}
							>
								更换文件
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									reset();
								}}
							>
								清除
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-2">
						<UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
						<p className="font-medium text-gray-700">拖放或点击上传音频</p>
						<p className="text-sm text-gray-500">
							支持 MP3, WAV, FLAC, M4A, OGG 格式
						</p>
						<Button
							variant="outline"
							className="mt-2"
							onClick={(e) => {
								e.stopPropagation();
								fileInputRef.current?.click();
							}}
						>
							选择文件
						</Button>
					</div>
				)}
			</div>

			{processingError && !isProcessing && (
				<div className="mt-3 p-3 bg-red-50 text-red-700 rounded text-sm">
					<p className="font-medium">错误详情:</p>
					<p>{processingError}</p>
				</div>
			)}
		</div>
	);
};
