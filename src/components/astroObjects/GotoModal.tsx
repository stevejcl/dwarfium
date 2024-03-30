import type { Dispatch, SetStateAction } from "react";
import Modal from "react-bootstrap/Modal";

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

  function handleCloseModal() {
    setShowModal(false);
    setMessages([] as Message[]);
  }

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{object.displayName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3-modal">
          RA: {object.ra}, Dec: {object.dec}
        </div>

        <h4>Messages</h4>
        <div>
          <pre>{JSON.stringify(messages, null, 2)}</pre>
        </div>
      </Modal.Body>
    </Modal>
  );
}
