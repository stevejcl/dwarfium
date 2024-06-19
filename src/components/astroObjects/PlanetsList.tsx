import type { Dispatch, SetStateAction } from "react";
import { AstroObject } from "@/types";
import PlanetObject from "@/components/astroObjects/PlanetObject";
import planetsCatalog from "../../../data/catalogs/moon_planets.json";
import { pluralize } from "@/lib/text_utils";
import { processObjectListOpenNGC } from "@/lib/observation_lists_utils";

console.info("Planet processObjectListOpenNGC");
let objects: AstroObject[] = processObjectListOpenNGC(planetsCatalog);

type PropType = {
  setModule: Dispatch<SetStateAction<string | undefined>>;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};

export default function PlanetsList(props: PropType) {
  const { setModule, setErrors, setSuccess } = props;
  return (
    <div>
      <h4 className="mt-3">
        {objects.length} {pluralize(objects.length, "Object", "Objects")}
      </h4>

      {objects.map((object, i) => (
        <PlanetObject
          setModule={setModule}
          setErrors={setErrors}
          setSuccess={setSuccess}
          key={i}
          object={object}
        />
      ))}
    </div>
  );
}
