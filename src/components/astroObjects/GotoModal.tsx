import type { Dispatch, SetStateAction } from "react";
import SlidingPane from "react-sliding-pane";
import { AstroObject } from "@/types";

type PropTypes = {
  object: AstroObject;
  messages: { [k: string]: any }[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};
type Message = {
  [k: string]: string;
};
export default function GotoModal(props: PropTypes) {
  const { showModal, setShowModal, object, messages, setMessages } = props;

  return (
    <div>
      <SlidingPane
        className="some-custom-class"
        overlayClassName="some-custom-overlay-class"
        isOpen={showModal}
        title={object.displayName}
        from="right"
        width="26%"
        onRequestClose={() => {
          // triggered on "<" on left top click or on outside click
          setShowModal(false);
          setMessages([] as Message[]);
        }}
      >
        <div className="mb-3">
          RA: {object.ra}, Dec: {object.dec}
        </div>

        <h4>Messages</h4>
        <div>
          <pre>{JSON.stringify(messages, null, 2)}</pre>
        </div>
      </SlidingPane>
    </div>
  );
}
