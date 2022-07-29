import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useQuery } from "@apollo/client";

import {
  AUTHENTICATION,
  REQUEST_AUTHENTICATION,
  AUTHENTICATE,
  client,
} from "./graphql";

function Auth() {
  const [text, setText] = useState("Authenticate");
  const [provider, setProvider] = useState();
  const [address, setAddress] = useState();
  const [authenticated, setAuthenticated] = useState(false);
  const { loading, data } = useQuery(AUTHENTICATION);

  async function fetchProvider() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
  }

  async function authenticate() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
    setText("Waiting");
    const response = await client.mutate({
      mutation: REQUEST_AUTHENTICATION,
      variables: {
        address,
      },
    });
    const message = response.data.message;
    const signature = await signer.signMessage(message);
    console.log(signature);
    const r = signature.substr(0, 66);
    const s = "0x" + signature.substr(66, 64);
    const v = "0x" + signature.substr(130, 2);
    await client.mutate({
      mutation: AUTHENTICATE,
      variables: {
        address,
        signedMessage: {
          r,
          s,
          v,
        },
      },
    });
    setAuthenticated(true);
  }

  useEffect(() => {
    fetchProvider();
  }, []);

  if (!provider) return "";
  if (loading) return "loading (graphql)";

  console.log(data);

  if (!authenticated) {
    if (
      address &&
      data &&
      data.authentication &&
      data.authentication.address !== address
    ) {
      return (
        <>
          <button
            className="authentication__authenticate"
            onClick={authenticate}
          >
            {text}{" "}
          </button>{" "}
          <p className="authentication__warning">
            Your MetaMask account is different from the one you authenticated
            with before{" "}
          </p>{" "}
        </>
      );
    } else {
      return (
        <>
          RPC URL:
          <p> {process.env.REACT_APP_RPC_URL} </p>
          Data:
          <p> {JSON.stringify(data)} </p>
          Cookie:
          <p> {document.cookie} </p>
          Current address:
          <p> {address ? address : "none"} </p>
          Authorized address:
          <p>
            {" "}
            {data && data.authentication
              ? data.authentication.address
              : "none"}{" "}
          </p>{" "}
          <button
            className="authentication__authenticate"
            onClick={authenticate}
          >
            {text}{" "}
          </button>{" "}
        </>
      );
    }
  } else {
    return (
      <>
        address: <p className="account__address"> {address} </p>{" "}
      </>
    );
  }
}

export default Auth;
