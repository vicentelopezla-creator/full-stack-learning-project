import { apiRequest, API_BASE_URL } from '../lib/api';
import type { Video, VideoCreate, VideoUpdate } from '../types/video';

export function getVideos(token: string, courseId?: number) {
  return apiRequest<Video[]>('/videos/', {
    token,
    query: {
      course_id: courseId,
    },
  });
}

export function getVideo(token: string, videoId: number) {
  return apiRequest<Video>(`/videos/${videoId}`, {
    token,
  });
}

export function createVideo(token: string, payload: VideoCreate) {
  return apiRequest<Video>('/videos/', {
    method: 'POST',
    body: payload,
    token,
  });
}

export function updateVideo(token: string, videoId: number, payload: VideoUpdate) {
  return apiRequest<Video>(`/videos/${videoId}`, {
    method: 'PATCH',
    body: payload,
    token,
  });
}

export function deleteVideo(token: string, videoId: number) {
  return apiRequest<Video>(`/videos/${videoId}`, {
    method: 'DELETE',
    token,
  });
}

export type UploadVideoInput = {
  course_id: number;
  title: string;
  content: string;
  seccion: number;
  url?: string | null;
  descarga?: string | null;
  title_accordion?: string | null;
  file: File;
};

export function uploadVideoFile(token: string, input: UploadVideoInput) {
  const formData = new FormData();
  formData.set('course_id', String(input.course_id));
  formData.set('title', input.title);
  formData.set('content', input.content);
  formData.set('seccion', String(input.seccion));

  if (input.url) {
    formData.set('url', input.url);
  }

  if (input.descarga) {
    formData.set('descarga', input.descarga);
  }

  if (input.title_accordion) {
    formData.set('title_accordion', input.title_accordion);
  }

  formData.set('file', input.file);

  return apiRequest<Video>('/videos/upload', {
    method: 'POST',
    body: formData,
    token,
  });
}

export function getVideoFileUrl(videoId: number) {
  return `${API_BASE_URL}/videos/${videoId}/file`;
}
