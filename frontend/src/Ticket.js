import { ethers } from "ethers";
import { RentalAgreement } from "./contract";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { TICKET } from "./graphql";
import { formatTime } from "./utils";

export default function Ticket() {
  const { ticketId } = useParams();
  const { loading, data } = useQuery(TICKET, {
    variables: {
      id: ticketId,
    },
  });

  const [state, setState] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [address, setAddress] = useState();

  useEffect(() => {
    if (loading) return;
    if (!data) return;
    const state = {};
    state.store = data.ticket.room.publicName
      ? data.ticket.room.publicName
      : data.ticket.room.internalName;
    state.value = ethers.BigNumber.from(data.ticket.value.wei);
    state.deadline = Math.floor(
      new Date(data.ticket.deadline.datetime).getTime() / 1000
    );
    state.nonce = ethers.BigNumber.from(data.ticket.nonce.value);
    state.signature = data.ticket.cashierSignature;
    setState(state);
  }, [loading, data]);

  async function fetchAvailableAddress() {
    const signer = provider.signer;
    const address = await signer.getAddress();
    setAddress(address);
  }

  useEffect(() => {
    fetchAvailableAddress();
  }, []);

  async function fetchMetamaskAddress() {
    await provider.send("eth_requestAccounts", []);
    await fetchAvailableAddress();
  }

  if (loading) return "loading...";
  if (!data) return "loading...";
  if (!state) return "loading...";

  async function pay() {
    const signer = provider.signer;
    const contract = new ethers.Contract(
      data.room.contractAddress,
      RentalAgreement.abi,
      signer
    );
    await contract.pay(
      state.deadline,
      state.nonce,
      state.value,
      state.signature,
      {
        value: state.value,
      }
    );
  }

  return (
    <>
      <p className="ticket__store">{state.store}</p>
      <p className="ticket__value">{state.value.toString()} wei</p>
      <p className="ticket__deadline">{formatTime(state.deadline)}</p>
      {!address ? (
        <button className="account__connect" onClick={fetchMetamaskAddress}>
          Connect
        </button>
      ) : (
        <p className="account__address">{address}</p>
      )}
      <button className="ticket__pay" onClick={pay}>
        Pay
      </button>
    </>
  );
}
