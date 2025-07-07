// src/services/utils/timeUtils.ts
/**
 * 将秒数转换为SRT时间格式 (HH:MM:SS,ms)
 * @param seconds 时间（秒）
 * @returns 格式化的时间字符串
 */
export const secondsToSrtTime = (seconds: number): string => {
	const date = new Date(0);
	date.setSeconds(seconds);
	return date.toISOString().substr(11, 12).replace(".", ",");
};

/**
 * 将秒数转换为VTT时间格式 (HH:MM:SS.ms)
 * @param seconds 时间（秒）
 * @returns 格式化的时间字符串
 */
export const secondsToVttTime = (seconds: number): string => {
	const date = new Date(0);
	date.setSeconds(seconds);
	return date.toISOString().substr(11, 12);
};

/**
 * 将时间字符串转换为秒数
 * @param timeString 时间字符串 (HH:MM:SS.ms)
 * @returns 秒数
 */
export const timeStringToSeconds = (timeString: string): number => {
	const parts = timeString.split(":");
	if (parts.length !== 3) return 0;

	const hours = parseInt(parts[0], 10);
	const minutes = parseInt(parts[1], 10);
	const secondsParts = parts[2].replace(",", ".").split(".");
	const seconds = parseInt(secondsParts[0], 10);
	const milliseconds = secondsParts[1] ? parseInt(secondsParts[1], 10) : 0;

	return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
};

/**
 * 格式化时间为可读字符串 (MM:SS)
 * @param seconds 时间（秒）
 * @returns 格式化的时间字符串
 */
export const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
