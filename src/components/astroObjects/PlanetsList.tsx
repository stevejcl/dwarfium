import { AstroObject } from "@/types";
import PlanetObject from "@/components/astroObjects/PlanetObject";
import planetsCatalog from "../../../data/catalogs/moon_planets.json";
import { pluralize } from "@/lib/text_utils";
import { processObjectListOpenNGC } from "@/lib/observation_lists_utils";

console.info("Planet processObjectListOpenNGC");
let objects: AstroObject[] = processObjectListOpenNGC(planetsCatalog);

export default function PlanetsList() {
  return (
    <div>
      <h4 className="mt-3">
        {objects.length} {pluralize(objects.length, "Object", "Objects")}
      </h4>

      {objects.map((object, i) => (
        <PlanetObject key={i} object={object} />
      ))}
    </div>
  );
}
