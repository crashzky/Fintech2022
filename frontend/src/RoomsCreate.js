import { useQuery } from "@apollo/client";
import { useState } from "react";
import { AUTHENTICATION, CREATE_ROOM, client } from "./graphql";
import { useHistory } from "react-router-dom";

export default function RoomsCreate() {
  const { loading, data } = useQuery(AUTHENTICATION);
  const [internalName, setInternalName] = useState();
  const [area, setArea] = useState();
  const [location, setLocation] = useState();
  const history = useHistory();

  if (loading) return "";
  if (!data) return "";
  if (!data.authentication) return "";

  const { address, isLandlord } = data.authentication;
  if (!isLandlord) return "";

  function handleInternalName(e) {
    setInternalName(e.target.value);
  }

  function handleArea(e) {
    setArea(parseFloat(e.target.value));
  }

  function handleLocation(e) {
    setLocation(e.target.value);
  }

  async function onClick(e) {
    e.preventDefault();
    const response = await client.mutate({
      mutation: CREATE_ROOM,
      variables: {
        room: { internalName, area, location },
      },
    });
    const room_id = response.data.createRoom.id;
    history.push(`/room/${room_id}`);
  }

  return (
    <form className="room-form">
      <input
        className="room-form__internal-name"
        type="text"
        value={internalName}
        onChange={handleInternalName}
        required
      ></input>
      <input
        className="room-form__area"
        type="number"
        value={area}
        onChange={handleArea}
        required
      ></input>
      <input
        className="room-form__location"
        type="text"
        value={location}
        onChange={handleLocation}
        required
      ></input>
      <button className="room-form__submit" type="submit" onClick={onClick}>
        Submit
      </button>
    </form>
  );
}
