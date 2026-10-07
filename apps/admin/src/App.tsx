import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CollectionCreatePage } from "./pages/CollectionCreatePage.js";
import { CollectionRecordsPage } from "./pages/CollectionRecordsPage.js";
import { CollectionsPage } from "./pages/CollectionsPage.js";

export function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <header>
          <h2>JodKit Admin</h2>
          <p className="muted">Metadata-driven shell (playground API)</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CollectionsPage />} />
            <Route path="/collections/:slug" element={<CollectionRecordsPage />} />
            <Route path="/collections/:slug/new" element={<CollectionCreatePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
