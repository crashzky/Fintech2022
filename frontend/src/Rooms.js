import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AUTHENTICATION, ROOMS } from "./graphql";
import { ethers } from "ethers";
import { RentalAgreement } from "./contract";

function RoomCard({ room }) {
  const [state, setState] = useState({});

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function fetchState() {
    let stateNew = {};
    if (room.publicName) {
      stateNew.name = room.publicName;
      stateNew.internalName = room.internalName;
    } else {
      stateNew.name = room.internalName;
    }
    if (!room.contractAddress) {
      stateNew.status = "Unavailable for renting";
    } else {
      stateNew.contractAddress = room.contractAddress;
      const contract = new ethers.Contract(
        room.contractAddress,
        RentalAgreement.abi,
        provider
      );
      const tenant = await contract.getTenant();
      if (tenant !== ethers.constants.AddressZero) {
        const isExpired = await contract.isExpired();
        const isPaid = await contract.isPaid();
        if (isExpired || !isPaid) {
          stateNew.status = "Rent ended";
        } else {
          stateNew.status = "Rented";
        }
      } else {
        stateNew.status = "Available for renting";
      }
    }
    setState(stateNew);
  }

  useEffect(() => {
    fetchState();
  }, [room]);

  return (
    <div id={`room-${room.id}`} className="room-card">
      <p className="room-card__name">{state.name}</p>
      <p className="room-card__status">{state.status}</p>
      <NavLink className="room-card__details" to={`/room/${room.id}`}>
        Details
      </NavLink>
    </div>
  );
}

export default function Rooms() {
  const { loading: loadingAuth, data: auth } = useQuery(AUTHENTICATION);
  const { loading: loadingRooms, data: rooms } = useQuery(ROOMS);

  const [isLandlord, setIsLandlord] = useState(false);
  const [roomsList, setRoomsList] = useState([]);

  useEffect(() => {
    console.log(loadingAuth, auth);
    if (loadingAuth) return;
    if (!auth) return;
    if (!auth.authentication) return;
    setIsLandlord(auth.authentication.isLandlord);
  }, [loadingAuth, auth]);

  useEffect(() => {
    if (loadingRooms) return;
    if (!rooms) return;
    if (!rooms.rooms) return;
    setRoomsList(rooms.rooms);
  }, [loadingRooms, rooms]);

  if (loadingAuth) return "loading...";
  if (loadingRooms) return "loading...";

  return (
    <>
      {isLandlord ? (
        <NavLink className="rooms__create" to="/rooms/create">
          Create room
        </NavLink>
      ) : (
        ""
      )}
      {roomsList
        ? roomsList.map((room) => (
            <RoomCard room={room} key={room.id.toString()} />
          ))
        : ""}
    </>
  );
}
