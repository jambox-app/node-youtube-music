import got from 'got';
import { HttpsProxyAgent } from 'hpagent';
import context from './context';
import { PlaylistPreview } from './models';
import { parsePlaylistItem } from './parsers';

export const parseSearchPlaylistsBody = (
  body: any,
  onlyOfficialPlaylists: boolean
): PlaylistPreview[] => {
  const {
    contents,
  } = body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].musicShelfRenderer;

  const results: PlaylistPreview[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contents.forEach((content: any) => {
    try {
      const playlist = parsePlaylistItem(content, onlyOfficialPlaylists);
      if (playlist) {
        results.push(playlist);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

export async function searchPlaylists(
  query: string,
  options?: {
    onlyOfficialPlaylists?: boolean;
    proxy?: HttpsProxyAgent;
  }
): Promise<PlaylistPreview[]> {
  const response = await got.post(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    {
      agent: options?.proxy ? { https: options.proxy } : undefined,
      json: {
        ...context.body,
        params: 'EgWKAQIoAWoKEAoQAxAEEAUQCQ%3D%3D',
        query,
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseSearchPlaylistsBody(
      JSON.parse(response.body),
      options?.onlyOfficialPlaylists ?? false
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}
