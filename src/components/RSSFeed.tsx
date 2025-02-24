import React, { useEffect, useState, useContext } from "react";
import Parser, { Item } from "rss-parser";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { getProxyUrl } from "@/lib/get_proxy_url";

const RSSFeed = () => {
  const [feedItems, setFeedItems] = useState<Item[]>([]);
  let connectionCtx = useContext(ConnectionContext);

  useEffect(() => {
    const parser = new Parser();
    let lat_long_info = "";
    if (connectionCtx.latitude && connectionCtx.longitude) {
      lat_long_info = `&Latitude=${connectionCtx.latitude}&Longitude=${connectionCtx.longitude}`;
    }
    const rssUrl =
      "https://in-the-sky.org/rss.php?feed=deepsky" + lat_long_info;
    console.log(`RSSFeed: rssUrl ${rssUrl}`);
    const fetchFeed = async () => {
      try {
        const response = await fetch(
          `${getProxyUrl(connectionCtx)}?target=${encodeURIComponent(rssUrl)}`
        );

        // Check if the response has data
        if (response.ok) {
          console.log(`RSSFeed: status ${response.status}`);
        }
        if (response.ok && response.status === 200) {
          const xmlData = await response.text();

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
        } else {
          console.error("RSS feed : Error during the request.");
          return undefined;
        }
      } catch (error) {
        console.error("Error fetching RSS feed:", error);
      }
    };

    fetchFeed();
  }, [connectionCtx.latitude, connectionCtx.longitude]);

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
