// src/stores/usePlayerStore.ts
import { create } from "zustand";

interface PlayerState {
	currentTime: number;
	duration: number;
	isPlaying: boolean;
	actions: {
		setCurrentTime: (time: number) => void;
		setDuration: (duration: number) => void;
		setIsPlaying: (isPlaying: boolean) => void;
		seekTo: (time: number) => void;
		togglePlay: () => void;
	};
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
	currentTime: 0,
	duration: 0,
	isPlaying: false,
	actions: {
		setCurrentTime: (time) => set({ currentTime: time }),
		setDuration: (duration) => set({ duration }),
		setIsPlaying: (isPlaying) => set({ isPlaying }),
		seekTo: (time) => {
			const audio = document.getElementById("audio-player") as HTMLAudioElement;
			if (audio) {
				audio.currentTime = time;
				set({ currentTime: time });
			}
		},
		togglePlay: () => {
			const audio = document.getElementById("audio-player") as HTMLAudioElement;
			if (audio) {
				if (audio.paused) {
					audio.play();
					set({ isPlaying: true });
				} else {
					audio.pause();
					set({ isPlaying: false });
				}
			}
		},
	},
}));
