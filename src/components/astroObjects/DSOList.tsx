import { useState, useEffect, useContext } from "react";

import { AstroObject } from "@/types";
import DSOObject from "@/components/astroObjects/DSOObject";
import DSOSearch from "@/components/astroObjects/DSOSearch";
import { pluralize } from "@/lib/text_utils";
import { ConnectionContext } from "@/stores/ConnectionContext";

let objectTypesMenu = [
  { value: "all", label: "All" },
  { value: "visible", label: "Visible" },
  { value: "clusters", label: "Clusters" },
  { value: "galaxies", label: "Galaxies" },
  { value: "nebulae", label: "Nebulae" },
  { value: "stars", label: "Stars" },
  { value: "large", label: "Large Dso" },
  { value: "small", label: "Small Dso" },
  { value: "tiny", label: "Tiny Dso" },
  { value: "mosaic", label: "Mosaic" },
];

type PropType = {
  objects: AstroObject[];
};

export default function DSOList(props: PropType) {
  let connectionCtx = useContext(ConnectionContext);
  let dsoObjects: AstroObject[] = props.objects;

  const [objects, setObjects] = useState(dsoObjects);
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [searchTxtValue, setSearchTxtValue] = useState("");

  useEffect(() => {
    filterObjects();
  }, [selectedCategories, dsoObjects, searchTxtValue]); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to update the search text in the context
  const updateSearchTextInContext = (searchValue) => {
    if (searchValue === "") {
      setSearchTxtValue("");
      connectionCtx.setSearchTxt("");
    }

    if (searchValue) {
      if (/^[\w\s]{0,255}$/i.test(searchValue)) {
        setSearchTxtValue(searchValue);
        connectionCtx.setSearchTxt(searchValue);
      }
    } else {
      setSearchTxtValue("");
      connectionCtx.setSearchTxt("");
    }
  };

  function selectCategoryHandler(targetCategory: string) {
    const categoriesToKeep = ["visible", "large", "small", "tiny"];
    if (targetCategory === "all") {
      setSelectedCategories((prev) => {
        // Filter out categories that are not in categoriesToKeep
        const filteredCategories = prev.filter((type) =>
          categoriesToKeep.includes(type)
        );

        // Add "all" if it's not already in the array
        if (!filteredCategories.includes("all")) {
          filteredCategories.push("all");
        }
        return filteredCategories;
      });
      // remove category
    } else if (selectedCategories.includes(targetCategory)) {
      setSelectedCategories((prev) => {
        // Filter out targetCategory
        const filteredCategories = prev.filter(
          (type) => type !== targetCategory
        );

        // Check if all remaining categories are from KeepCategory
        const allCategoriesAreKeep = filteredCategories.every(
          (category) =>
            category === "visible" ||
            category === "large" ||
            category === "small" ||
            category === "tiny"
        );

        // If there are no categories left or all remaining categories are from KeepCategory, add "ALL"
        if (filteredCategories.length === 0 || allCategoriesAreKeep) {
          filteredCategories.push("all");
        }
        return filteredCategories;
      });
      // add category
    } else if (categoriesToKeep.includes(targetCategory)) {
      setSelectedCategories((prev) => {
        // Add targetCategory to prev
        return [...prev, targetCategory];
      });
    } else {
      setSelectedCategories((prev) =>
        prev.filter((type) => type !== "all").concat([targetCategory])
      );
    }
  }

  function filterObjects() {
    let dataSearchTxt = "";
    if (connectionCtx.searchTxt) {
      dataSearchTxt = connectionCtx.searchTxt;
    }

    let sizeDso: string[] = [];
    if (selectedCategories.includes("large")) {
      sizeDso.push("large_dso");
    }
    if (selectedCategories.includes("small")) {
      sizeDso.push("small_dso");
    }
    if (selectedCategories.includes("tiny")) {
      sizeDso.push("tiny_dso");
    }
    if (selectedCategories.includes("all")) {
      if (dataSearchTxt) {
        if (selectedCategories.includes("visible")) {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                (sizeDso.length === 0 ||
                  sizeDso.includes(object.notes?.toString() ?? "")) &&
                object.visible &&
                object.displayName
                  .toLowerCase()
                  .includes(dataSearchTxt.toLowerCase())
              );
            })
          );
        } else {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                (sizeDso.length === 0 ||
                  sizeDso.includes(object.notes?.toString() ?? "")) &&
                object.displayName
                  .toLowerCase()
                  .includes(dataSearchTxt.toLowerCase())
              );
            })
          );
        }
      } else {
        if (selectedCategories.includes("visible")) {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                (sizeDso.length === 0 ||
                  sizeDso.includes(object.notes?.toString() ?? "")) &&
                object.visible
              );
            })
          );
        } else {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                sizeDso.length === 0 ||
                sizeDso.includes(object.notes?.toString() ?? "")
              );
            })
          );
        }
      }
    } else {
      if (dataSearchTxt) {
        if (selectedCategories.includes("visible")) {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                (sizeDso.length === 0 ||
                  sizeDso.includes(object.notes?.toString() ?? "")) &&
                selectedCategories.includes(object.typeCategory) &&
                object.visible &&
                object.displayName
                  .toLowerCase()
                  .includes(dataSearchTxt.toLowerCase())
              );
            })
          );
        } else {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                (sizeDso.length === 0 ||
                  sizeDso.includes(object.notes?.toString() ?? "")) &&
                selectedCategories.includes(object.typeCategory) &&
                object.displayName
                  .toLowerCase()
                  .includes(dataSearchTxt.toLowerCase())
              );
            })
          );
        }
      } else {
        if (selectedCategories.includes("visible")) {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                (sizeDso.length === 0 ||
                  sizeDso.includes(object.notes?.toString() ?? "")) &&
                object.visible &&
                selectedCategories.includes(object.typeCategory)
              );
            })
          );
        } else {
          setObjects(
            dsoObjects.filter((object) => {
              return (
                selectedCategories.includes(object.typeCategory) &&
                (sizeDso.length === 0 ||
                  sizeDso.includes(object.notes?.toString() ?? ""))
              );
            })
          );
        }
      }
    }
  }

  return (
    <div>
      <div className="container">
        <ul className="nav nav-pills mt-3">
          {objectTypesMenu.map((type) => (
            <li
              key={type.value}
              className={`daily-horp nav-item nav-link rounded-pill ${
                selectedCategories.includes(type.value) ? "active" : ""
              }`}
              onClick={() => selectCategoryHandler(type.value)}
            >
              {type.label}
            </li>
          ))}
        </ul>
        <hr />
        <DSOSearch updateSearchText={updateSearchTextInContext} />
        <hr />
        <h4 className="mt-3">
          {objects.length} {pluralize(objects.length, "Object", "Objects")}
        </h4>
        {objects.map((object) => (
          <DSOObject key={object.designation} object={object} />
        ))}
      </div>
    </div>
  );
}
