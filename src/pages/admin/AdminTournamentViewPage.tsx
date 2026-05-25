import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import { useCourts, useTournaments } from "../../context";
import { useAuth } from "../../context/useAuth";
import type { Tournament } from "../../context/TournamentsContext";
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

function AdminTournamentViewPage() {
  const { id } = useParams();
  const { userData } = useAuth();

  const {
    selectedTournament,
    registrations,
    loading: tournamentLoading,
    error: tournamentError,
    loadTournamentById,
    loadTournamentRegistrations,
    editTournament,
    clearTournamentError,
  } = useTournaments();

  const {
    adminCourts,
    loading: courtsLoading,
    error: courtsError,
    loadAdminCourts,
    clearCourtError,
  } = useCourts();

  const tournament = selectedTournament as Tournament | null;

  const [successMsg, setSuccessMsg] = useState("");
  const [localError, setLocalError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempDate, setTempDate] = useState("");
  const [tempHour, setTempHour] = useState("");
  const [tempType, setTempType] = useState<"singles" | "doubles" | "both">(
    "singles",
  );
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [tempCourts, setTempCourts] = useState<string[]>([]);
  const [tempCapacity, setTempCapacity] = useState<CapacityByCategory>({});
  const [tempStatus, setTempStatus] = useState<"Open" | "Full" | "Closed">(
    "Open",
  );

  const loading = tournamentLoading || courtsLoading;
  const error = localError || tournamentError || courtsError;

  useEffect(() => {
    const fetchTournamentData = async () => {
      if (!id) return;

      clearTournamentError();
      clearCourtError();
      setLocalError("");

      try {
        const selectedTournamentData = await loadTournamentById(id);

        if (!selectedTournamentData) {
          setLocalError("Tournament not found.");
          return;
        }

        await loadTournamentRegistrations(id);

        if (userData?.uid) {
          await loadAdminCourts(userData.uid);
        }
      } catch (err) {
        console.error("Error loading tournament:", err);
        setLocalError("Error loading tournament.");
      }
    };

    fetchTournamentData();
  }, [
    id,
    userData?.uid,
    loadTournamentById,
    loadTournamentRegistrations,
    loadAdminCourts,
    clearTournamentError,
    clearCourtError,
  ]);

  const singlesPlayers = useMemo(
    () =>
      registrations.filter(
        (registration) => registration.entryType === "singles",
      ),
    [registrations],
  );

  const doublesPairs = useMemo(
    () =>
      registrations.filter(
        (registration) => registration.entryType === "doubles",
      ),
    [registrations],
  );

  const playersLookingForPartner = useMemo(
    () =>
      registrations.filter(
        (registration) =>
          registration.entryType === "doubles" && registration.needsPartner,
      ),
    [registrations],
  );

const totalSinglesSpots = useMemo(() => {
  if (!tournament?.capacityByCategory) return 0;

  return Object.values(tournament.capacityByCategory).reduce(
    (total, category) => total + (category.singlesPlayers || 0),
    0,
  );
}, [tournament]);

const totalDoublesPairs = useMemo(() => {
  if (!tournament?.capacityByCategory) return 0;

  return Object.values(tournament.capacityByCategory).reduce(
    (total, category) => total + (category.doublesPairs || 0),
    0,
  );
}, [tournament]);

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

  const getTypeLabel = (type?: string) => {
    if (type === "both") return "Singles and Doubles";
    if (type === "doubles") return "Doubles";
    return "Singles";
  };

  const handleOpen = () => {
    if (!tournament) return;

    setTempName(tournament.name || "");
    setTempDate(typeof tournament.date === "string" ? tournament.date : "");
    setTempHour(typeof tournament.hour === "string" ? tournament.hour : "");
    setTempType(
      tournament.tournamentType === "doubles" ||
        tournament.tournamentType === "both"
        ? tournament.tournamentType
        : "singles",
    );
    setTempCategories(tournament.categories || []);
    setTempCourts(tournament.courts || []);
    setTempCapacity(tournament.capacityByCategory || {});
    setTempStatus(tournament.status || tournamentStatus);
    setLocalError("");
    clearTournamentError();
    clearCourtError();
    setSuccessMsg("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLocalError("");
    clearTournamentError();
    clearCourtError();
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
    const numericValue = Number(value.replace(/\D/g, ""));

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
      setLocalError("Tournament name is required.");
      return false;
    }

    if (!tempDate) {
      setLocalError("Tournament date is required.");
      return false;
    }

    if (!tempHour.trim()) {
      setLocalError("Tournament hour is required.");
      return false;
    }

    const selectedDateTime = new Date(`${tempDate}T${tempHour}`);
    const now = new Date();

    if (selectedDateTime < now) {
      setLocalError("Please select a future date and hour for the tournament.");
      return false;
    }

    if (!tempType) {
      setLocalError("Tournament type is required.");
      return false;
    }

    if (tempCategories.length === 0) {
      setLocalError("Select at least one category.");
      return false;
    }

    if (tempCourts.length === 0) {
      setLocalError("Select at least one court.");
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
        setLocalError(
          `Singles capacity for ${category} cannot be lower than current registrations (${usedSingles}).`,
        );
        return false;
      }

      if (
        (tempType === "doubles" || tempType === "both") &&
        doublesCapacity < usedDoubles
      ) {
        setLocalError(
          `Doubles capacity for ${category} cannot be lower than current pairs (${usedDoubles}).`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!tournament) return;

    setLocalError("");
    clearTournamentError();
    clearCourtError();
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

      const updatedInfo = `${tempDate} - ${tempHour} - Type: ${getTypeLabel(
        tempType,
      )} - Courts: ${tempCourts.join(
        ", ",
      )} - Categories: ${tempCategories.join(", ")}`;

      await editTournament(tournament.id, {
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

      await loadTournamentById(tournament.id);
      await loadTournamentRegistrations(tournament.id);

      setSuccessMsg("Tournament updated successfully.");
      setShowModal(false);
    } catch (err) {
      console.error("Error updating tournament:", err);
      setLocalError("Error updating tournament.");
    }
  };

  if (loading) {
    return (
      <div className="admin-tournament-view">
        <div className="admin-tournament-view__grid">
          <section className="admin-tournament-view__main">
            <p role="status">Loading tournament...</p>
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

              {error && <p role="alert">{error}</p>}
            </div>
          </section>

          <AdBanners />
        </div>
      </div>
    );
  }

  const tournamentName = tournament.name || "Tournament";
  const tournamentImage =
    typeof tournament.image === "string" ? tournament.image : court1;

  return (
    <div className="admin-tournament-view">
      <div className="admin-tournament-view__grid">
        <section className="admin-tournament-view__main">
          {successMsg && (
            <p
              role="status"
              style={{
                background: "#e8f8ee",
                color: "#1f7a3a",
                borderRadius: "12px",
                padding: "0.8rem 1rem",
                fontWeight: 800,
                marginBottom: "1rem",
              }}
            >
              ✓ {successMsg}
            </p>
          )}

          {error && (
            <p
              role="alert"
              style={{
                background: "#ffe8e8",
                color: "#b42318",
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
            <h2 className="admin-tournament-view__title">{tournamentName}</h2>

            <div className="admin-tournament-view__body">
              <img
                src={tournamentImage || court1}
                alt={`${tournamentName} tournament image`}
                className="admin-tournament-view__image"
                onError={(event) => {
                  event.currentTarget.src = court1;
                }}
              />

              <div className="admin-tournament-view__info">
                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Info: </span>
                  {tournament.info}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Date: </span>
                  {typeof tournament.date === "string"
                    ? tournament.date
                    : "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Hour: </span>
                  {typeof tournament.hour === "string"
                    ? tournament.hour
                    : "Not specified"}
                </p>

                <p className="admin-tournament-view__detail">
                  <span className="admin-tournament-view__label">Type: </span>
                  {getTypeLabel(tournament.tournamentType)}
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
              type="button"
              className="admin-tournament-view__edit-btn"
              aria-label={`Edit ${tournamentName}`}
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
                    border: "1px solid #f2c46d",
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
              type="button"
              className="admin-tournament-view__modal-close"
              aria-label="Close edit tournament modal"
              onClick={handleCloseModal}
            >
              ✕
            </button>

            <h2 className="admin-tournament-view__modal-title">
              Edit Tournament
            </h2>

            <div className="admin-tournament-view__modal-section">
              <label
                className="admin-tournament-view__modal-label"
                htmlFor="edit-tournament-name"
              >
                Name:
              </label>

              <input
                id="edit-tournament-name"
                type="text"
                className="admin-tournament-view__modal-input"
                value={tempName}
                required
                onChange={(e) => setTempName(e.target.value)}
              />

              <label
                className="admin-tournament-view__modal-label"
                htmlFor="edit-tournament-date"
              >
                Date:
              </label>

              <input
                id="edit-tournament-date"
                type="date"
                className="admin-tournament-view__modal-input"
                value={tempDate}
                required
                onChange={(e) => setTempDate(e.target.value)}
              />

              <label
                className="admin-tournament-view__modal-label"
                htmlFor="edit-tournament-hour"
              >
                Hour:
              </label>

              <input
                id="edit-tournament-hour"
                type="time"
                className="admin-tournament-view__modal-input"
                value={tempHour}
                required
                onChange={(e) => setTempHour(e.target.value)}
              />

              <label
                className="admin-tournament-view__modal-label"
                htmlFor="edit-tournament-type"
              >
                Tournament Type:
              </label>

              <select
                id="edit-tournament-type"
                className="admin-tournament-view__modal-input"
                value={tempType}
                required
                onChange={(e) =>
                  setTempType(e.target.value as "singles" | "doubles" | "both")
                }
              >
                <option value="singles">Singles</option>
                <option value="doubles">Doubles</option>
                <option value="both">Singles and Doubles</option>
              </select>

              <p className="admin-tournament-view__modal-label">Categories:</p>

              <div style={{ display: "grid", gap: "0.5rem" }}>
                {categoryOptions.map((category) => {
                  const isSelected = tempCategories.includes(category);
                  const categoryId = `edit-category-${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`;

                  return (
                    <label
                      key={category}
                      htmlFor={categoryId}
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        color: "white",
                        fontWeight: 700,
                        border: isSelected
                          ? "2px solid #bfe212"
                          : "2px solid transparent",
                        borderRadius: "10px",
                        padding: "0.45rem",
                      }}
                    >
                      <input
                        id={categoryId}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {isSelected ? `✓ ${category}` : category}
                    </label>
                  );
                })}
              </div>

              {tempCategories.length > 0 && (
                <div style={{ display: "grid", gap: "1rem" }}>
                  <p className="admin-tournament-view__modal-label">
                    Capacity by Category:
                  </p>

                  {tempCategories.map((category) => {
                    const categorySlug = category
                      .toLowerCase()
                      .replace(/\s+/g, "-");

                    return (
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
                          <>
                            <label
                              className="admin-tournament-view__modal-label"
                              htmlFor={`${categorySlug}-edit-singles-capacity`}
                            >
                              Singles capacity:
                            </label>

                            <input
                              id={`${categorySlug}-edit-singles-capacity`}
                              type="text"
                              inputMode="numeric"
                              className="admin-tournament-view__modal-input"
                              value={tempCapacity[category]?.singlesPlayers || 0}
                              required
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
                          </>
                        )}

                        {(tempType === "doubles" || tempType === "both") && (
                          <>
                            <label
                              className="admin-tournament-view__modal-label"
                              htmlFor={`${categorySlug}-edit-doubles-capacity`}
                            >
                              Doubles capacity:
                            </label>

                            <input
                              id={`${categorySlug}-edit-doubles-capacity`}
                              type="text"
                              inputMode="numeric"
                              className="admin-tournament-view__modal-input"
                              value={tempCapacity[category]?.doublesPairs || 0}
                              required
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
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="admin-tournament-view__modal-label">Courts:</p>

              <div style={{ display: "grid", gap: "0.5rem" }}>
                {adminCourts.map((court) => {
                  const courtName = court.name || "Unnamed court";
                  const isSelected = tempCourts.includes(courtName);
                  const courtId = `edit-tournament-court-${court.id}`;

                  return (
                    <label
                      key={court.id}
                      htmlFor={courtId}
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "center",
                        color: "white",
                        fontWeight: 700,
                        border: isSelected
                          ? "2px solid #bfe212"
                          : "2px solid transparent",
                        borderRadius: "10px",
                        padding: "0.45rem",
                      }}
                    >
                      <input
                        id={courtId}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCourtChange(courtName)}
                      />
                      {isSelected ? `✓ ${courtName}` : courtName}
                    </label>
                  );
                })}
              </div>

              <label
                className="admin-tournament-view__modal-label"
                htmlFor="edit-tournament-status"
              >
                Status:
              </label>

              <select
                id="edit-tournament-status"
                className="admin-tournament-view__modal-input"
                value={tempStatus}
                required
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
                  role="alert"
                  style={{
                    color: "#ffb4b4",
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="button"
              className="admin-tournament-view__modal-confirm"
              aria-label={`Save changes for ${tournamentName}`}
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