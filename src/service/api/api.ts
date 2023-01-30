import Episode from "@/types/Episode";
import Podcast from "@/types/Podcast";

const MILISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

const currentTime = () => {
  return (new Date()).getTime();
}

const storeable = (key: string, callable: () => Promise<any>, expiration: number = MILISECONDS_IN_DAY): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stored = localStorage.getItem(key);

    if(stored) {
      const parsedData = JSON.parse(stored);

      if( parsedData.time + expiration < currentTime() ) {
        localStorage.removeItem(key);
      } else {
        return resolve(parsedData.data);
      }

    }

    callable().then( (res) => {
      const dataString = JSON.stringify({
        time: currentTime(),
        data: res
      });

      localStorage.setItem(key, dataString);

      resolve(res);
    }, reject);
  });
};

export const getPodcasts: () => Promise<Podcast[]> = async () => {
  const url = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

  return storeable( url, async () => {
    const response = await fetch(url, {mode: 'cors'});
    const data = await response.json();

    return data.feed.entry.map((item: any) => ({
      id: Number(item.id.attributes['im:id']),
      name: item['im:name'].label,
      image: item['im:image'][2].label,
      author: item['im:artist'].label,
      description: item.summary.label,
    }));
  });
};

export const getPodcastDetails: (podcastId: number) => Promise<Podcast | undefined> = async (podcastId) => {
  const podcasts = await getPodcasts();

  return podcasts.find( podcast => podcast.id === podcastId);
};

export const getPodcastEpisodes: (podcastId: number) => Promise<Episode[]> = async (podcastId) => {
  const url = encodeURIComponent(`https://itunes.apple.com/lookup?id=${podcastId}&country=US&media=podcast&entity=podcastEpisode`);

  return storeable( url, async () => {
    const response = await fetch('https://api.allorigins.win/raw?url='+url, {mode: 'cors'});
    const data = await response.json();

    return data.results
    .filter((item: any) => item.kind === 'podcast-episode')
    .map((item: any) => ({
      id: item.trackId,
      name: item.trackName,
      releaseDate: item.releaseDate,
      duration: item.trackTimeMillis,
      description: item.description,
      source: item.episodeUrl,
    }));
  });
};

export const getPodcastEpisodeDetails: (podcastId: number, episodeId: number) => Promise<Episode | undefined> = async (podcastId, episodeId) => {
  const episodes = await getPodcastEpisodes(podcastId);

  return episodes.find( episode => episode.id === episodeId);
};
