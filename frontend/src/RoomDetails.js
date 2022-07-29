import { NavLink, useParams, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
  ROOM,
  AUTHENTICATION,
  SET_ROOM_CONTRACT_ADDRESS,
  client,
} from "./graphql";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { RentalAgreement } from "./contract";
import { formatTime, formatDuration } from "./utils";

export default function RoomDetails() {
  const { roomId } = useParams();
  const { loading, data } = useQuery(ROOM, {
    variables: { id: roomId },
  });
  const { loading: loadingAuth, data: auth } = useQuery(AUTHENTICATION);
  const [isLandlord, setIsLandlord] = useState(false);
  const [address, setAddress] = useState();
  const history = useHistory();

  const [state, setState] = useState({});
  const [status, setStatus] = useState("script loaded");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    console.log(loadingAuth, auth);
    if (loadingAuth) return;
    if (!auth) return;
    if (!auth.authentication) return;
    setIsLandlord(auth.authentication.isLandlord);
    setAddress(auth.authentication.address);
  }, [loadingAuth, auth]);

  async function fetchState() {
    if (loading) return;
    if (!data) return;
    if (!data.room) return;
    let stateNew = {};
    console.log(loading);
    console.log(data);
    if (data.room.publicName) {
      stateNew.name = data.room.publicName;
      stateNew.internalName = data.room.internalName;
    } else {
      stateNew.name = data.room.internalName;
    }
    setStatus("name set");
    stateNew.area = data.room.area;
    stateNew.location = data.room.location;
    setStatus("area and location set");
    if (!data.room.contractAddress) {
      stateNew.status = "Unavailable for renting";
    } else {
      stateNew.contractAddress = data.room.contractAddress;
      setStatus("contract found");
      const contract = new ethers.Contract(
        data.room.contractAddress,
        RentalAgreement.abi,
        provider
      );
      setStatus("contract loaded");
      const tenant = await contract.getTenant();
      setStatus("tenant got");
      if (tenant !== ethers.constants.AddressZero) {
        stateNew.rentStart = await contract.getRentStartTime();
        stateNew.rentEnd = await contract.getRentEndTime();
        stateNew.billingPeriod = await contract.getBillingPeriodDuration();
        stateNew.tenant = tenant;
        stateNew.rentalRate = await contract.getRentalRate();
        stateNew.block = await provider.getBlock("latest");
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
      setStatus("additional info set");
    }
    setState(stateNew);
  }

  async function allowRenting(e) {
    e.preventDefault();
    const signer = provider.getSigner();
    const Contract = new ethers.ContractFactory(
      RentalAgreement.abi,
      RentalAgreement.bin,
      signer
    );
    const contract = await Contract.deploy(+roomId);
    await contract.deployed();
    await client.mutate({
      mutation: SET_ROOM_CONTRACT_ADDRESS,
      variables: {
        id: roomId,
        contractAddress: contract.address,
      },
    });
    history.push(`/room/${roomId}`);
  }

  useEffect(() => {
    fetchState();
  }, [loading, data]);

  if (loading) return <p>{status}</p>;
  if (loadingAuth) return <p>{status}</p>;
  if (!data) return <p>{status}</p>;
  if (!state) return <p>{status}</p>;

  console.log(state);

  return (
    <>
      <p>{status}</p>
      <p>{JSON.stringify(state)}</p>
      {state.name ? <p className="room__name">{state.name}</p> : "not working"}
      {state.internalName ? (
        <p className="room__internal-name">{state.internalName}</p>
      ) : (
        ""
      )}
      {state.area ? <p className="room__area">{state.area} sq.m.</p> : ""}
      {state.location ? <p className="room__location">{state.location}</p> : ""}
      {state.contractAddress ? (
        <p className="room__contract-address">{state.contractAddress}</p>
      ) : (
        ""
      )}
      {state.status ? <p className="room__status">{state.status}</p> : ""}
      {state.tenant ? <p className="room__tenant">{state.tenant}</p> : ""}
      {state.rentStart ? (
        <p className="room__rent-start">
          {formatTime(state.rentStart.toNumber())}
        </p>
      ) : (
        ""
      )}
      {state.rentEnd ? (
        <p className="room__rent-end">{formatTime(state.rentEnd.toNumber())}</p>
      ) : (
        ""
      )}
      {state.billingPeriod ? (
        <p className="room__billing-period">
          {formatDuration(state.billingPeriod.toString())}
        </p>
      ) : (
        ""
      )}
      {state.rentalRate ? (
        <p className="room__rental-rate">{state.rentalRate.toNumber()} wei</p>
      ) : (
        ""
      )}
      {isLandlord ? (
        <NavLink className="room__edit" to={`/room/${roomId}/edit`}>
          Edit
        </NavLink>
      ) : (
        ""
      )}
      {isLandlord && !state.contractAddress ? (
        <button className="room__allow-renting" onClick={allowRenting}>
          Allow renting
        </button>
      ) : (
        ""
      )}
      {state.tenant && state.tenant === address ? (
        <NavLink
          className="room__manage-cashiers"
          to={`/room/${roomId}/cashiers`}
        >
          Cashiers
        </NavLink>
      ) : (
        ""
      )}
    </>
  );
}
