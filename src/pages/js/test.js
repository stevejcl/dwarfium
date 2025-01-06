        var startup_image = "M31";
        var target_info_text = "Supported target formats\n" +
            "\n" +
            "Target name:\n" +
            "A target name that can be resolved by name resolvers.\n" +
            "\n" +
            "RA/DEC in hours and degrees:\n" +
            "HH:MM:SS DD:MM:SS\n" +
            "HH MM SS DD MM SS\n" +
            "HH:MM:SS/DD:MM:SS\n" +
            "HH MM SS/DD MM SS\n" +
            "HHMMSS DDMMSS\n" +
            "HH.dec DD.dec\n" +
            "\n" +
            "RA/DEC in decimal degrees:\n" +
            "\n" +
            "d DD.dec DD.dec";

        var hoursToDeg = 15;
        var hour_ms = 60 * 60 * 1000;
        var day_ms = 24 * hour_ms;

        // Messier catalog is the default catalog
        var messier_catalog = {
            "Credits": "Information retrieved from Sesame",
            "format": ["CAT", "RA", "DEC", "TYPE", "CON", "BMAG", "DST", "NAME", "INFO", "SIZE"],
            "data": [
                ["M 1", 5.57554, 22.0145, "SuperNova Remnant", "", 0, 0, "", "", 7.0],
                ["M 2", 21.55751, -0.82325, "Globular Cluster", "", 0, 0, "", "", 12.9],
                ["M 3", 13.70323, 28.37728, "Globular Cluster", "", 0, 0, "", "", 16.2],
                ["M 4", 16.39312, -26.52575, "Globular Cluster", "", 0, 0, "", "", 26.3],
                ["M 5", 15.30923, 2.08103, "Globular Cluster", "", 0, 0, "", "", 17.4],
                ["M 6", 17.67222, -32.25333, "Open (galactic) Cluster", "", 0, 0, "", "", 20.0],
                ["M 7", 17.8975, -34.79333, "Open (galactic) Cluster", "", 0, 0, "", "", 100.1],
                ["M 8", 18.06028, -24.38667, "HII (ionized) region", "", 0, 0, "", "", 0],
                ["M 9", 17.31994, -18.51625, "Globular Cluster", "", 0, 0, "", "", 8.7],
                ["M 10", 16.95251, -4.10031, "Globular Cluster", "", 0, 0, "", "", 15.1],
                ["M 11", 18.85139, -6.27, "Open (galactic) Cluster", "", 0, 0, "", "", 8.9],
                ["M 12", 16.78727, -1.94853, "Globular Cluster", "", 0, 0, "", "", 14.5],
                ["M 13", 16.6949, 36.46132, "Globular Cluster", "", 0, 0, "", "", 33.0],
                ["M 14", 17.62671, -3.24592, "Globular Cluster", "", 0, 0, "", "", 13.5],
                ["M 15", 21.49954, 12.167, "Globular Cluster", "", 0, 0, "", "", 12.3],
                ["M 16", 18.31333, -13.80667, "Open (galactic) Cluster", "", 0, 0, "", "", 5.05],
                ["M 17", 18.34639, -16.17167, "Open (galactic) Cluster", "", 0, 0, "", "", 1.63],
                ["M 18", 18.33278, -17.10167, "Open (galactic) Cluster", "", 0, 0, "", "", 5.0],
                ["M 19", 17.0438, -26.26794, "Globular Cluster", "", 0, 0, "", "", 9.6],
                ["M 20", 18.045, -22.97167, "Open (galactic) Cluster", "", 0, 0, "", "", 28.0],
                ["M 21", 18.07028, -22.49, "Open (galactic) Cluster", "", 0, 0, "", "", 14.0],
                ["M 22", 18.60665, -23.90475, "Globular Cluster", "", 0, 0, "", "", 24.0],
                ["M 23", 17.95111, -18.985, "Open (galactic) Cluster", "", 0, 0, "", "", 35.0],
                ["M 24", 18.28, -18.55, "Association of Stars", "", 0, 0, "", "", 120.0],
                ["M 25", 18.52972, -19.11667, "Open (galactic) Cluster", "", 0, 0, "", "", 31.3],
                ["M 26", 18.755, -9.38333, "Open (galactic) Cluster", "", 0, 0, "", "", 7.1],
                ["M 27", 19.99343, 22.7212, "Planetary Nebula", "", 0, 0, "", "", 0.133],
                ["M 28", 18.40914, -24.86983, "Globular Cluster", "", 0, 0, "", "", 11.2],
                ["M 29", 20.39889, 38.52333, "Open (galactic) Cluster", "", 0, 0, "", "", 12.7],
                ["M 30", 21.67281, -23.17986, "Globular Cluster", "", 0, 0, "", "", 11.0],
                ["M 31", 0.71231, 41.26875, "Galaxy", "", 0, 0, "", "", 199.53],
                ["M 32", 0.71162, 40.86517, "Interacting Galaxies", "", 0, 0, "", "", 0],
                ["M 33", 1.56414, 30.65994, "Galaxy in Group of Galaxies", "", 0, 0, "", "", 60.26],
                ["M 34", 2.70139, 42.76167, "Open (galactic) Cluster", "", 0, 0, "", "", 48.4],
                ["M 35", 6.14833, 24.33333, "Open (galactic) Cluster", "", 0, 0, "", "", 38.3],
                ["M 36", 5.605, 34.14, "Open (galactic) Cluster", "", 0, 0, "", "", 10.3],
                ["M 37", 5.87167, 32.55333, "Open (galactic) Cluster", "", 0, 0, "", "", 19.3],
                ["M 38", 5.47861, 35.855, "Open (galactic) Cluster", "", 0, 0, "", "", 19.6],
                ["M 39", 21.53, 48.43333, "Open (galactic) Cluster", "", 0, 0, "", "", 120.4],
                ["M 40", 12.37015, 58.08294, "Composite object", "", 0, 0, "", "", 0],
                ["M 41", 6.76694, -20.75667, "Open (galactic) Cluster", "", 0, 0, "", "", 39.8],
                ["M 42", 5.58814, -5.39111, "HII (ionized) region", "", 0, 0, "", "", 66.0],
                ["M 43", 5.59194, -5.27, "HII (ionized) region", "", 0, 0, "", "", 0],
                ["M 44", 8.67333, 19.66667, "Open (galactic) Cluster", "", 0, 0, "", "", 118.2],
                ["M 45", 3.78333, 24.11667, "Open (galactic) Cluster", "", 0, 0, "", "", 1200.0],
                ["M 46", 7.69611, -14.81, "Open (galactic) Cluster", "", 0, 0, "", "", 25.3],
                ["M 47", 7.60972, -14.48333, "Open (galactic) Cluster", "", 0, 0, "", "", 31.1],
                ["M 48", 8.22861, -5.75, "Open (galactic) Cluster", "", 0, 0, "", "", 44.3],
                ["M 49", 12.49633, 8.00041, "Seyfert 2 Galaxy", "", 0, 0, "", "", 10.96],
                ["M 50", 7.04653, -8.33778, "Open (galactic) Cluster", "", 0, 0, "", "", 31.6],
                ["M 51", 13.49797, 47.19526, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 10.0],
                ["M 52", 23.41333, 61.59333, "Open (galactic) Cluster", "", 0, 0, "", "", 16.0],
                ["M 53", 13.21535, 18.16817, "Globular Cluster", "", 0, 0, "", "", 12.6],
                ["M 54", 18.91759, -30.47986, "Globular Cluster", "", 0, 0, "", "", 9.1],
                ["M 55", 19.66659, -30.96475, "Globular Cluster", "", 0, 0, "", "", 19.0],
                ["M 56", 19.27655, 30.18347, "Globular Cluster", "", 0, 0, "", "", 7.1],
                ["M 57", 18.89308, 33.02913, "Planetary Nebula", "", 0, 0, "", "", 1.153],
                ["M 58", 12.62878, 11.81809, "Seyfert Galaxy", "", 0, 0, "", "", 5.62],
                ["M 59", 12.70064, 11.64693, "Galaxy in Group of Galaxies", "", 0, 0, "", "", 5.5],
                ["M 60", 12.72778, 11.55261, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 7.94],
                ["M 61", 12.36526, 4.47377, "Seyfert 2 Galaxy", "", 0, 0, "", "", 6.17],
                ["M 62", 17.02017, -30.11236, "Globular Cluster", "", 0, 0, "", "", 14.1],
                ["M 63", 13.26369, 42.02937, "LINER-type Active Galaxy Nucleus", "", 0, 0, "", "", 13.18],
                ["M 64", 12.94547, 21.68266, "Seyfert Galaxy", "", 0, 0, "", "", 9.77],
                ["M 65", 11.31554, 13.09221, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 8.32],
                ["M 66", 11.33751, 12.99129, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 8.51],
                ["M 67", 8.855, 11.8, "Open (galactic) Cluster", "", 0, 0, "", "", 25.0],
                ["M 68", 12.65777, -26.74406, "Globular Cluster", "", 0, 0, "", "", 12.0],
                ["M 69", 18.52308, -32.34808, "Globular Cluster", "", 0, 0, "", "", 7.1],
                ["M 70", 18.72021, -32.29211, "Globular Cluster", "", 0, 0, "", "", 7.8],
                ["M 71", 19.89625, 18.77919, "Globular Cluster", "", 0, 0, "", "", 7.2],
                ["M 72", 20.89103, -12.53731, "Globular Cluster", "", 0, 0, "", "", 5.9],
                ["M 73", 20.98333, -12.63333, "Cluster of Stars", "", 0, 0, "", "", 0],
                ["M 74", 1.6116, 15.78346, "Galaxy", "", 0, 0, "", "", 9.33],
                ["M 75", 20.10134, -21.92226, "Globular Cluster", "", 0, 0, "", "", 2.383],
                ["M 76", 1.70546, 51.57543, "Planetary Nebula", "", 0, 0, "", "", 2.307],
                ["M 77", 2.71133, -0.01329, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 6.92],
                ["M 78", 5.77939, 0.07917, "Reflection Nebula", "", 0, 0, "", "", 0],
                ["M 79", 5.40294, -24.52425, "Globular Cluster", "", 0, 0, "", "", 8.7],
                ["M 80", 16.284, -22.97608, "Globular Cluster", "", 0, 0, "", "", 8.9],
                ["M 81", 9.92588, 69.06529, "Seyfert 2 Galaxy", "", 0, 0, "", "", 21.38],
                ["M 82", 9.93123, 69.6797, "Interacting Galaxies", "", 0, 0, "", "", 0],
                ["M 83", 13.61692, -29.86576, "Starburst Galaxy", "", 0, 0, "", "", 13.8],
                ["M 84", 12.41771, 12.88698, "Seyfert 2 Galaxy", "", 0, 0, "", "", 6.46],
                ["M 85", 12.42335, 18.19108, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 7.76],
                ["M 86", 12.43661, 12.94597, "Galaxy in Group of Galaxies", "", 0, 0, "", "", 10.47],
                ["M 87", 12.51373, 12.39112, "Brightest galaxy in a Cluster (BCG)", "", 0, 0, "", "", 9.12],
                ["M 88", 12.53312, 14.42041, "Seyfert 2 Galaxy", "", 0, 0, "", "", 7.76],
                ["M 89", 12.59439, 12.55634, "LINER-type Active Galaxy Nucleus", "", 0, 0, "", "", 6.92],
                ["M 90", 12.61384, 13.16287, "Seyfert 2 Galaxy", "", 0, 0, "", "", 9.77],
                ["M 91", 12.59068, 14.49632, "LINER-type Active Galaxy Nucleus", "", 0, 0, "", "", 5.37],
                ["M 92", 17.28539, 43.13594, "Globular Cluster", "", 0, 0, "", "", 11.2],
                ["M 93", 7.74167, -23.85667, "Open (galactic) Cluster", "", 0, 0, "", "", 24.2],
                ["M 94", 12.8481, 41.12015, "Seyfert Galaxy", "", 0, 0, "", "", 11.48],
                ["M 95", 10.7327, 11.70361, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 7.08],
                ["M 96", 10.77937, 11.81994, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 7.24],
                ["M 97", 11.24659, 55.01902, "Planetary Nebula", "", 0, 0, "", "", 3.333],
                ["M 98", 12.23008, 14.90047, "LINER-type Active Galaxy Nucleus", "", 0, 0, "", "", 9.55],
                ["M 99", 12.31378, 14.41649, "HII Galaxy", "", 0, 0, "", "", 5.13],
                ["M 100", 12.38193, 15.8223, "Active Galaxy Nucleus", "", 0, 0, "", "", 7.59],
                ["M 101", 14.0535, 54.34875, "Galaxy in Pair of Galaxies", "", 0, 0, "", "", 21.88],
                ["M 102", 15.10821, 55.76331, "Seyfert Galaxy", "", 0, 0, "", "", 6.31],
                ["M 103", 1.55639, 60.65, "Open (galactic) Cluster", "", 0, 0, "", "", 7.4],
                ["M 104", 12.66651, -11.62305, "LINER-type Active Galaxy Nucleus", "", 0, 0, "", "", 8.51],
                ["M 105", 10.79711, 12.58163, "LINER-type Active Galaxy Nucleus", "", 0, 0, "", "", 5.13],
                ["M 106", 12.31601, 47.30372, "Seyfert 2 Galaxy", "", 0, 0, "", "", 17.78],
                ["M 107", 16.54218, -13.05378, "Globular Cluster", "", 0, 0, "", "", 10.0],
                ["M 108", 11.19194, 55.67412, "Starburst Galaxy", "", 0, 0, "", "", 7.76],
                ["M 109", 11.96, 53.37452, "Galaxy in Group of Galaxies", "", 0, 0, "", "", 7.24],
                ["M 110", 0.67279, 41.68542, "Galaxy in Group of Galaxies", "", 0, 0, "", "", 18.62]]
        };
        var catalogs_home = "http://127.0.0.1:8000/cat_json/";
        var catalogs = [
            { name: "Messier", targets: messier_catalog.data, url: catalogs_home + "Messier.json", source: "simbad", AladinCatalog: null, color: '#29a329' },
            { name: "NGC", targets: null, url: catalogs_home + "OpenNGC.json", source: "openngc", AladinCatalog: null, color: '#cccccc' },
            { name: "IC", targets: null, url: catalogs_home + "OpenIC.json", source: "openngc", AladinCatalog: null, color: '#cccccc' },
            { name: "Sharpless", targets: null, url: catalogs_home + "Sharpless.json", source: "simbad", AladinCatalog: null, color: '#00afff' },
            { name: "RCW", targets: null, url: catalogs_home + "RCW.json", source: "simbad", AladinCatalog: null, color: '#00af00' },
            { name: "LDN", targets: null, url: catalogs_home + "LDN.json", source: "vizier", AladinCatalog: null, color: '#CBCC49' },
            { name: "LBN", targets: null, url: catalogs_home + "LBN.json", source: "vizier", AladinCatalog: null, color: '#CBCC49' },
            { name: "Barnard", targets: null, url: catalogs_home + "Barnard.json", source: "vizier", AladinCatalog: null, color: '#E0FFFF' },  // light cyan
            { name: "Cederblad", targets: null, url: catalogs_home + "Cederblad.json", source: "vizier", AladinCatalog: null, color: '#A0FFFF' },
            { name: "Slooh 500 Teide", targets: null, url: catalogs_home + "Slooh500Teide.json", source: "slooh", AladinCatalog: null, color: '#29a329' },
            { name: "Slooh 500 Chile", targets: null, url: catalogs_home + "Slooh500Chile.json", source: "slooh", AladinCatalog: null, color: '#29a329' }
        ];
        // zero horizon if nothing else is specified
        var horizon_0 = {
            name: "horizon-0",
            hard: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            soft: null
        };
        var all_services = {
            telescope_services: [
              
                {
                    name: "Dwarflab",
                    radec_format: 1,
                    telescopes: [
                        { name: "Dwarflab II", fov_x: 192, fov_y: 110, lat: null, lng: null, timezoneOffset: "detect_timezone", alt: 100, seeing: "detect_location", horizon_limits: [20], meridian_transit: 10 },
                        { name: "Dwarflab III", fov_x: 210, fov_y: 160, lat: null, lng: null, timezoneOffset: "detect_timezone", alt: 100, seeing: "detect_location", horizon_limits: [20], meridian_transit: 10 }
                    ]
                }
            ]
        };

        // screen location for generic engine
        var viewer_panels = {
            aladin_panel: "aladin-div",                // show Aladin Lite
            aladin_panel_text: "aladin-div-text",
            dayvisibility_panel: "day-div",            // show day visibility
            yearvisibility_panel: "year-div",          // show year visibility
            yearvisibility_panel_text: "year-div-text",
            dayvisibility_panel_text: "day-div-text",
            status_text: "error_text",
            error_text: "error_text",
            //startup_info_text: "startup_info_text",
            mosaic_panel_x: 5,
            mosaic_panel_y: 5,

        };

        var viewer_params = {
            fov_x: null,
            fov_y: null,
            location_lat: null,
            location_lng: null,
            horizonSoft: null,
            horizonHard: null,
            meridian_transit: null,
            UTCdate_ms: null,
            timezoneOffset: null,  // in hours, null means UTC, should match with lat/lng
            grid_type: null,
            grid_size_x: null,
            grid_size_y: null,
            isCustomMode: false,
            current_telescope_service: null,
            isRepositionModeFunc: isRepositionMode,
            repositionTargetFunc: repositionTarget
        };

        var element_div_size = "725px";      // for height and width
        var element_div_size_int = 600;
        var element_div_size2_h = "303px";   // half of element_div_size
        var element_div_size2_w = "600px";

     

        var engine_native_resources = {
            aladin_object_clicked: function () { },
            aladin_object_hovered: function () { },
            reset_view: function () { },
            sun_rise_set: function () { },
            object_altitude_init: function () { },
            object_altitude_get: function () { },
            moon_position: function () { },
            moon_topocentric_correction: function () { },
            moon_distance: function () { },
            getTargetAboveRightNow: function () { },
            skip_slooh_catalog: function () { }
        };

        var engine_data = null;
        var screen_setup = null;
        var mobile_screen = false;

        if (screen.height > screen.width) {
            // screen is taller than it is wide
            console.log("mobile_screen", screen.height, screen.width);
            mobile_screen = true;
        } else {
            console.log("not mobile_screen", screen.height, screen.width);
            mobile_screen = false;
        }

        // Most of these are init in initDwarfiumMosaic()
        var telescope_services;
        var current_telescope_service;
        var current_telescope;
        var current_telescope_service_selected_index;
        var current_telescope_selected_index;

        var url = new URL(window.location);
        console.log(url);

        var current_catalog = null;                 // current visible catalog
        var current_catalog_filtered_list = null;   // filtered list of catalog items
        var catalog_filters_changed = true;
        var catalogDiv_select = null;
        var catalog_text = null;
        var catalog_date = null;
        var catalog_filter_time = null;
        var catalogFilterDegrees = null;
        var catalogFilterMoon = null;
        //var catalogFilterMagnitude = null;
        //var catalogFilterTargetSize = null;
        var catalog_index = null;

        var url_target = null;
        var url_add_catalog = null;
        var url_add_service = null;
        var url_set_service = null;
        var url_offaxis = null;
        var url_service = null;
        var url_telescope = null;
        var url_name = null;
        var url_grid_type = null;
        var url_overlap = null;
        var url_grid_size = null;
        var url_date = null;
        var url_services_json = null;
        var url_view = "all";

        document.getElementById("size_x").value = 4;
        document.getElementById("size_y").value = 4;

        if (typeof URLSearchParams === "function") {
            searchParams = new URLSearchParams(url.search.slice(1));
            parse_url(searchParams);
            if (url_services_json != null) {
                // load services json and start astro mosaic when load completes
                load_services_json(url_services_json);
            }
        }

        if (url_services_json == null) {
            // Start dwarfium mosaic. We may also start after loading
            // json services file
            startDwarfiumMosaic("normal start");
        }

        function createRowDiv(rownum) {
            var row = document.createElement("DIV");
            row.id = "row-" + rownum.toString();
            row.className = "flex-container";
            return row;
        }

        function appendCellDiv(col, id, height, width, add_text) {
            var margin = "10px";
            var x = document.createElement("DIV");
            x.id = id;
            x.style.height = height;
            x.style.width = width;
            x.style.margin = margin;
            //x.style.color = "red";
            col.appendChild(x);
            if (add_text) {
                x.id = id;
                var x = document.createElement("P");
                x.id = id + "-text";
                x.style.margin = margin;
                col.appendChild(x);
            }
        }

        function createDefaultPanels(mobile_screen) {
            if (url_view != 'all') {
                return;
            }
            console.log("createDefaultPanels", mobile_screen);

            var panels = document.getElementById("DivLoadPanels");
            panels.innerHTML = ""; // Clear previous content

            var size1 = element_div_size;
            var size2_h = element_div_size2_h;
            var size2_w = element_div_size2_w;

            if (mobile_screen) {
                appendCellDiv(panels, "aladin-div", size1, size1, true);
                appendCellDiv(panels, "day-div", size2_h, size2_w, true);
                appendCellDiv(panels, "year-div", size2_h, size2_w, url_view != "all");
            } else {
                // Create row and place aladin-div, day-div, and year-div
                var row = document.createElement("DIV");
                row.className = "row";

                // Add aladin-div
                var col1 = document.createElement("DIV");
                col1.className = "col";
                appendCellDiv(col1, "aladin-div", size1, size1, true);
                row.appendChild(col1);

                // Add day-div and year-div
                var col2 = document.createElement("DIV");
                col2.className = "col";
                appendCellDiv(col2, "day-div", size2_h, size2_w, true);
                appendCellDiv(col2, "year-div", size2_h, size2_w, url_view != "all");
                row.appendChild(col2);

                panels.appendChild(row);
            }
        }

        function createMosaicPanels(max_x, max_y) {
            console.log("createMosaicPanels");

            var panels = document.getElementById("DivLoadPanels");

            panels.innerHTML = "";

            for (var i = 0; i < max_y; i++) {
                // row
                var row = document.createElement("DIV");
                row.className = "flex-container";
                for (var j = 0; j < max_x; j++) {
                    var col = document.createElement("DIV");
                    var x = document.createElement("DIV");
                    x.id = "panel-view-div-" + i.toString() + j.toString();
                    x.style.height = "300px";
                    x.style.width = "300px";
                    x.style.padding = "2px";
                    x.style.margin = "2px";
                    x.style.color = "white";
                    col.appendChild(x);
                    var x = document.createElement("P");
                    x.id = "panel-text-div-" + i.toString() + j.toString();
                    col.appendChild(x);
                    row.appendChild(col);
                }
                panels.appendChild(row);
            }
        }

        function startDwarfiumMosaic(txt) {
            console.log("startDwarfiumMosaic", txt);

            apply_url_add();

            // initialization
            initDwarfiumMosaic();

            // setup done, show target image
            if (url_view == "all") {
                document.getElementById("target").value = startup_image;
            }
            ViewImage(0);
        }

        function initDwarfiumMosaic() {
            console.log("initDwarfiumMosaic");

            StartDwarfiumMosaicViewerEngine('get_engine_native_resources', null, null, null, null, null, engine_native_resources, null);

            init_all_services();

            telescope_services = all_services.telescope_services;
            current_telescope_service_selected_index = 0;
            current_telescope_service = telescope_services[current_telescope_service_selected_index];
            console.log("current_telescope_service", current_telescope_service.name);
            if (current_telescope_service.hasOwnProperty('default_telescope')) {
                current_telescope_selected_index = current_telescope_service.default_telescope;
            } else {
                current_telescope_selected_index = 0;
            }
            current_telescope = current_telescope_service.telescopes[current_telescope_selected_index];
            console.log("current_telescope", current_telescope.name);

            apply_url_set();

            load_and_init_catalogs();
            update_telescope_service_list();
            update_telescope_list(current_telescope_service.name);
            update_catalog_list();
            

            engine_native_resources.aladin_object_clicked = aladinObjectClicked;
            engine_native_resources.aladin_object_hovered = aladinObjectHovered;
           
            engine_native_resources.skip_slooh_catalog = skip_slooh_catalog;
        }

        function init_all_services() {
            console.log("init_all_services");

            for (var i = 0; i < all_services.telescope_services.length; i++) {
                for (var j = 0; j < all_services.telescope_services[i].telescopes.length; j++) {
                    if (Array.isArray(all_services.telescope_services[i].telescopes[j].horizon_limits)) {
                        // Already array. Check if it is has enough enties. If not, repeat last item.
                        console.log("init_all_services", "horizon_limits is array");
                        var horizon = {
                            name: "horizon limits",
                            hard: fillHorizonLimits(all_services.telescope_services[i].telescopes[j].horizon_limits),
                            soft: null
                        };
                        all_services.telescope_services[i].telescopes[j].horizon_limits = horizon;
                    } else {
                        // Try to find horizon limits by name
                        console.log("init_all_services", "horizon_limits is name");
                        for (var k = 0; k < all_services.horizon_limits.length; k++) {
                            if (all_services.horizon_limits[k].name == all_services.telescope_services[i].telescopes[j].horizon_limits) {
                                all_services.telescope_services[i].telescopes[j].horizon_limits = all_services.horizon_limits[k];
                                break;
                            }
                        }
                    }
                    if (all_services.telescope_services[i].telescopes[j].horizon_limits == null) {
                        // not found
                        all_services.telescope_services[i].telescopes[j].horizon_limits = horizon_0;
                    }
                }
            }
        }

        // Load json services file
        function load_services_json(url) {
            console.log("Load services from " + url);

            fetch(url)
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            alert('Problem accessing service ' + url + '. Status Code: ' + response.status);
                            return;
                        }
                        response.json().then(function (jsonData) {
                            console.log("Load services jsonData", jsonData);
                            all_services = jsonData;
                            startDwarfiumMosaic("from load_services_json");
                        })
                    }
                )
                .catch(function (err) {
                    alert('Problem accessing service ' + url + '. Fetch Error :', err);
                }
                );
        }

        // parse parameters from url
        function parse_url(searchParams) {
            console.log("parse_url");

            url_target = searchParams.get('target');
            url_add_catalog = searchParams.get('add_catalog');
            url_add_service = searchParams.get('add_service');
            url_set_service = searchParams.get('set_service');
            url_offaxis = searchParams.get('add_offaxis');
            url_service = searchParams.get('service');
            url_telescope = searchParams.get('telescope');
            url_name = searchParams.get('name');
            url_grid_type = searchParams.get('grid_type');
            url_overlap = searchParams.get('overlap');
            url_grid_size = searchParams.get('grid_size');
            url_date = searchParams.get('date');
            url_services_json = searchParams.get('services_json');
            url_view = searchParams.get('view');
        }

        // apply url add parameters, if there are any
        function apply_url_add() {
            console.log("apply_url_add");
            if (url_add_catalog) {
                set_url_add_catalog(url_add_catalog);
            }
            if (url_set_service) {
                set_url_add_service(url_set_service, true);
            }
            if (url_add_service) {
                set_url_add_service(url_add_service, false);
            }
            if (url_offaxis) {
                set_url_add_offaxis(url_offaxis);
            }
        }

        // apply url set parameters, if there are any
        function apply_url_set() {
            console.log("apply_url_set");
            if (url_target) {
                console.log("url_target", url_target);
                startup_image = url_target;
            }
            if (url_service) {
                // set default service
                console.log("url_service", url_service);
                for (var i = 0; i < all_services.telescope_services.length; i++) {
                    if (all_services.telescope_services[i].name == url_service) {
                        current_telescope_service = all_services.telescope_services[i];
                        if (current_telescope_service.hasOwnProperty('default_telescope')) {
                            current_telescope_selected_index = current_telescope_service.default_telescope;
                        } else {
                            current_telescope_selected_index = 0;
                        }
                        current_telescope = current_telescope_service.telescopes[current_telescope_selected_index];
                        current_telescope_service_selected_index = i;
                        console.log("current_telescope", current_telescope.name);
                        break;
                    }
                }
            }
            if (url_telescope) {
                // set default telescope in current_telescope_service
                console.log("url_telescope", url_telescope);
                for (var i = 0; i < current_telescope_service.telescopes.length; i++) {
                    if (current_telescope_service.telescopes[i].name == url_telescope) {
                        current_telescope = current_telescope_service.telescopes[i];
                        current_telescope_selected_index = i;
                        current_telescope_service.default_telescope = i;
                        console.log("current_telescope", current_telescope.name);
                        break;
                    }
                }
            }
            if (url_name) {
                document.getElementById("astro_mosaic_title").innerHTML = url_name;
            }
            if (url_grid_type) {
                document.getElementById("grid_type").value = url_grid_type;
            }
            if (url_overlap) {
                document.getElementById("overlap_percentage").value = url_overlap;
            } else {
                document.getElementById("overlap_percentage").value = 20;
            }
            if (url_grid_size) {
                let size_vals = url_grid_size.split(",");
                let size_x = size_vals[0];
                let size_y = size_vals[1];
                document.getElementById("size_x").value = parseInt(size_x);
                document.getElementById("size_y").value = parseInt(size_y);
                const gridContainer = document.querySelector(".grid-container");
                gridContainer.style.setProperty("--size-x", size_x);
                gridContainer.style.setProperty("--size-y", size_y);
            }
            if (url_date) {
                document.getElementById("view_date").value = url_date;
            } else {
                var d = new Date();
                url_date = d.toISOString().substr(0, 10);
                document.getElementById("view_date").value = url_date;
            }
            if (url_view) {
                var view_size_h = null;
                var view_size_w = null;
                var font_size = 10;
                var margin = 10;
                var url_view_split = url_view.split(',');
                url_view = url_view_split[0];
                if (url_view_split.length > 1) {
                    view_size_w = url_view_split[1];
                }
                if (url_view_split.length > 2) {
                    view_size_h = url_view_split[2];
                }
                if (view_size_w != null && view_size_h == null) {
                    view_size_h = view_size_w;
                }
                if (view_size_w == null) {
                    view_size_w = window.innerWidth;
                    view_size_h = window.innerHeight;
                }
                view_size_w = view_size_w - 2 * margin;
                view_size_h = view_size_h - 2 * margin;
                if (view_size_w > view_size_h) {
                    aladin_fov_extra = view_size_w / view_size_h;
                } else {
                    aladin_fov_extra = view_size_h / view_size_w;
                }
                console.log("apply_url:url_view", url_view, "view_size_h", view_size_h, "view_size_w", view_size_w);

                var allDiv = document.getElementById("allDiv");
                allDiv.innerHTML = "";

                allDiv.style.height = view_size_h + "px";
                allDiv.style.width = view_size_w + "px";

                var x = document.createElement("DIV");
                x.id = "imageDiv";
                x.style.height = (view_size_h - font_size - margin) + "px";
                x.style.width = (view_size_w - 2 * margin) + "px";
                console.log("x.style.height", x.style.height, "x.style.width", x.style.width);
                allDiv.appendChild(x);

                x = document.createElement("DIV");
                x.id = "textDiv";
                x.style.fontSize = font_size + "px";
                allDiv.appendChild(x);

                viewer_panels.aladin_panel = "imageDiv";
                viewer_panels.aladin_panel_text = "textDiv";
                viewer_panels.dayvisibility_panel = "imageDiv";          
                viewer_panels.yearvisibility_panel = "imageDiv";
                viewer_panels.yearvisibility_panel_text = "textDiv";
                viewer_panels.dayvisibility_panel_text = "textDiv";
                viewer_panels.status_text = "textDiv";
                viewer_panels.error_text = "textDiv";
                viewer_panels.startup_info_text = "textDiv";
            } else {
                url_view = "all";
                dwarfium_mosaic_link = "";
            }
            document.getElementById("allDiv").style.visibility = "visible";
        }

        function isEmptyElement(elems) {
            for (var i = 0; i < elems.length; i++) {
                var val = document.getElementById(elems[i]).value;
                if (!val || val == '') {
                    document.getElementById(viewer_panels.error_text).innerHTML = build_error_text("Error: " + elems[i] + " must be given");
                    return true;
                }
            }
            return false;
        }

       
        // target field action handler
        // we clear catalog list selection if target is changed
        function ViewTarget() {
            catalogDiv_select.value = '';
            ViewImage(0);
        }

        function repositionTarget(target_str) {
            document.getElementById("target").value = target_str;
        }

        function isRepositionMode() {
            return document.getElementById("repositionCheckbox").checked;
        }

        

        function update_telescope_service_list() {
            console.log('update_telescope_service_list');

            if (url_view != "all") {
                return;
            }

            var x = document.getElementById("current-telescope-service");
            while (x.length > 0) {
                x.remove(0);
            }

            // Update list of telescopes
            for (i = 0; i < telescope_services.length; i++) {
                var option = document.createElement("option");
                option.text = telescope_services[i].name;
                x.add(option);
            }
            if (current_telescope_service_selected_index > 0) {
                x.selectedIndex = current_telescope_service_selected_index;
                current_telescope_service_selected_index = 0;
            }
        }

        function update_telescope_list(new_name) {
            console.log('update_telescope_list');

            if (url_view != "all") {
                return;
            }

            var x = document.getElementById("current-telescope");
            while (x.length > 0) {
                x.remove(0);
            }

            // Find the service
            for (var i = 0; i < telescope_services.length; i++) {
                if (telescope_services[i].name == new_name) {
                    console.log('update_telescope_list: current_telescope_service', current_telescope_service.name);
                    current_telescope_service = telescope_services[i];
                    break;
                }
            }
            // Update list of telescopes
            if (current_telescope_service.hasOwnProperty('default_telescope')) {
                current_telescope_selected_index = current_telescope_service.default_telescope;
            } else {
                current_telescope_selected_index = 0;
            }
            current_telescope = current_telescope_service.telescopes[current_telescope_selected_index];
            console.log("current_telescope", current_telescope.name);
            for (i = 0; i < current_telescope_service.telescopes.length; i++) {
                var option = document.createElement("option");
                option.text = current_telescope_service.telescopes[i].name;
                x.add(option);
            }
            if (current_telescope_selected_index > 0) {
                x.selectedIndex = current_telescope_selected_index;
                current_telescope_selected_index = 0;
            }
        }

        function skip_slooh_catalog(service, catalog) {
            return service.name != "Slooh" && catalog.source == "slooh";
        }

        function update_catalog_list() {
            console.log('update_catalog_list');

            if (url_view != "all") {
                return;
            }

            var x = document.getElementById("catalog-selection");
            while (x.length > 0) {
                x.remove(0);
            }
            current_catalog = null;
            for (i = 0; i < catalogs.length; i++) {
                if (skip_slooh_catalog(current_telescope_service, catalogs[i])) {
                    // Skip Slooh catalog on other services
                    continue;
                }
                if (current_catalog == null) {
                    current_catalog = catalogs[i];
                }
                if (catalogs[i].targets != null && catalogs[i].AladinCatalog == null) {
                    addJsonToAladinCatalog(catalogs[i]);
                }
                var option = document.createElement("option");
                option.text = catalogs[i].name;
                x.add(option);
            }
        }

        // Remove leading, trailing and duplicate spaces
        function trim_spaces(str) {
            // replace all whitespace to space
            str = str.replace(/\s/g, " ");
            // remove leading and trailing spaces
            str = str.trim();
            for (var i = 0; i < str.length && str.indexOf('  ') != -1; i++) {
                // remove all duplicate spaces
                str = str.replace(/  /g, " ");
            }
            return str;
        }

        function build_error_text(txt) {
            return "<strong>" + txt + "</strong>";
        }

        /* Get targets from catalog list in a json format. Used for panel view
         * of catalog targets.
         */
        function get_catalog_list_target(list) {
            console.log("get_catalog_list_target");
            var max_targets = viewer_panels.catalog_panel_x * viewer_panels.catalog_panel_y;
            var json = { targets: [] };
            for (var i = 0; i < list.length && json.targets.length < max_targets; i++) {
                var name = list[i][1];
                if (name == "") {
                    continue;
                }
                var radec = list[i][0];
                target = { radec: radec, name: name };
                json.targets[json.targets.length] = target;
            }
            return json;
        }

        function clearStartupInfoText() {
            document.getElementById(viewer_panels.startup_info_text).innerHTML = '';
            startup_info_text = null;
        }

        // Main function to view image. Get parameters
        // and call correct view function
        // Values for oper_
        //      1 - Telescope service changed
        //      2 - Telescope changed
        function ViewImage(oper) {
            var is_telescope_fov = true;

            console.log('ViewImage', oper);

            if (url_view == "all") {
                document.getElementById(viewer_panels.status_text).innerHTML = "";
                document.getElementById(viewer_panels.error_text).innerHTML = "";
            }

            // get current date
            var view_date;
            if (url_view == "all") {
                view_date = document.getElementById("view_date").value;
            } else {
                view_date = url_date;
            }
            var curdate = new Date(view_date);
            if (curdate == null || isNaN(curdate.valueOf())) {
                document.getElementById(viewer_panels.error_text).innerHTML = build_error_text("Invalid ISO format date (YYYY-MM-DD) " + view_date);
                return;
            }
            
            checkFilterTimeChanged();
          

            //console.log("curdate", curdate);
            viewer_params.UTCdate_ms = Date.UTC(parseInt(view_date.substr(0, 4)), parseInt(view_date.substr(5, 2)) - 1,
                parseInt(view_date.substr(8, 2)));
            viewer_params.UTCdatetime_ms = null;
            if (catalog_date != viewer_params.UTCdate_ms) {
                // time changed, reset catalog view list
                console.log("ViewImage, date changed, reset catalog view");
                catalog_date = viewer_params.UTCdate_ms;
                catalog_reset();
            }


            if (oper == 1) {
                // Telescope service changed
                var telescope_service_name = document.getElementById("current-telescope-service").value;
                /* Update list of telescopes. */
                update_telescope_list(telescope_service_name);
                update_catalog_list();
                catalog_filters_changed = true;
            }

            if (oper == 2) {
                // Telescope is changed
                var telescope_name = document.getElementById("current-telescope").value;
                for (var i = 0; i < current_telescope_service.telescopes.length; i++) {
                    if (telescope_name == current_telescope_service.telescopes[i].name) {
                        if (current_telescope.lat != current_telescope_service.telescopes[i].lat
                            || current_telescope.lng != current_telescope_service.telescopes[i].lng) {
                            // when location changes also filtering changes
                            catalog_filters_changed = true;
                        }
                        current_telescope = current_telescope_service.telescopes[i];
                    }
                }
            }

            if (current_telescope.lat == null) {
                // first time, get current location
                // set some default in case we fail to get current location
                setAllUnknownTelescopeLocations(0, 0);
                // get current location
                getCurrentTelescopeLocation();
                return; // wait for getCurrentTelescopeLocation to call us again
            }
            if (current_telescope.timezoneOffset == "detect_timezone") {
                // first time, get timezone offset
                var current_date = new Date();
                current_telescope.timezoneOffset = -current_date.getTimezoneOffset() / 60;    // convert minutes to hours
                console.log("Current location timezoneOffset ", current_telescope.timezoneOffset);
            }

            var curdate = new Date();
            viewer_params.UTCdate_now_ms = Date.UTC(curdate.getUTCFullYear(), curdate.getUTCMonth(), curdate.getUTCDate(),
                curdate.getUTCHours(), curdate.getUTCMinutes());

            if (current_telescope_service.name == "Current location") {
                console.log("ViewImage, current location");
                is_telescope_fov = false;
                if (current_telescope.name == "Now") {
                    console.log("ViewImage, now");
                    viewer_params.UTCdatetime_ms = viewer_params.UTCdate_now_ms;
                    var d = new Date(viewer_params.UTCdatetime_ms + current_telescope.timezoneOffset * 3600 * 1000);
                    var isostr = d.toISOString().substr(0, 16);
                    document.getElementById("view_date").value = isostr.substr(0, 10) + " " + isostr.substr(11, 5);
                } else {
                    if (view_date.length >= 16) {
                        // date and time
                        console.log("ViewImage, date and time");
                        viewer_params.UTCdatetime_ms = Date.UTC(parseInt(view_date.substr(0, 4)), parseInt(view_date.substr(5, 2)) - 1,
                            parseInt(view_date.substr(8, 2)), parseInt(view_date.substr(11, 2)),
                            parseInt(view_date.substr(14, 2)));
                        // we assume time is local time so we adjust timezone offset to get UTC time
                        viewer_params.UTCdatetime_ms = viewer_params.UTCdatetime_ms - current_telescope.timezoneOffset * 3600 * 1000;
                    }
                }
                // Set target to whatever is above right now
                var target_above = engine_native_resources.getTargetAboveRightNow(current_telescope.lat, current_telescope.lng, viewer_params.UTCdatetime_ms);
                document.getElementById("target").value = target_above[0].toFixed(5) + " " + target_above[1].toFixed(5);
            }

            if (url_view == "all") {
                var img_fov = document.getElementById("overlap_percentage").value;
            } else {
                var img_fov = 20;
            }

            // Update processing variables based on telescope
            // XXX PARAMS
            viewer_params.fov_x = current_telescope.fov_x;
            viewer_params.fov_y = current_telescope.fov_y;
            viewer_params.am_fov_x = getDwarfiumMosaicFov(current_telescope.fov_x);
            viewer_params.am_fov_y = getDwarfiumMosaicFov(current_telescope.fov_y);
            viewer_params.location_lat = current_telescope.lat;
            viewer_params.location_lng = current_telescope.lng;
            viewer_params.horizonSoft = current_telescope.horizon_limits.soft;
            viewer_params.horizonHard = current_telescope.horizon_limits.hard;
            viewer_params.meridian_transit = current_telescope.meridian_transit;
            if (current_telescope.timezoneOffset) {
                viewer_params.timezoneOffset = current_telescope.timezoneOffset;
            } else {
                viewer_params.timezoneOffset = 0;
            }
           
            if (current_telescope.hasOwnProperty('offaxis')) {
                viewer_params.offaxis = current_telescope.offaxis;
                viewer_params.offaxis.am_fov_x = getDwarfiumMosaicFov(current_telescope.offaxis.fov_x);
                viewer_params.offaxis.am_fov_y = getDwarfiumMosaicFov(current_telescope.offaxis.fov_y);
                viewer_params.offaxis.am_offset = getDwarfiumMosaicFov(current_telescope.offaxis.offset);
            }

            var target_name;

            console.log("current_telescope", current_telescope.name, "horizonHard[0]", viewer_params.horizonHard[0]);

            init_catalog_view_list();

            json_image_target = null;

            if (url_view == "all") {
                image_target = document.getElementById("target").value;
            } else {
                image_target = startup_image;
            }


            if (url_view == 'all') {
                if (is_telescope_fov) {
                    viewer_params.grid_type = document.getElementById("grid_type").value;
                } else {
                    viewer_params.grid_type = 'visual';
                }
                viewer_params.grid_size_x = parseInt(document.getElementById("size_x").value);
                viewer_params.grid_size_y = parseInt(document.getElementById("size_y").value);
            } else {
                viewer_params.grid_type = 'fov';
                viewer_params.grid_size_x = 1;
                viewer_params.grid_size_y = 1;
            }

            if (json_image_target != null) {
                if (screen_setup != 'catalog_panels') {
                    // switch to catalog_panels view
                    createMosaicPanels(viewer_panels.catalog_panel_x, viewer_panels.catalog_panel_y);
                    screen_setup = 'catalog_panels';
                }
            } else if (viewer_params.grid_type == 'panels') {
                if (screen_setup != 'panels') {
                    // switch to panels view
                    createMosaicPanels(viewer_panels.mosaic_panel_x, viewer_panels.mosaic_panel_y);
                    screen_setup = 'panels';
                }
            } else {
                if (screen_setup != 'default') {
                    // switch to default view
                    createDefaultPanels(mobile_screen);
                    screen_setup = 'default';
                }
            }
            viewer_params.current_telescope_service = current_telescope_service;
            viewer_params.dwarfium_mosaic_link = dwarfium_mosaic_link;

            console.log('call StartDwarfiumMosaicViewerEngine');

            engine_data = null;

            engine_data = StartDwarfiumMosaicViewerEngine(
                url_view,
                image_target,
                viewer_params,
                viewer_panels,
                catalogs,
                img_fov,
                engine_native_resources,
                json_image_target);

            console.log('returned from StartDwarfiumMosaicViewerEngine');

            

        }

        function addTabRow(tab, v1, v2, v3) {
            var tdstyle = 'style="padding: 5px; border: 1px solid black; border-collapse: collapse;"';
            if (v1 && v2 && v3) {
                return tab + '<TR><TD ' + tdstyle + '>' + v1 + '</TD><TD ' + tdstyle + '>' + v2 + '</TD><TD ' + tdstyle + '>' + v3 + "</TD></TR>";
            } else if (v1 && v2) {
                return tab + '<TR><TD ' + tdstyle + '>' + v1 + '</TD><TD ' + tdstyle + '>' + v2 + "</TD></TR>";
            } else {
                return tab;
            }
        }

        

        function catalogToDataObject(target) {
            // target array
            //   0      1     2      3       4      5       6      7       8      9
            // ["CAT", "RA", "DEC", "TYPE", "CON", "BMAG", "DST", "NAME", "INFO", "SIZE"]
            var catname = target[0];    // CAT
            var extname = target[7];    // NAME
            var dispname;
            if (extname != "") {
                dispname = catname + ', ' + extname;
            } else {
                dispname = catname;
            }
            if (target.length > 9) {
                var size = target[9];
            } else {
                var size = 0;
            }
            return {
                name: dispname,
                wikiname: catname,
                info: {
                    radec: target[1].toFixed(5) + ' ' + target[2].toFixed(5),
                    type: target[3],
                    constellation: target[4],
                    mag: target[5],
                    size: size,
                    distance: target[6],
                    notes: target[8]
                }
            };
        }

        function addJsonToAladinCatalog(cat) {
            cat.AladinCatalog = A.catalog({ name: cat.name, labelColumn: 'name', displayLabel: true, labelColor: cat.color, labelFont: '12px sans-serif' });
            cat.AladinCatalog.hide();

            for (var i = 0; i < cat.targets.length; i++) {
                if (i == 0) {
                    console.log("addJsonToAladinCatalog:add", cat.targets[i], name);
                }
                cat.AladinCatalog.addSources(
                    A.source(
                        cat.targets[i][1] * hoursToDeg,
                        cat.targets[i][2],
                        catalogToDataObject(cat.targets[i])));
            }
        }

        function processJsonCatalog(cat, json) {
            console.log("Create " + cat.name + " catalog");

            cat.targets = json.data;

            addJsonToAladinCatalog(cat);
        }

        function loadCatalog(cat) {
            console.log("Load catalog " + cat.name + " from " + cat.url);

            fetch(cat.url)
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Problem accessing catalog ' + cat.name + '. Status Code: ' + response.status);
                            return;
                        }
                        response.json().then(function (jsonData) {
                            processJsonCatalog(cat, jsonData);
                            update_catalog_list();
                        })
                    }
                )
                .catch(function (err) {
                    console.log('Problem accessing catalog ' + cat.name + '. Fetch Error :', err);
                }
                );
        }

        function load_and_init_catalogs() {
            if (url_view != "all") {
                return;
            }
            if (!A) {
                console.log("load_and_init_catalogs:Aladin not available");
                return;
            }

            console.log("load_and_init_catalogs");

            for (var i = 0; i < catalogs.length; i++) {
                if (catalogs[i].targets == null) {
                    loadCatalog(catalogs[i]);
                }
            }
        }

        // create select object
        function create_catalog_select_list(name, list) {
            console.log("create_catalog_select_list");

            var x = document.createElement("SELECT");
            x.setAttribute("id", name);

            for (var i = 0; i < list.length; i++) {
                if (i == 1) {
                    console.log("list[", i, "]", list[i]);
                }
                var y = document.createElement("option");
                y.setAttribute("value", list[i][0]);
                var t = document.createTextNode(list[i][1]);
                y.appendChild(t);
                x.appendChild(y);
            }
            return x;
        }

        // create list filtered by visibility during the night
        function filter_visible_catalog_items(cat, lat, lng) {
            var midnight;
            var aa1;
            var aa2;
            var aa3;
            var aa4;
            var aa5;
            var moonFilter = catalogFilterMoon;
            var filtered = false;

            if (cat == null || cat.targets == null) {
                console.log("filter_visible_catalog_items:cat == null or cat.targets == null");
                return { list: [['', '', null, 0]], filtered: false };
            }

            if (catalog_filter_time == null) {
                console.log("filter_visible_catalog_items:use whole night");
                var midday = viewer_params.UTCdate_ms + day_ms / 2;
                var suntimes = engine_native_resources.sun_rise_set(midday, lat, lng, 0);
                midnight = suntimes.sunset + (suntimes.sunrise - suntimes.sunset) / 2 + viewer_params.timezoneOffset * 60 * 60 * 1000;
            } else {
                midnight = viewer_params.UTCdate_ms + catalog_filter_time + viewer_params.timezoneOffset * 60 * 60 * 1000;
            }
            var fl = [];
            fl[fl.length] = ['', ''];

            // if object altitude is above catalogFilterDegrees degrees in any of the following
            // points during the night we add it to list
            aa1 = engine_native_resources.object_altitude_init(midnight, lat, lng);
            var thisfilterdate = new Date(midnight);
            console.log("filter date 1:", thisfilterdate.toUTCString());
            var moonpos = engine_native_resources.moon_position(midnight);
            // Check moon altitude at given time. If it is below horizon we do not filter with moon.
            var moonalt = engine_native_resources.object_altaz(midnight, moonpos.ra, moonpos.dec, lat, lng).alt;
            moonalt = engine_native_resources.moon_topocentric_correction(moonalt);
            if (moonalt < 0) {
                moonFilter = null;
            }
            if (catalog_filter_time == null) {
                // no time filter, use also times 2 and 4 hours before and after midnight
                var d = midnight + 2 * hour_ms;
                aa2 = engine_native_resources.object_altitude_init(d, lat, lng);
                thisfilterdate = new Date(d);
                moonalt = engine_native_resources.object_altaz(d, moonpos.ra, moonpos.dec, lat, lng).alt;
                moonalt = engine_native_resources.moon_topocentric_correction(moonalt);
                if (moonalt < 0) {
                    moonFilter = null;
                }
                console.log("filter date 2:", thisfilterdate.toUTCString());
                d = midnight - 2 * hour_ms;
                aa3 = engine_native_resources.object_altitude_init(d, lat, lng);
                thisfilterdate = new Date(d);
                // check moon altitude at this time
                moonalt = engine_native_resources.object_altaz(d, moonpos.ra, moonpos.dec, lat, lng).alt;
                moonalt = engine_native_resources.moon_topocentric_correction(moonalt);
                if (moonalt < 0) {
                    moonFilter = null;
                }
                console.log("filter date 3:", thisfilterdate.toUTCString());
                var d = midnight + 4 * hour_ms;
                aa4 = engine_native_resources.object_altitude_init(d, lat, lng);
                thisfilterdate = new Date(d);
                moonalt = engine_native_resources.object_altaz(d, moonpos.ra, moonpos.dec, lat, lng).alt;
                moonalt = engine_native_resources.moon_topocentric_correction(moonalt);
                if (moonalt < 0) {
                    moonFilter = null;
                }
                console.log("filter date 4:", thisfilterdate.toUTCString());
                d = midnight - 4 * hour_ms;
                aa5 = engine_native_resources.object_altitude_init(d, lat, lng);
                thisfilterdate = new Date(d);
                moonalt = engine_native_resources.object_altaz(d, moonpos.ra, moonpos.dec, lat, lng).alt;
                moonalt = engine_native_resources.moon_topocentric_correction(moonalt);
                if (moonalt < 0) {
                    moonFilter = null;
                }
                console.log("filter date 5:", thisfilterdate.toUTCString());
            }
            for (var i = 0; i < cat.targets.length; i++) {
                //   0      1     2      3       4      5       6      7       8
                // ["CAT", "RA", "DEC", "TYPE", "CON", "BMAG", "DST", "NAME", "INFO", "SIZE"]
                var ra = cat.targets[i][1] * hoursToDeg;
                var dec = cat.targets[i][2];
                var alt = 0;
                var addToList = false;
                if (catalogFilterDegrees != null) {
                    alt = engine_native_resources.object_altitude_get(aa1, ra, dec);
                    if (catalog_filter_time == null) {
                        // no time filter, use also times 2 and 4 hours before and after midnight
                        if (alt < catalogFilterDegrees) {
                            alt = engine_native_resources.object_altitude_get(aa2, ra, dec);
                        }
                        if (alt < catalogFilterDegrees) {
                            alt = engine_native_resources.object_altitude_get(aa3, ra, dec);
                        }
                        if (alt < catalogFilterDegrees) {
                            alt = engine_native_resources.object_altitude_get(aa4, ra, dec);
                        }
                        if (alt < catalogFilterDegrees) {
                            alt = engine_native_resources.object_altitude_get(aa5, ra, dec);
                        }
                    }
                }
                if (catalogFilterDegrees == null || alt >= catalogFilterDegrees) {
                    // we passed altitude filter
                    addToList = true;
                    if (moonFilter != null) {
                        // check for distance from moon
                        var moon_angle = engine_native_resources.moon_distance(ra, dec, moonpos.ra, moonpos.dec);
                        if (moon_angle < moonFilter) {
                            addToList = false;
                        }
                    }
                }
                
                if (addToList) {
                    //   0      1     2      3       4      5       6      7       8
                    // ["CAT", "RA", "DEC", "TYPE", "CON", "BMAG", "DST", "NAME", "INFO", "SIZE"]
                    // -> RA DEC, CAT+NAME+TYPE
                    var name = cat.targets[i][0];                   // CAT
                    if (cat.targets[i][7] != "") {
                        name = name + ', ' + cat.targets[i][7];     // NAME
                    }
                    if (cat.targets[i][3] != "") {
                        name = name + ', ' + cat.targets[i][3];     // TYPE
                    }
                    fl[fl.length] = [
                        cat.targets[i][1].toFixed(5) + ' ' + cat.targets[i][2].toFixed(5),     // 0 RA DEC
                        name,                                                                   // 1 name
                        cat.targets[i],                                                         // 2 catalog info
                        alt                                                                     // 3 altitude
                    ];
                } else {
                    filtered = true;
                }
            }
            if (fl.length > 0 && catalogFilterDegrees != null && document.getElementById("catalogSortCheckbox")) {
                // sort list based on altitude
                fl.sort(function (a, b) { return b[3] - a[3] });
            }
            return { list: fl, filtered: filtered };
        }

        function init_catalog_view_list() {
            if (url_view != "all") {
                return;
            }
            if (!catalog_filters_changed) {
                console.log("init_catalog_view_list:no change");
                return;
            }

            console.log("init_catalog_view_list", current_catalog.name);

            
            catalog_index = null;

            if (catalogDiv_select != null) {
                // remove old list
                console.log("init_catalog_view_list:remove old select list");
                document.getElementById("catalogDiv").removeChild(catalogDiv_select);
                document.getElementById("catalogDiv").removeChild(catalog_text);
            }

            current_catalog_filtered_list = filter_visible_catalog_items(current_catalog, viewer_params.location_lat, viewer_params.location_lng);
            if (current_catalog_filtered_list != null) {

                console.log("init_catalog_view_list:filtered list");

                catalogDiv_select = create_catalog_select_list('catalogDiv_select', current_catalog_filtered_list.list);
                catalogDiv_select.onchange = function () {
                    // Get coordinates from catalogDiv_select.value and put them
                    // to target box so we will show the target
                    console.log("init_catalog_view_list:onchange set target=" + catalogDiv_select.value);
                    document.getElementById("target").value = catalogDiv_select.value;
                    catalog_index = catalogDiv_select.selectedIndex;
                    if (catalog_index == 0) {
                        catalog_index = null;
                    }
                    ViewImage(0);
                };

                document.getElementById("catalogDiv").appendChild(catalogDiv_select);

                if (current_catalog.targets == null) {
                    catalog_text = document.createTextNode(' 0/0');
                } else {
                    catalog_text = document.createTextNode(' ' + (current_catalog_filtered_list.list.length - 1).toString() +
                        '/' + current_catalog.targets.length.toString());
                }
                document.getElementById("catalogDiv").appendChild(catalog_text);

                catalog_filters_changed = false;

                if (current_catalog_filtered_list.filtered) {
                    catalogDiv_select.selectedIndex = 1;
                    console.log("init_catalog_view_list:initial set target=" + current_catalog_filtered_list.list[1][0]);
                    document.getElementById("target").value = current_catalog_filtered_list.list[1][0];
                    ViewImage(0);
                }
            }
        }

        function checkFilterChanged() {
            if (url_view != "all") {
                return;
            }
            var ret = false;
            var newcatalog = document.getElementById("catalog-selection").value;
            var newvalue = document.getElementById("catalogFilterDegrees").value;
            var newfilter;
            if (current_catalog.name != newcatalog) {
                console.log("checkFilterChanged:catalog changed to", newcatalog);
                for (var i = 0; i < catalogs.length; i++) {
                    if (catalogs[i].name == newcatalog) {
                        current_catalog = catalogs[i];
                    }
                }
                ret = true;
            }
            if (newvalue == 'all') {
                newfilter = null;
            } else {
                newfilter = parseInt(newvalue);
            }
            if (catalogFilterDegrees != newfilter) {
                catalogFilterDegrees = newfilter;
                console.log("checkFilterChanged:catalogFilterDegrees", catalogFilterDegrees);
                ret = true;
            }
            newvalue = document.getElementById("catalogFilterMoon").value;
            if (newvalue == 'all') {
                newfilter = null;
            } else {
                newfilter = parseInt(newvalue);
            }
            if (catalogFilterMoon != newfilter) {
                catalogFilterMoon = newfilter;
                console.log("checkFilterChanged:catalogFilterMoon", catalogFilterMoon);
                ret = true;
            }
            if (ret) {
                catalog_reset();
            }
            return ret;
        }

        function filterChanged() {
            console.log("checkFifilterChanged");
            if (checkFilterChanged()) {
                ViewImage(0);
            }
        }

        function checkFilterTimeChanged() {
            if (url_view != "all") {
                return;
            }
            var newvalue = document.getElementById("catalogFilterTime").value;
            var UTCtime_ms;
            console.log("checkFilterTimeChanged, time value", newvalue);
            if (newvalue == '') {
                UTCtime_ms = null;
                console.log("checkFilterTimeChanged, no time given");
            } else {
                var hhmm = newvalue.split(':');
                if (hhmm.length != 2) {
                    document.getElementById(viewer_panels.error_text).innerHTML = build_error_text("Invalid ISO format time (HH:MM)");
                    return;
                }
                UTCtime_ms = (parseInt(hhmm[0]) * 60 * 60 + parseInt(hhmm[1]) * 60) * 1000;
                if (UTCtime_ms == null) {
                    document.getElementById(viewer_panels.error_text).innerHTML = build_error_text("Invalid ISO format time (HH:MM)");
                    return;
                }
                console.log("checkFilterTimeChanged, time ", UTCtime_ms);
            }
            if (catalog_filter_time != UTCtime_ms) {
                // time changed, reset view list
                console.log("checkFilterTimeChanged, time changed, reset catalog view");
                catalog_filter_time = UTCtime_ms;
                catalog_reset();
                return true;
            } else {
                return false;
            }
        }

        function filterTimeChanged() {
            console.log("filterTimeChanged");
            if (checkFilterTimeChanged()) {
                ViewImage(0);
            }
        }

        function catalog_reset() {
            catalog_filters_changed = true;
            catalog_index = null;

            
        }

      
        
        function charIsNumber(c) {
            return c >= '0' && c <= '9';
        }

        function reformatCheckName(target, prefix, name) {
            var c = target.substr(0, prefix.length).toUpperCase();
            var cn = target.substr(prefix.length, 1);
            if (c == prefix.toUpperCase() && cn == '-') {
                return name + target.substr(prefix.length);
            } else if (c == prefix.toUpperCase() && (cn == ' ' || charIsNumber(cn))) {
                return name + ' ' + target.substr(prefix.length);
            } else {
                return null;
            }

        }

        // reformat target name so it is more likely found from Wikipedia
        function reformatTargetName(name) {
            var newname = reformatCheckName(name, 'M', 'Messier');
            if (newname == null) {
                // ensure correct case
                newname = reformatCheckName(name, 'Messier', 'Messier');
            }
            if (newname == null) {
                newname = reformatCheckName(name, 'NGC', 'NGC');
            }
            if (newname == null) {
                newname = reformatCheckName(name, 'IC', 'IC');
            }
            if (newname == null) {
                newname = reformatCheckName(name, 'SH2', 'Sh2');
            }
            if (newname == null) {
                newname = reformatCheckName(name, 'B', 'Barnard');
            }
            if (newname == null) {
                newname = reformatCheckName(name, 'Ced', 'Cederblad');
            }
            if (newname == null) {
                newname = name;
            }
            newname = trim_spaces(newname);
            console.log("reformatTargetName", name, newname);

            return newname;
        }

        function aladinObjectHovered(data) {
            var txt = null;
            if (data.name != undefined) {
                txt = data.name;
                if (data.info != undefined) {
                    txt += ', Type: ' + data.info.type;
                    txt += ', RA/DEC: ' + data.info.radec;
                    if (data.info.constellation != '') {
                        txt += ', Constellation: ' + data.info.constellation;
                    }
                    if (data.info.mag != 0) {
                        txt += ', Magnitude: ' + data.info.mag;
                    }
                    if (data.info.size) {
                        txt += ', Size: ' + data.info.size;
                    }
                    if (data.info.distance != 0) {
                        txt += ', Distance (Mly): ' + data.info.distance;
                    }
                    if (data.info.notes != '') {
                        txt += ', Notes: ' + data.info.notes;
                    }
                }
            } else if (data.MAIN_ID != undefined) {
                txt = data.MAIN_ID;
                txt += ', RA/DEC: ' + data.RA + " / " + data.DEC;
            }

            if (txt) {
                document.getElementById(viewer_panels.startup_info_text).innerHTML = txt;
            }
        }

        function aladinObjectClicked(data) {
            if (data.wikiname != undefined) {
                showWikiTargetOrAlt(data.wikiname, data);
            } else if (data.MAIN_ID != undefined || data.pathinfo != undefined) {
                wikiReset();
                noWikiAvailableShowText(data, null);
            }
        }

        function getLocation(position_callback) {
            if (navigator.geolocation) {
                console.log("call navigator.geolocation.getCurrentPosition");
                navigator.geolocation.getCurrentPosition(position_callback);
            } else {
                console.log("Geolocation is not supported by this browser");
                document.getElementById(error_text).innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function getOwnTelescopeLocation() {
            getLocation(setOwnTelescopePosition);
        }

        function setOwnTelescopePosition(position) {
            console.log("setOwnTelescopePosition", position.coords.latitude.toString(), position.coords.longitude.toString());
            document.getElementById("LatField").value = position.coords.latitude.toString();
            document.getElementById("LngField").value = position.coords.longitude.toString();
        }

        function getCurrentTelescopeLocation() {
            getLocation(setCurrentTelescopePosition);
        }

        function setAllUnknownTelescopeLocations(lat, lng) {
            for (var i = 0; i < telescope_services.length; i++) {
                for (var j = 0; j < all_services.telescope_services[i].telescopes.length; j++) {
                    if (all_services.telescope_services[i].telescopes[j].lat == null ||
                        (all_services.telescope_services[i].telescopes[j].lat == 0 && all_services.telescope_services[i].telescopes[j].lng == 0)) {
                        console.log("setCurrentTelescopePosition", all_services.telescope_services[i].telescopes[j].name, "set to", lat.toString(), lng.toString(), "from geolocation");
                        all_services.telescope_services[i].telescopes[j].lat = lat;
                        all_services.telescope_services[i].telescopes[j].lng = lng;
                    }
                }
            }
        }

        function setCurrentTelescopePosition(position) {
            console.log("setCurrentTelescopePosition", position.coords.latitude.toString(), position.coords.longitude.toString());
            setAllUnknownTelescopeLocations(position.coords.latitude, position.coords.longitude);
            ViewImage(0);
        }

