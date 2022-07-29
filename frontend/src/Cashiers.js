import { useParams, useHistory } from "react-router-dom";
import { AUTHENTICATION, ROOM } from "./graphql";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { RentalAgreement } from "./contract";

export default function Cashiers() {
  const { roomId } = useParams();
  const history = useHistory();

  const { loading: loadingAuth, data: auth } = useQuery(AUTHENTICATION);
  const [address, setAddress] = useState(false);
  const [isTenant, setIsTenant] = useState(false);

  const [cashierForm, setCashierForm] = useState("");

  const { loading, data } = useQuery(ROOM, {
    variables: { id: roomId },
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [cashiersList, setCashiersList] = useState();

  useEffect(() => {
    console.log(loadingAuth, auth);
    if (loadingAuth) return;
    if (!auth) return;
    if (!auth.authentication) return;
    setAddress(auth.authentication.address);
  }, [loadingAuth, auth]);

  async function fetchState() {
    if (loading) return;
    if (loadingAuth) return;
    if (!data) return;
    if (!data.room) return;
    if (data.room.contractAddress === ethers.constants.AddressZero) return;
    const contract = new ethers.Contract(
      data.room.contractAddress,
      RentalAgreement.abi,
      provider
    );
    const tenant = await contract.getTenant();
    setIsTenant(tenant === address);
    const cashiersList = await contract.getCashiersList();
    setCashiersList(cashiersList);
  }

  useEffect(() => {
    fetchState();
  }, [loading, loadingAuth]);

  function handleChange(e) {
    setCashierForm(e.target.value);
  }

  async function addCashier(e) {
    e.preventDefault();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      data.room.contractAddress,
      RentalAgreement.abi,
      signer
    );
    await contract.addCashier(cashierForm);
    history.push(`/room/${roomId}/cashiers`);
  }

  const removeCashier = (cashierAddress) => async (e) => {
    e.preventDefault();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      data.room.contractAddress,
      RentalAgreement.abi,
      signer
    );
    await contract.removeCashier(cashierAddress);
    history.push(`/room/${roomId}/cashiers`);
  };

  if (loadingAuth) return "loading...";
  if (loading) return "loading...";

  return (
    <>
      {cashiersList ? (
        <ul className="cashiers">
          {cashiersList.map((cashier) => (
            <li>
              <p className="cashier__address">{cashier}</p>
              <button
                className="cashier__remove"
                onClick={removeCashier(cashier)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
      {isTenant ? (
        <form className="add-cashier">
          <input
            className="add-cashier__address"
            type="text"
            value={cashierForm}
            onChange={handleChange}
            required
          ></input>
          <button
            className="add-cashier__submit"
            type="submit"
            onClick={addCashier}
          >
            Add cashier
          </button>
        </form>
      ) : (
        ""
      )}
    </>
  );
}
