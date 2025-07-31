import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const parser = new XMLParser();
    const data = await fetch(feedURL, {
            method: 'GET',
            headers: ({
                "User-Agent": "gator"
            })
        }
    );
    if(!data){
        throw new Error("Error fetching data.");
    }

    const dataText = await data.text();
    let jObj = parser.parse(dataText);

    if (jObj.rss.channel){
        if(jObj.rss.channel.title && jObj.rss.channel.link && jObj.rss.channel.description){
            if(jObj.rss.channel.item){
                const items: RSSItem[] = [];
                for(let item of jObj.rss.channel.item){
                    if(item.title && item.link && item.description && item.pubDate){
                        items.push(item);
                    }
                }
                const res = {
                    channel: {
                        title: jObj.rss.channel.title,
                        link: jObj.rss.channel.link,
                        description: jObj.rss.channel.description,
                        item: items
                    }
                };
                return res;
            } else {
                const res = {
                    channel: {
                        title: jObj.rss.channel.title,
                        link: jObj.rss.channel.link,
                        description: jObj.rss.channel.description,
                        item: []
                    }
                };
                return res;
            }
        } else {
            throw new Error("Error: One or more of the title, link and despription parameters are not provided.");
        }
    } else {
        console.log(jObj);
        throw new Error("Error: Wrong fetched object, no channel field");
    }
}