import { type RefObject, useEffect } from 'react';
import Hls from 'hls.js';

const BACKGROUND_VIDEO_SRC = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

type UseBackgroundHlsVideoOptions = {
  enabled?: boolean;
};

export function useBackgroundHlsVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled = true }: UseBackgroundHlsVideoOptions = {},
) {
  useEffect(() => {
    const video = videoRef.current;
    if (!enabled || !video) return;

    let hls: Hls | null = null;
    let hasRetriedPlay = false;

    const playVideo = () => {
      video.play().catch(() => {
        // Muted inline video can still be delayed by browser autoplay heuristics.
      });
    };

    const retryPlayback = () => {
      if (hasRetriedPlay || !video.paused) return;
      hasRetriedPlay = true;
      playVideo();
    };

    // User interaction fallback to trigger play (bypasses strict localhost autoplay policies)
    const handleInteraction = () => {
      if (video.paused) {
        playVideo();
      }
      cleanupInteraction();
    };

    const cleanupInteraction = () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    video.muted = true;
    video.playsInline = true;
    video.addEventListener('canplay', retryPlayback, { once: true });
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    if (Hls.isSupported()) {
      hls = new Hls({
        capLevelToPlayerSize: true,
        startLevel: 0,
        testBandwidth: true,
        startFragPrefetch: true,
        maxBufferLength: 12,
        maxMaxBufferLength: 30,
        backBufferLength: 30,
      });

      hls.loadSource(BACKGROUND_VIDEO_SRC);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = BACKGROUND_VIDEO_SRC;
      video.addEventListener('loadedmetadata', playVideo);
    }

    return () => {
      video.removeEventListener('canplay', retryPlayback);
      video.removeEventListener('loadedmetadata', playVideo);
      cleanupInteraction();
      hls?.destroy();
    };
  }, [enabled, videoRef]);
}
