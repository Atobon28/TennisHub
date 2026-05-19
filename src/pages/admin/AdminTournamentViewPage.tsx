import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import {
  getAdminCourts,
  getTournaments,
  getTournamentRegistrations,
  updateTournament,
} from "../../firebase/services";
import { useAuth } from "../../context/useAuth";
import "../../styles/admin-tournament-view.css";
import court1 from "../../assets/court-1.jpg";

const categoryOptions = [
  "First Category",
  "Second Category",
  "Third Category",
  "Fourth Category",
  "Fifth Category",
  "Beginner",
  "Junior",
  "Senior",
];

interface CapacityByCategory {
  [category: string]: {
    singlesPlayers?: number;
    doublesPairs?: number;
  };
}

interface Tournament {
  id: string;
  name: string;
  info: string;
  date?: string;
  hour?: string;
  categories?: string[];
  courts?: string[];
  image?: string;
  tournamentType?: string;
  capacityByCategory?: CapacityByCategory;
  status?: "Open" | "Full" | "Closed";
}

interface Court {
  id: string;
  name: string;
}

interface TournamentRegistration {
  id: string;
  playerUsername?: string;
  playerCategory?: string;
  entryType?: "singles" | "doubles";
  hasPartner?: boolean;
  partnerName?: string;
  needsPartner?: boolean;
  joinedAt?: string;
}

