import got from 'got';
import { MusicVideo } from './models';
import { parseSuggestionItem } from './parsers';
import context from './context';
import { HttpsProxyAgent } from 'hpagent';

export const parseGetSuggestionsBody = (body: {
  contents: {
    singleColumnMusicWatchNextResultsRenderer: {
      tabbedRenderer: {
        watchNextTabbedResultsRenderer: {
          tabs: {
            tabRenderer: {
              content: {
                musicQueueRenderer: {
                  content: { playlistPanelRenderer: { contents: [] } };
                };
              };
            };
          }[];
        };
      };
    };
  };
}): MusicVideo[] => {
  const {
    contents,
  } = body.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer;

  const results: MusicVideo[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contents.forEach((content: any) => {
    try {
      const video = parseSuggestionItem(content);
      if (video) {
        results.push(video);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

export async function getSuggestions(
  videoId: string,
  options?: {
    proxy?: HttpsProxyAgent;
  }
): Promise<MusicVideo[]> {
  const response = await got.post(
    'https://music.youtube.com/youtubei/v1/next',
    {
      agent: options?.proxy ? { https: options.proxy } : undefined,
      json: {
        ...context.body,
        enablePersistentPlaylistPanel: true,
        isAudioOnly: true,
        params: 'mgMDCNgE',
        playerParams: 'igMDCNgE',
        tunerSettingValue: 'AUTOMIX_SETTING_NORMAL',
        videoId,
      },
      searchParams: {
        alt: 'json',
        key: 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseGetSuggestionsBody(JSON.parse(response.body));
  } catch {
    return [];
  }
}
