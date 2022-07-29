import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { AUTHENTICATION, EDIT_ROOM, ROOM, client } from "./graphql";
import { useHistory, useParams } from "react-router-dom";

export default function RoomEdit() {
  const { roomId } = useParams();
  const { loading: loadingAuth, data: auth } = useQuery(AUTHENTICATION);
  const { loading: loadingRoom, data: room } = useQuery(ROOM, {
    variables: { id: roomId },
  });
  const [internalName, setInternalName] = useState();
  const [area, setArea] = useState();
  const [location, setLocation] = useState();
  const history = useHistory();

  const [isLandlord, setIsLandlord] = useState(false);

  useEffect(() => {
    if (loadingAuth) return;
    if (!auth) return;
    if (!auth.authentication) return;
    setIsLandlord(auth.authentication.isLandlord);
  }, [loadingAuth, auth]);

  useEffect(() => {
    if (loadingRoom) return;
    if (!room) return;
    if (!room.room) return;
    const { internalName, area, location } = room.room;
    setInternalName(internalName);
    setArea(area);
    setLocation(location);
  }, [loadingRoom, room]);

  if (loadingAuth) return "loading...";
  if (loadingRoom) return "loading...";

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
    await client.mutate({
      mutation: EDIT_ROOM,
      variables: {
        id: roomId,
        room: { internalName, area, location },
      },
    });
    history.push(`/room/${roomId}`);
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
