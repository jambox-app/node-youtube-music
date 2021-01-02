export enum AccountType {
  REGULAR = 'regular',
  VERIFIED_ARTIST = 'BADGE_STYLE_TYPE_VERIFIED_ARTIST',
}

export interface MusicVideo {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
  artist: string;
  album: string;
  duration: {
    label: string;
    totalSeconds: number;
  };
}

export interface Playlist {
  playlistId: string;
  title: string;
  thumbnailUrl: string;
  videoCount: string;
}
