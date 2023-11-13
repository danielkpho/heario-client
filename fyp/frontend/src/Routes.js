import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby";
import MyPage from "./pages/MyPage";
import Game from "./pages/Game";

export const Paths = () => {
    return (
        <Router>
            <Routes>
                <Route path="/lobby" element={<Lobby />}>
                </Route>
                <Route path="/about" element={<MyPage />}>
                </Route>
                <Route path="/game" element={<Game />}>
                </Route>
            </Routes>
        </Router>
    )
}