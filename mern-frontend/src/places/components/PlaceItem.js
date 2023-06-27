import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIComponents/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIComponents/Modal";
import Map from "../../shared/components/UIComponents/Map";
import "./PlaceItem.css";
import { AuthContext } from "../../shared/context/auth-context";

const PlaceItem = (props) => {
  const authContext = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWanrningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <Modal
        show={showMap}
        onCancel={() => setShowMap(false)}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={() => setShowMap(false)}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={confirmDeleteHandler}>
              Yes
            </Button>
            <Button danger onClick={cancelDeleteHandler}>
              No
            </Button>
          </>
        }
        show={showConfirmModal}
      >
        <p>Do you want to proceed deleting this place permanently?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={() => setShowMap(true)}>
              View on Map
            </Button>
            {authContext.isLoggedIn && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {authContext.isLoggedIn && (
              <Button danger onClick={showDeleteWanrningHandler}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
