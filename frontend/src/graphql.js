import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const typeDefs = gql`
  type Authentication {
    address: String!
    isLandlord: Boolean!
  }

  type Room {
    id: ID!
    internalName: String!
    area: Float!
    location: String!
    contractAddress: String
    publicName: String
  }

  input InputRoom {
    internalName: String!
    area: Float!
    location: String!
  }

  type Ticket {
    id: ID!
    room: Room!
    value: Wei!
    deadline: Datetime!
    nonce: Nonce!
    cashierSignature: Signature!
  }

  input InputTicket {
    room: ID!
    nonce: InputNonce!
    value: InputWei!
    deadline: InputDatetime!
    cashierSignature: InputSignature!
  }

  type Signature {
    v: String!
    r: String!
    s: String!
  }

  input InputSignature {
    v: String!
    r: String!
    s: String!
  }

  type Wei {
    wei: String!
  }

  input InputWei {
    wei: String!
  }

  type Datetime {
    datetime: String!
  }

  input InputDatetime {
    datetime: String!
  }

  type Nonce {
    value: String!
  }

  input InputNonce {
    value: String!
  }
`;

export const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
  typeDefs,
});

export const AUTHENTICATION = gql`
  query Authentication {
    authentication {
      address
      isLandlord
    }
  }
`;

export const REQUEST_AUTHENTICATION = gql`
  mutation RequestAuthentication($address: String!) {
    message: requestAuthentication(address: $address)
  }
`;

export const AUTHENTICATE = gql`
  mutation Authenticate($address: String!, $signedMessage: InputSignature!) {
    authenticate(address: $address, signedMessage: $signedMessage) {
      address
      isLandlord
    }
  }
`;

export const CREATE_ROOM = gql`
  mutation CreateRoom($room: InputRoom!) {
    createRoom(room: $room) {
      id
      internalName
      area
      location
    }
  }
`;

export const EDIT_ROOM = gql`
  mutation EditRoom($id: ID!, $room: InputRoom!) {
    editRoom(id: $id, room: $room) {
      id
      internalName
      area
      location
    }
  }
`;

export const ROOM = gql`
  query Room($id: ID!) {
    room(id: $id) {
      internalName
      area
      location
      publicName
      contractAddress
    }
  }
`;

export const ROOMS = gql`
  query Rooms {
    rooms {
      id
      publicName
      internalName
      contractAddress
    }
  }
`;

export const SET_ROOM_CONTRACT_ADDRESS = gql`
  mutation SetRoomContractAddress($id: ID!, $contractAddress: String!) {
    setRoomContractAddress(id: $id, contractAddress: $contractAddress) {
      id
      publicName
      internalName
      contractAddress
    }
  }
`;

export const REMOVE_ROOM = gql`
  mutation RemoveRoom($id: ID!) {
    removeRoom(id: $id) {
      id
      internalName
      area
      location
    }
  }
`;

export const SET_ROOM_PUBLICNAME = gql`
  mutation SetRoomPublicName($id: ID!, $publicName: String) {
    setRoomPublicName(id: $id, publicName: $publicName) {
      id
      internalName
      area
      location
    }
  }
`;

export const TICKET = gql`
  query Ticket($id: ID!) {
    ticket(id: $id) {
      room {
        internalName
        publicName
        contractAddress
      }
      value {
        wei
      }
      deadline {
        datetime
      }
      nonce {
        value
      }
      cashierSignature {
        v
        r
        s
      }
    }
  }
`;
