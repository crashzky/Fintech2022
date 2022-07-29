import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Auth from "./Auth";
import Rooms from "./Rooms";
import RoomsCreate from "./RoomsCreate";
import RoomDetails from "./RoomDetails";
import RoomEdit from "./RoomEdit";
import Cashiers from "./Cashiers";
import Ticket from "./Ticket";

export default function App() {
  return (
    <Router forceRefresh={true}>
      <Switch>
        <Route path="/ticket/:ticketId">
          <Ticket />
        </Route>{" "}
        <Route path="/room/:roomId/cashiers">
          <Cashiers />
        </Route>{" "}
        <Route path="/room/:roomId/edit">
          <RoomEdit />
        </Route>{" "}
        <Route path="/room/:roomId">
          <RoomDetails />
        </Route>{" "}
        <Route path="/rooms/create">
          <RoomsCreate />
        </Route>{" "}
        <Route path="/rooms">
          <Rooms />
        </Route>{" "}
        <Route path="/">
          <Auth />
        </Route>{" "}
      </Switch>{" "}
    </Router>
  );
}