function AdminTournamentViewPage() {
  const { id } = useParams();
  const { userData } = useAuth();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>(
    [],
  );
  const [courts, setCourts] = useState<Court[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempDate, setTempDate] = useState("");
  const [tempHour, setTempHour] = useState("");
  const [tempType, setTempType] = useState("singles");
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [tempCourts, setTempCourts] = useState<string[]>([]);
  const [tempCapacity, setTempCapacity] = useState<CapacityByCategory>({});
  const [tempStatus, setTempStatus] = useState<"Open" | "Full" | "Closed">(
    "Open",
  );

  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const tournamentsData = (await getTournaments()) as Tournament[];
        const selectedTournament = tournamentsData.find(
          (item) => item.id === id,
        );

        if (!selectedTournament) {
          setError("Tournament not found.");
          return;
        }

        const registrationsData = (await getTournamentRegistrations(
          id,
        )) as TournamentRegistration[];

        setTournament(selectedTournament);
        setRegistrations(registrationsData);

        if (userData?.uid) {
          const courtsData = (await getAdminCourts(userData.uid)) as Court[];
          setCourts(courtsData);
        }
      } catch (err) {
        console.error("Error loading tournament:", err);
        setError("Error loading tournament.");
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id, userData?.uid]);

  const singlesPlayers = registrations.filter(
    (registration) => registration.entryType === "singles",
  );

  const doublesPairs = registrations.filter(
    (registration) => registration.entryType === "doubles",
  );

  const playersLookingForPartner = registrations.filter(
    (registration) =>
      registration.entryType === "doubles" && registration.needsPartner,
  );

  const totalSinglesSpots = tournament?.capacityByCategory
    ? Object.values(tournament.capacityByCategory).reduce(
        (total, category) => total + (category.singlesPlayers || 0),
        0,
      )
    : 0;

  const totalDoublesPairs = tournament?.capacityByCategory
    ? Object.values(tournament.capacityByCategory).reduce(
        (total, category) => total + (category.doublesPairs || 0),
        0,
      )
    : 0;

  const usedSinglesSpots = singlesPlayers.length;
  const usedDoublesPairs = doublesPairs.length;

  const availableSinglesSpots = Math.max(
    totalSinglesSpots - usedSinglesSpots,
    0,
  );

  const availableDoublesPairs = Math.max(
    totalDoublesPairs - usedDoublesPairs,
    0,
  );

  const tournamentStatus =
    tournament?.status === "Closed"
      ? "Closed"
      : availableSinglesSpots <= 0 && availableDoublesPairs <= 0
        ? "Full"
        : "Open";

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleOpen = () => {
    if (!tournament) return;

    setTempName(tournament.name || "");
    setTempDate(tournament.date || "");
    setTempHour(tournament.hour || "");
    setTempType(tournament.tournamentType || "singles");
    setTempCategories(tournament.categories || []);
    setTempCourts(tournament.courts || []);
    setTempCapacity(tournament.capacityByCategory || {});
    setTempStatus(tournament.status || tournamentStatus);
    setError("");
    setSuccessMsg("");
    setShowModal(true);
  };

  const handleCategoryChange = (category: string) => {
    setTempCategories((prev) => {
      if (prev.includes(category)) {
        const updated = prev.filter((item) => item !== category);

        const updatedCapacity = { ...tempCapacity };
        delete updatedCapacity[category];
        setTempCapacity(updatedCapacity);

        return updated;
      }

      setTempCapacity((prevCapacity) => ({
        ...prevCapacity,
        [category]: prevCapacity[category] || {
          singlesPlayers: 0,
          doublesPairs: 0,
        },
      }));

      return [...prev, category];
    });
  };

  const handleCourtChange = (courtName: string) => {
    setTempCourts((prev) =>
      prev.includes(courtName)
        ? prev.filter((item) => item !== courtName)
        : [...prev, courtName],
    );
  };

  const handleCapacityChange = (
    category: string,
    field: "singlesPlayers" | "doublesPairs",
    value: string,
  ) => {
    const numericValue = Number(value);

    setTempCapacity((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: numericValue < 0 ? 0 : numericValue,
      },
    }));
  };

  const getUsedSinglesByCategory = (category: string) => {
    return registrations.filter(
      (registration) =>
        registration.entryType === "singles" &&
        registration.playerCategory === category,
    ).length;
  };

  const getUsedDoublesByCategory = (category: string) => {
    return registrations.filter(
      (registration) =>
        registration.entryType === "doubles" &&
        registration.playerCategory === category,
    ).length;
  };

  const validateEditForm = () => {
    if (!tempName.trim()) {
      setError("Tournament name is required.");
      return false;
    }

    if (!tempDate) {
      setError("Tournament date is required.");
      return false;
    }

    if (!tempHour.trim()) {
      setError("Tournament hour is required.");
      return false;
    }

    if (!tempType) {
      setError("Tournament type is required.");
      return false;
    }

    if (tempCategories.length === 0) {
      setError("Select at least one category.");
      return false;
    }

    if (tempCourts.length === 0) {
      setError("Select at least one court.");
      return false;
    }

    for (const category of tempCategories) {
      const usedSingles = getUsedSinglesByCategory(category);
      const usedDoubles = getUsedDoublesByCategory(category);

      const singlesCapacity = tempCapacity[category]?.singlesPlayers || 0;
      const doublesCapacity = tempCapacity[category]?.doublesPairs || 0;

      if (
        (tempType === "singles" || tempType === "both") &&
        singlesCapacity < usedSingles
      ) {
        setError(
          `Singles capacity for ${category} cannot be lower than current registrations (${usedSingles}).`,
        );
        return false;
      }

      if (
        (tempType === "doubles" || tempType === "both") &&
        doublesCapacity < usedDoubles
      ) {
        setError(
          `Doubles capacity for ${category} cannot be lower than current pairs (${usedDoubles}).`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!tournament) return;

    setError("");
    setSuccessMsg("");

    if (!validateEditForm()) return;

    try {
      const cleanedCapacity: CapacityByCategory = {};

      tempCategories.forEach((category) => {
        cleanedCapacity[category] = {
          singlesPlayers:
            tempType === "singles" || tempType === "both"
              ? tempCapacity[category]?.singlesPlayers || 0
              : 0,
          doublesPairs:
            tempType === "doubles" || tempType === "both"
              ? tempCapacity[category]?.doublesPairs || 0
              : 0,
        };
      });

      const updatedInfo = `${tempDate} - ${tempHour} - Type: ${
        tempType === "both"
          ? "Singles and Doubles"
          : tempType === "doubles"
            ? "Doubles"
            : "Singles"
      } - Courts: ${tempCourts.join(", ")} - Categories: ${tempCategories.join(
        ", ",
      )}`;

      await updateTournament(tournament.id, {
        name: tempName.trim(),
        date: tempDate,
        hour: tempHour.trim(),
        tournamentType: tempType,
        categories: tempCategories,
        courts: tempCourts,
        capacityByCategory: cleanedCapacity,
        status: tempStatus,
        info: updatedInfo,
      });

      setTournament({
        ...tournament,
        name: tempName.trim(),
        date: tempDate,
        hour: tempHour.trim(),
        tournamentType: tempType,
        categories: tempCategories,
        courts: tempCourts,
        capacityByCategory: cleanedCapacity,
        status: tempStatus,
        info: updatedInfo,
      });

      setSuccessMsg("Tournament updated successfully.");
      setShowModal(false);
    } catch (err) {
      console.error("Error updating tournament:", err);
      setError("Error updating tournament.");
    }
  };

  if (loading) {
    return (
      <div className="admin-tournament-view">
        <div className="admin-tournament-view__grid">
          <section className="admin-tournament-view__main">
            <p>Loading tournament...</p>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="admin-tournament-view">
        <div className="admin-tournament-view__grid">
          <section className="admin-tournament-view__main">
            <div className="admin-tournament-view__card">
              <h2 className="admin-tournament-view__title">
                Tournament not found
              </h2>
              {error && <p>{error}</p>}
            </div>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tournament-view">
      <div className="admin-tournament-view__grid">
        <section className="admin-tournament-view__main">
          {successMsg && (
            <p
              style={{
                background: "#e8f8ee",
                color: "#2f9e44",
                borderRadius: "12px",
                padding: "0.8rem 1rem",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              {successMsg}
            </p>
          )}

          {error && (
            <p
              style={{
                background: "#ffe8e8",
                color: "#e05252",
                borderRadius: "12px",
                padding: "0.8rem 1rem",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              {error}
            </p>
          )}

          <div className="admin-tournament-view__card">
            <h2 className="admin-tournament-view__title">{tournament.name}</h2>

            <div className="admin-tournament-view__body">
              <img
                src={tournament.image || court1}
                alt={tournament.name}
                className="admin-tournament-view__image"
              />

              <div className="admin-tournament-view__info">
                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Info: </span>
                  {tournament.info}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Date: </span>
                  {tournament.date || "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Hour: </span>
                  {tournament.hour || "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Type: </span>
                  {tournament.tournamentType || "Singles"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Courts: </span>
                  {tournament.courts?.length
                    ? tournament.courts.join(", ")
                    : "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">
                    Categories:{" "}
                  </span>
                  {tournament.categories?.length
                    ? tournament.categories.join(", ")
                    : "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Status: </span>
                  {tournamentStatus}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">
                    Players:{" "}
                  </span>
                  {usedSinglesSpots}/{totalSinglesSpots}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Pairs: </span>
                  {usedDoublesPairs}/{totalDoublesPairs}
                </p>
              </div>
            </div>

            <button
              className="admin-tournament-view__edit-btn"
              onClick={handleOpen}
            >
              Edit Tournament
            </button>
          </div>

          <div
            className="admin-tournament-view__card"
            style={{ marginTop: "1.5rem" }}
          >
            <h2 className="admin-tournament-view__title">Registered Players</h2>

            <p className="admin-tournament-view__detail">
              <span className="admin-tournament-view__label">
                Singles Players:{" "}
              </span>
              {usedSinglesSpots}/{totalSinglesSpots}
            </p>

            <p className="admin-tournament-view__detail">
              <span className="admin-tournament-view__label">
                Doubles Pairs:{" "}
              </span>
              {usedDoublesPairs}/{totalDoublesPairs}
            </p>

            <p className="admin-tournament-view__detail">
              <span className="admin-tournament-view__label">
                Players looking for partner:{" "}
              </span>
              {playersLookingForPartner.length}
            </p>

            <h3 style={{ marginTop: "1.5rem" }}>Singles</h3>

            {singlesPlayers.length === 0 ? (
              <p>No singles players registered yet.</p>
            ) : (
              singlesPlayers.map((player) => (
                <div
                  key={player.id}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "#f6f6f6",
                    marginTop: "0.75rem",
                  }}
                >
                  <p>
                    <strong>{player.playerUsername || "Unknown player"}</strong>
                  </p>
                  <p>Category: {player.playerCategory || "Not specified"}</p>
                  <p>Joined: {formatDate(player.joinedAt)}</p>
                </div>
              ))
            )}

            <h3 style={{ marginTop: "1.5rem" }}>Doubles Pairs</h3>

            {doublesPairs.length === 0 ? (
              <p>No doubles pairs registered yet.</p>
            ) : (
              doublesPairs.map((pair) => (
                <div
                  key={pair.id}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "#f6f6f6",
                    marginTop: "0.75rem",
                  }}
                >
                  <p>
                    <strong>{pair.playerUsername || "Unknown player"}</strong>
                    {pair.hasPartner && pair.partnerName
                      ? ` + ${pair.partnerName}`
                      : ""}
                  </p>
                  <p>Category: {pair.playerCategory || "Not specified"}</p>
                  <p>
                    Partner status:{" "}
                    {pair.needsPartner
                      ? "Needs partner"
                      : pair.hasPartner
                        ? "Has partner"
                        : "Not specified"}
                  </p>
                  <p>Joined: {formatDate(pair.joinedAt)}</p>
                </div>
              ))
            )}

            <h3 style={{ marginTop: "1.5rem" }}>Players Who Need a Partner</h3>

            {playersLookingForPartner.length === 0 ? (
              <p>No players are looking for a partner.</p>
            ) : (
              playersLookingForPartner.map((player) => (
                <div
                  key={player.id}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "12px",
                    background: "#fff4df",
                    marginTop: "0.75rem",
                  }}
                >
                  <p>
                    <strong>{player.playerUsername || "Unknown player"}</strong>
                  </p>
                  <p>Category: {player.playerCategory || "Not specified"}</p>
                  <p>Joined: {formatDate(player.joinedAt)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <AdBanners />
      </div>

      {showModal && (
        <div className="admin-tournament-view__modal-overlay">
          <div className="admin-tournament-view__modal">
            <button
              className="admin-tournament-view__modal-close"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="admin-tournament-view__modal-title">
              Edit Tournament
            </h2>

            <div className="admin-tournament-view__modal-section">
              <label className="admin-tournament-view__modal-label">
                Name:
              </label>
              <input
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />

              <label className="admin-tournament-view__modal-label">
                Date:
              </label>
              <input
                type="date"
                className="admin-tournament-view__modal-input"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
              />

              <label className="admin-tournament-view__modal-label">
                Hour:
              </label>
              <input
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempHour}
                onChange={(e) => setTempHour(e.target.value)}
              />

              <label className="admin-tournament-view__modal-label">
                Tournament Type:
              </label>
              <select
                className="admin-tournament-view__modal-input"
                value={tempType}
                onChange={(e) => setTempType(e.target.value)}
              >
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
                <option value="both">Singles and Doubles</option>
              </select>

              <label className="admin-tournament-view__modal-label">
                Categories:
              </label>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {categoryOptions.map((category) => (
                  <label
                    key={category}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tempCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>

              {tempCategories.length > 0 && (
                <div style={{ display: "grid", gap: "1rem" }}>
                  <label className="admin-tournament-view__modal-label">
                    Capacity by Category:
                  </label>

                  {tempCategories.map((category) => (
                    <div
                      key={category}
                      style={{
                        background: "#3a3a3a",
                        borderRadius: "12px",
                        padding: "1rem",
                        display: "grid",
                        gap: "0.75rem",
                      }}
                    >
                      <strong style={{ color: "white" }}>{category}</strong>

                      {(tempType === "singles" || tempType === "both") && (
                        <input
                          type="number"
                          min={getUsedSinglesByCategory(category)}
                          className="admin-tournament-view__modal-input"
                          value={tempCapacity[category]?.singlesPlayers || 0}
                          onChange={(e) =>
                            handleCapacityChange(
                              category,
                              "singlesPlayers",
                              e.target.value,
                            )
                          }
                          placeholder={`Singles minimum: ${getUsedSinglesByCategory(
                            category,
                          )}`}
                        />
                      )}

                      {(tempType === "doubles" || tempType === "both") && (
                        <input
                          type="number"
                          min={getUsedDoublesByCategory(category)}
                          className="admin-tournament-view__modal-input"
                          value={tempCapacity[category]?.doublesPairs || 0}
                          onChange={(e) =>
                            handleCapacityChange(
                              category,
                              "doublesPairs",
                              e.target.value,
                            )
                          }
                          placeholder={`Doubles minimum: ${getUsedDoublesByCategory(
                            category,
                          )}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <label className="admin-tournament-view__modal-label">
                Courts:
              </label>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {courts.map((court) => (
                  <label
                    key={court.id}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={tempCourts.includes(court.name)}
                      onChange={() => handleCourtChange(court.name)}
                    />
                    {court.name}
                  </label>
                ))}
              </div>

              <label className="admin-tournament-view__modal-label">
                Status:
              </label>
              <select
                className="admin-tournament-view__modal-input"
                value={tempStatus}
                onChange={(e) =>
                  setTempStatus(e.target.value as "Open" | "Full" | "Closed")
                }
              >
                <option value="Open">Open</option>
                <option value="Full">Full</option>
                <option value="Closed">Closed</option>
              </select>

              {error && (
                <p
                  style={{
                    color: "#e05252",
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              className="admin-tournament-view__modal-confirm"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTournamentViewPage;
