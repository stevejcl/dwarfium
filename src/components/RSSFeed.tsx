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
        const xmlData = await fetchWithCorsProxy(rssUrl);
        const feed = await parser.parseString(xmlData);
        const validItems = feed.items.filter((item) => item.isoDate);
        validItems.sort(
          (a, b) =>
            new Date(a.isoDate!).getTime() - new Date(b.isoDate!).getTime()
        );
        const currentDate = new Date();
        const filteredItems = validItems.filter(
          (item) => new Date(item.isoDate!).getTime() >= currentDate.getTime()
        );
        const sanitizedItems = filteredItems.map((item) => ({
          ...item,
          title: item.title
            ? item.title.replace(/\(\d+ days? .+\)/, "").trim()
            : "",
        }));
        setFeedItems(sanitizedItems);
      } catch (error) {
        console.error("Error fetching RSS feed:", error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      {feedItems.map((item, index) => (
        <div
          key={index}
          className="comin-divu-main d-grid align-content-center w-100"
        >
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-4 col-sm-6">
              <figure className="mx-auto mb-3 mb-md-0">
                <img alt="Deep Sky Object" src="/images/astronomy.png" />
              </figure>
            </div>
            <div className="col-lg-10 col-md-8 col-sm-6">
              <h5 className="text-white">
                <span className="rss-feed-title">{item.title}</span> <br />
                <span className="rss-feed-pubDate">{item.pubDate}</span>
              </h5>
              <p className="mt-2">{item.contentSnippet}</p>
              <a
                href={item.link}
                className="btn btn-more mt-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more..
              </a>
            </div>
          </div>
        </div>
      ))}
      <br />
    </div>
  );
};

export default RSSFeed;
