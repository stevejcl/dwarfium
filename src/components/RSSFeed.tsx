import React, { useEffect, useState } from "react";
import Parser, { Item } from "rss-parser";
import { fetchWithCorsProxy } from "@/lib/cors_proxy";

const RSSFeed = () => {
  const [feedItems, setFeedItems] = useState<Item[]>([]);

  useEffect(() => {
    const parser = new Parser();
    const rssUrl = "https://in-the-sky.org/rss.php?feed=deepsky";

    const fetchFeed = async () => {
      try {
        // Fetch XML data from the RSS feed URL using your CORS proxy
        const xmlData = await fetchWithCorsProxy(rssUrl);
        // Parse the XML data using rss-parser
        const feed = await parser.parseString(xmlData);
        // Set the feed items in state
        setFeedItems(feed.items);
      } catch (error) {
        console.error("Error fetching RSS feed:", error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      <h2>RSS Feed</h2>
      <div>
        {feedItems.map((item, index) => (
          <div key={index}>
            <h3>{item.title}</h3>
            <p>{item.pubDate}</p>
            <p>{item.contentSnippet}</p>
            <a href={item.link}>Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RSSFeed;
