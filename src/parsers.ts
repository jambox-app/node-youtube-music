import { MusicVideo, PlaylistPreview } from './models';

// eslint-disable-next-line import/prefer-default-export
export const parseDuration = (durationLabel: string): number => {
  const durationList = durationLabel.split(':');
  return durationList.length === 3
    ? parseInt(durationList[0], 10) * 3600 +
        parseInt(durationList[1], 10) * 60 +
        parseInt(durationList[2], 10)
    : parseInt(durationList[0], 10) * 60 + parseInt(durationList[1], 10);
};

export const parseSongSearchResult = (content: {
  musicResponsiveListItemRenderer: {
    flexColumns: {
      musicResponsiveListItemFlexColumnRenderer: {
        text: {
          runs: {
            text: string;
            navigationEndpoint: { watchEndpoint: { videoId: string } };
          }[];
        };
      };
    }[];
    thumbnail: {
      musicThumbnailRenderer: {
        thumbnail: { thumbnails: { url: string }[] };
      };
    };
  };
}): MusicVideo | null => {
  if (
    !content.musicResponsiveListItemRenderer.flexColumns[0]
      .musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint
  ) {
    return null;
  }
  return {
    youtubeId:
      content.musicResponsiveListItemRenderer.flexColumns[0]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
        .navigationEndpoint.watchEndpoint.videoId,
    title:
      content.musicResponsiveListItemRenderer.flexColumns[0]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
    artist:
      content.musicResponsiveListItemRenderer.flexColumns[1]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
    album:
      content.musicResponsiveListItemRenderer.flexColumns[1]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[2].text,
    thumbnailUrl: content.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop()
      ?.url,
    duration: {
      label:
        content.musicResponsiveListItemRenderer.flexColumns[1]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[4].text,
      totalSeconds: parseDuration(
        content.musicResponsiveListItemRenderer.flexColumns[1]
          .musicResponsiveListItemFlexColumnRenderer.text.runs[4].text
      ),
    },
  };
};

export const parseSuggestion = (content: {
  playlistPanelVideoRenderer: {
    navigationEndpoint: { watchEndpoint: { videoId: string } };
    title: { runs: { text: string }[] };
    longBylineText: { runs: { text: string }[] };
    thumbnail: { thumbnails: { url: string }[] };
    lengthText: { runs: { text: string }[] };
  };
}): MusicVideo | null => {
  if (
    !content.playlistPanelVideoRenderer.navigationEndpoint.watchEndpoint.videoId
  ) {
    return null;
  }
  return {
    youtubeId:
      content.playlistPanelVideoRenderer.navigationEndpoint.watchEndpoint
        .videoId,
    title: content.playlistPanelVideoRenderer.title.runs[0].text,
    artist: content.playlistPanelVideoRenderer.longBylineText.runs[0].text,
    album: content.playlistPanelVideoRenderer.longBylineText.runs[2].text,
    thumbnailUrl: content.playlistPanelVideoRenderer.thumbnail.thumbnails.pop()
      ?.url,
    duration: {
      label: content.playlistPanelVideoRenderer.lengthText.runs[0].text,
      totalSeconds: parseDuration(
        content.playlistPanelVideoRenderer.lengthText.runs[0].text
      ),
    },
  };
};

export const parsePlaylistsSearchResults = (content: {
  musicResponsiveListItemRenderer: {
    flexColumns: {
      musicResponsiveListItemFlexColumnRenderer: {
        text: { runs: { text: string }[] };
      };
    }[];
    thumbnail: {
      musicThumbnailRenderer: {
        thumbnail: { thumbnails: { url: string | undefined }[] };
      };
    };
    navigationEndpoint: { browseEndpoint: { browseId: string } };
  };
}): PlaylistPreview | null => {
  if (
    !content.musicResponsiveListItemRenderer.navigationEndpoint.browseEndpoint
      .browseId
  ) {
    return null;
  }
  return {
    title:
      content.musicResponsiveListItemRenderer.flexColumns[0]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
    totalSongs: parseInt(
      content.musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2].text.split(
        ' '
      )[0],
      10
    ),
    thumbnailUrl: content.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop()
      ?.url,
    playlistId:
      content.musicResponsiveListItemRenderer.navigationEndpoint.browseEndpoint
        .browseId,
  };
};

export const parseMusicFromPlaylist = (content: {
  musicResponsiveListItemRenderer: {
    thumbnail: {
      musicThumbnailRenderer: {
        thumbnail: {
          thumbnails: { url: string }[];
        };
      };
    };
    fixedColumns: {
      musicResponsiveListItemFixedColumnRenderer: {
        text: { runs: { text: string }[] };
      };
    }[];
    flexColumns: {
      musicResponsiveListItemFlexColumnRenderer: {
        text: {
          runs: {
            navigationEndpoint: { watchEndpoint: { videoId: string } };
            text: string;
          }[];
        };
      };
    }[];
  };
}): MusicVideo | null => {
  if (
    !content.musicResponsiveListItemRenderer.flexColumns[0]
      .musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint
      .watchEndpoint.videoId
  ) {
    return null;
  }
  return {
    youtubeId:
      content.musicResponsiveListItemRenderer.flexColumns[0]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0]
        .navigationEndpoint.watchEndpoint.videoId,
    title:
      content.musicResponsiveListItemRenderer.flexColumns[0]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
    artist:
      content.musicResponsiveListItemRenderer.flexColumns[1]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
    album:
      content.musicResponsiveListItemRenderer.flexColumns[2]
        .musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
    thumbnailUrl: content.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop()
      ?.url,
    duration: {
      label:
        content.musicResponsiveListItemRenderer.fixedColumns[0]
          .musicResponsiveListItemFixedColumnRenderer.text.runs[0].text,
      totalSeconds: parseDuration(
        content.musicResponsiveListItemRenderer.fixedColumns[0]
          .musicResponsiveListItemFixedColumnRenderer.text.runs[0].text
      ),
    },
  };
};
