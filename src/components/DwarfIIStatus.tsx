import { useState, useContext, useEffect } from "react";

import {
  Dwarfii_Api,
  messageCameraTeleGetAllFeatureParams,
  messageCameraTeleGetAllParams,
  WebSocketHandler,
} from "dwarfii_api";

import { ConnectionContext } from "@/stores/ConnectionContext";

export default function DwarfIIStatus() {
  let connectionCtx = useContext(ConnectionContext);

  const [cameraSettingsData, setCameraStatusData] = useState<any>(null);
  const [shotFieldData, setShotFieldData] = useState<any>(null);

  const getCameraStatus = () => {
    setCameraStatusData({});
    {
      if (connectionCtx.IPDwarf === undefined) {
        return;
      }

      const customMessageHandler = (txt_info, result_data) => {
        if (
          result_data.cmd == Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS
        ) {
          if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
            setCameraStatusData(result_data.data);
            return;
          }
        }
      };

      console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
      const webSocketHandler = connectionCtx.socketIPDwarf
        ? connectionCtx.socketIPDwarf
        : new WebSocketHandler(connectionCtx.IPDwarf);

      // Send Command : messageCameraTeleGetAllFeatureParams
      let WS_Packet = messageCameraTeleGetAllParams();
      let txtInfoCommand = "DwarfStatus2";

      webSocketHandler.prepare(
        WS_Packet,
        txtInfoCommand,
        [Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_PARAMS],
        customMessageHandler
      );

      if (!webSocketHandler.run()) {
        console.error(" Can't launch Web Socket Run Action!");
      }
    }
  };

  const getShotField = () => {
    setShotFieldData({});
    {
      if (connectionCtx.IPDwarf === undefined) {
        return;
      }

      const customMessageHandler = (txt_info, result_data) => {
        if (
          result_data.cmd ==
          Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_FEATURE_PARAMS
        ) {
          if (result_data.data.code == Dwarfii_Api.DwarfErrorCode.OK) {
            /*
            let count = 0;
            let binning = "4k";
            let fileFormat = "FITS" ;
            if (result_data.allFeatureParams) {
              // For i=0 : "Astro binning"
              const filteredArray = result_data.data.allFeatureParams.filter(item => !item.hasOwnProperty('id') || item.id === undefined);
              ; // 4k
              if (filteredArray.index)
                binning = "2k"; 
              // For i=1 : "Astro img_to_take"
              const resultObject1 = result_data.data.allFeatureParams.find(item => item.id === 1);
              count = 0 
              if (resultObject1.index)
                count = resultObject1.index; 
              // For i=2 : Astro Format
              const resultObject2 = result_data.data.allFeatureParams.find(item => item.id === 2);
              let fileFormat = "FITS" // 4k
              if (resultObject2.index)
                fileFormat = "TIFF"; 
            }
*/
            setShotFieldData(result_data.data);
            return;
          }
        }
      };

      console.log("socketIPDwarf: ", connectionCtx.socketIPDwarf); // Create WebSocketHandler if need
      const webSocketHandler = connectionCtx.socketIPDwarf
        ? connectionCtx.socketIPDwarf
        : new WebSocketHandler(connectionCtx.IPDwarf);

      // Send Command : messageCameraTeleGetAllFeatureParams
      let WS_Packet = messageCameraTeleGetAllFeatureParams();
      let txtInfoCommand = "DwarfStatus";

      webSocketHandler.prepare(
        WS_Packet,
        txtInfoCommand,
        [Dwarfii_Api.DwarfCMD.CMD_CAMERA_TELE_GET_ALL_FEATURE_PARAMS],
        customMessageHandler
      );

      if (!webSocketHandler.run()) {
        console.error(" Can't launch Web Socket Run Action!");
      }
    }
  };

  useEffect(() => {
    {
      getCameraStatus();
      /*
    setTimeout(() => {
      getShotField();
    }, 1000);
*/
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <h2>ISP Parameters - Telephoto</h2>
      {cameraSettingsData && (
        <pre>{JSON.stringify(cameraSettingsData, null, 2)}</pre>
      )}
      <h2>Shot Field - Telephoto</h2>
      {shotFieldData && <pre>{JSON.stringify(shotFieldData, null, 2)}</pre>}
      <button
        className=" btn btn-primary mb-3"
        onClick={() => {
          getCameraStatus();
          setTimeout(() => {
            getShotField();
          }, 1000);
        }}
      >
        Refresh
      </button>
    </>
  );
}
