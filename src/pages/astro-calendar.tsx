import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";
import RSSFeed from "@/components/RSSFeed";

export default function AstroCalendar() {
  useSetupConnection();
  useLoadIntialValues();

  return (
    <section className="daily-horp d-inline-block w-100">
      <div className="container">
        <br />
        <br />
        <br />
        <br />
        <div className="comon-heading text-center">
          <h2 className="comon-heading mt-2 mb-3">
            {" "}
            Astronomy Calendar of Celestial Events
          </h2>
          <h1 className="text-green sub-heading mt-2 mb-3">
            {" "}
            Calendar Year 2024{" "}
          </h1>
        </div>

        <RSSFeed />
      </div>
    </section>
  );
}
