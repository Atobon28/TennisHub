import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdBanners from "../../components/player/AdBanners";
import TournamentCard from "../../components/player/TournamentCard";
import ConfirmModal from "../../components/common/ConfirmModal";
import { Icon } from "@iconify/react";
import { useCourts, useTournaments } from "../../context";
import { useAuth } from "../../context/useAuth";
import "../../styles/admin-tournaments.css";
import "../../styles/create-match.css";

const timeOptions = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

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

function AdminTournamentsPage() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const {
    adminTournaments,
    loading: tournamentsLoading,
    error: tournamentsError,
    loadAdminTournaments,
    createTournament,
    removeTournament,
    clearTournamentError,
  } = useTournaments();

  const {
    adminCourts,
    loading: courtsLoading,
    error: courtsError,
    loadAdminCourts,
    clearCourtError,
  } = useCourts();

  const [showModal, setShowModal] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(
    null,
  );

  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newHour, setNewHour] = useState("");
  const [newTournamentType, setNewTournamentType] = useState<
    "singles" | "doubles" | "both"
  >("singles");

  const [newCategories, setNewCategories] = useState<string[]>([]);
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [capacityInputs, setCapacityInputs] = useState<
    Record<string, { singlesPlayers: string; doublesPairs: string }>
  >({});

  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  const loading = tournamentsLoading || courtsLoading;
  const pageError = tournamentsError || courtsError;

  useEffect(() => {
    if (!userData?.uid) return;

    loadAdminTournaments(userData.uid);
    loadAdminCourts(userData.uid);
  }, [userData?.uid, loadAdminTournaments, loadAdminCourts]);

  useEffect(() => {
    const handler = () => setShowModal(true);

    window.addEventListener("admin:addTournament", handler);

    return () => window.removeEventListener("admin:addTournament", handler);
  }, []);

  const getTournamentTypeLabel = (type?: string) => {
    if (type === "doubles") return "Doubles";
    if (type === "both") return "Singles and Doubles";

    return "Singles";
  };

  const handleCategoryChange = (category: string) => {
    if (newCategories.includes(category)) {
      setNewCategories(newCategories.filter((item) => item !== category));

      setCapacityInputs((prev) => {
        const updated = { ...prev };
        delete updated[category];
        return updated;
      });
    } else {
      setNewCategories([...newCategories, category]);

      setCapacityInputs((prev) => ({
        ...prev,
        [category]: {
          singlesPlayers: "",
          doublesPairs: "",
        },
      }));
    }
  };

  const handleCourtChange = (courtName: string) => {
    if (selectedCourts.includes(courtName)) {
      setSelectedCourts(selectedCourts.filter((item) => item !== courtName));
    } else {
      setSelectedCourts([...selectedCourts, courtName]);
    }
  };

  const handleCapacityChange = (
    category: string,
    field: "singlesPlayers" | "doublesPairs",
    value: string,
  ) => {
    const onlyNumbers = value.replace(/\D/g, "");

    setCapacityInputs((prev) => ({
      ...prev,
      [category]: {
        singlesPlayers: prev[category]?.singlesPlayers || "",
        doublesPairs: prev[category]?.doublesPairs || "",
        [field]: onlyNumbers,
      },
    }));
  };

  const buildCapacityByCategory = () => {
    const capacityByCategory: CapacityByCategory = {};

    newCategories.forEach((category) => {
      const singlesValue = Number(capacityInputs[category]?.singlesPlayers || 0);
      const doublesValue = Number(capacityInputs[category]?.doublesPairs || 0);

      capacityByCategory[category] = {};

      if (newTournamentType === "singles" || newTournamentType === "both") {
        capacityByCategory[category].singlesPlayers = singlesValue;
      }

      if (newTournamentType === "doubles" || newTournamentType === "both") {
        capacityByCategory[category].doublesPairs = doublesValue;
      }
    });

    return capacityByCategory;
  };

  const validateCapacity = () => {
    for (const category of newCategories) {
      const singlesValue = Number(capacityInputs[category]?.singlesPlayers || 0);
      const doublesValue = Number(capacityInputs[category]?.doublesPairs || 0);

      if (
        (newTournamentType === "singles" || newTournamentType === "both") &&
        singlesValue <= 0
      ) {
        setFormError(`Please enter singles player spots for ${category}.`);
        return false;
      }

      if (
        (newTournamentType === "doubles" || newTournamentType === "both") &&
        doublesValue <= 0
      ) {
        setFormError(`Please enter doubles pair spots for ${category}.`);
        return false;
      }
    }

    return true;
  };

  const handleAdd = async () => {
    if (!userData?.uid) return;

    if (
      !newName.trim() ||
      !newDate ||
      !newHour ||
      newCategories.length === 0 ||
      selectedCourts.length === 0 ||
      !newTournamentType
    ) {
      setFormError(
        "Please fill in all fields, select at least one category and one court.",
      );
      return;
    }

    const selectedDateTime = new Date(`${newDate}T${newHour}`);
    const now = new Date();

    if (selectedDateTime < now) {
      setFormError("Please select a future date and hour for the tournament.");
      return;
    }

    if (!validateCapacity()) return;

    setFormError("");
    clearTournamentError();
    clearCourtError();
    setCreating(true);

    const categoriesText = newCategories.join(", ");
    const courtsText = selectedCourts.join(", ");
    const typeText = getTournamentTypeLabel(newTournamentType);
    const capacityByCategory = buildCapacityByCategory();

    const info = `${newDate} - ${newHour} - Type: ${typeText} - Courts: ${courtsText} - Categories: ${categoriesText}`;

    try {
      await createTournament(userData.uid, {
        name: newName.trim(),
        info,
        date: newDate,
        hour: newHour,
        tournamentType: newTournamentType,
        courts: selectedCourts,
        categories: newCategories,
        capacityByCategory,
        createdAt: new Date().toISOString(),
      });

      handleClose();
    } catch (error) {
      console.error("Error adding tournament:", error);
      setFormError("Error creating tournament. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTournament = (tournamentId: string) => {
    setTournamentToDelete(tournamentId);
  };

  const handleCancelDeleteTournament = () => {
    setTournamentToDelete(null);
  };

  const handleConfirmDeleteTournament = async () => {
    if (!tournamentToDelete) return;

    try {
      await removeTournament(tournamentToDelete);
    } catch (error) {
      console.error("Error deleting tournament:", error);
    } finally {
      setTournamentToDelete(null);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setNewName("");
    setNewDate("");
    setNewHour("");
    setNewTournamentType("singles");
    setNewCategories([]);
    setSelectedCourts([]);
    setCapacityInputs({});
    setFormError("");
    clearTournamentError();
    clearCourtError();
    setCreating(false);
  };

  return (
    <div className="admin-tournaments">
      <div className="admin-tournaments__grid">
        <section className="admin-tournaments__main">
          <div
            className="admin-tournaments__section-title-wrap"
            style={{
              justifyContent: "space-between",
              width: "100%",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                className="admin-tournaments__icon-gradient-wrap"
                aria-hidden="true"
              >
                <Icon
                  icon="game-icons:tennis-racket"
                  className="admin-tournaments__section-icon"
                />
              </span>

              <h2 className="admin-tournaments__section-title">
                My Upcoming Tournaments
              </h2>
            </div>

            <button
              type="button"
              className="create-match__btn"
              aria-label={
                adminTournaments.length === 0
                  ? "Create first tournament"
                  : "Add more tournaments"
              }
              onClick={() => setShowModal(true)}
              style={{
                width: "auto",
                padding: "0 1.25rem",
                minHeight: "40px",
                fontSize: "0.85rem",
              }}
            >
              {adminTournaments.length === 0
                ? "Create first tournament"
                : "Add more tournaments"}
            </button>
          </div>

          {loading ? (
            <p className="admin-tournaments__loading" role="status">
              Loading tournaments...
            </p>
          ) : pageError ? (
            <p className="admin-tournaments__loading" role="alert">
              {pageError}
            </p>
          ) : adminTournaments.length === 0 ? (
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.5rem",
                textAlign: "center",
                boxShadow: "0 8px 18px rgba(15, 14, 12, 0.06)",
              }}
            >
              <p className="admin-tournaments__loading">
                You have not created tournaments yet.
              </p>

              <button
                type="button"
                className="create-match__btn"
                aria-label="Create first tournament"
                onClick={() => setShowModal(true)}
                style={{
                  marginTop: "0.75rem",
                  width: "auto",
                  padding: "0 1.25rem",
                }}
              >
                Create first tournament
              </button>
            </div>
          ) : (
            <div className="admin-tournaments__cards-grid">
              {adminTournaments.map((tournament) => (
                <div key={tournament.id}>
                  <TournamentCard
                    level={
                      typeof tournament.level === "number"
                        ? tournament.level
                        : undefined
                    }
                    name={tournament.name}
                    info={tournament.info}
                    buttonLabel="View"
                    onView={() =>
                      navigate(`/admin/tournaments/view/${tournament.id}`)
                    }
                  />

                  <button
                    type="button"
                    className="create-match__btn"
                    aria-label={`Delete ${tournament.name} tournament`}
                    onClick={() => handleDeleteTournament(tournament.id)}
                    style={{
                      marginTop: "0.75rem",
                      backgroundColor: "#b42318",
                      width: "100%",
                    }}
                  >
                    Delete Tournament
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <AdBanners />
      </div>

      {showModal && (
        <div className="admin-tournaments__modal-overlay">
          <div
            className="admin-tournaments__modal"
            style={{
              width: "min(760px, 94vw)",
              maxHeight: "92vh",
              overflowY: "auto",
              padding: "1rem",
            }}
          >
            <button
              type="button"
              className="admin-tournaments__modal-close"
              aria-label="Close create tournament modal"
              onClick={handleClose}
            >
              ✕
            </button>

            <div className="create-match__card">
              <h2 className="create-match__title">Create a new tournament</h2>

              <div className="create-match__section">
                <h3 className="create-match__section-title">
                  1. Tournament Info
                </h3>

                <label
                  className="create-match__label"
                  htmlFor="tournament-name"
                >
                  Name:
                </label>

                <div className="create-match__select-wrap">
                  <input
                    id="tournament-name"
                    type="text"
                    className="create-match__select"
                    placeholder="Tournament name..."
                    value={newName}
                    required
                    onChange={(event) => setNewName(event.target.value)}
                  />
                </div>

                <label
                  className="create-match__label"
                  htmlFor="tournament-type"
                >
                  Tournament Type:
                </label>

                <div className="create-match__select-wrap">
                  <select
                    id="tournament-type"
                    className="create-match__select"
                    value={newTournamentType}
                    required
                    onChange={(event) =>
                      setNewTournamentType(
                        event.target.value as "singles" | "doubles" | "both",
                      )
                    }
                  >
                    <option value="singles">Singles</option>
                    <option value="doubles">Doubles</option>
                    <option value="both">Singles and Doubles</option>
                  </select>
                </div>
              </div>

              <div className="create-match__section">
                <h3 className="create-match__section-title">
                  2. Allowed Categories
                </h3>

                <p className="create-match__label">
                  Select one or more categories:
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                    gap: "0.75rem",
                    marginTop: "0.75rem",
                  }}
                >
                  {categoryOptions.map((category) => {
                    const isSelected = newCategories.includes(category);
                    const categoryId = `category-${category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`;

                    return (
                      <label
                        key={category}
                        htmlFor={categoryId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          backgroundColor: isSelected ? "#111111" : "#25292d",
                          color: "white",
                          padding: "0.75rem",
                          borderRadius: "12px",
                          cursor: "pointer",
                          fontWeight: 700,
                          border: isSelected
                            ? "3px solid #bfe212"
                            : "3px solid transparent",
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
              </div>

              {newCategories.length > 0 && (
                <div className="create-match__section">
                  <h3 className="create-match__section-title">
                    3. Spots by Category
                  </h3>

                  {newCategories.map((category) => {
                    const categorySlug = category
                      .toLowerCase()
                      .replace(/\s+/g, "-");

                    return (
                      <div
                        key={category}
                        style={{
                          border: "1px solid rgba(0,0,0,0.12)",
                          borderRadius: "16px",
                          padding: "1rem",
                          backgroundColor: "#f8f8f8",
                        }}
                      >
                        <h4>{category}</h4>

                        {(newTournamentType === "singles" ||
                          newTournamentType === "both") && (
                          <>
                            <label
                              className="create-match__label"
                              htmlFor={`${categorySlug}-singles-spots`}
                            >
                              Singles player spots:
                            </label>

                            <input
                              id={`${categorySlug}-singles-spots`}
                              type="text"
                              inputMode="numeric"
                              className="create-match__select"
                              placeholder="Example: 16"
                              value={
                                capacityInputs[category]?.singlesPlayers || ""
                              }
                              required
                              onChange={(event) =>
                                handleCapacityChange(
                                  category,
                                  "singlesPlayers",
                                  event.target.value,
                                )
                              }
                            />
                          </>
                        )}

                        {(newTournamentType === "doubles" ||
                          newTournamentType === "both") && (
                          <>
                            <label
                              className="create-match__label"
                              htmlFor={`${categorySlug}-doubles-spots`}
                            >
                              Doubles pair spots:
                            </label>

                            <input
                              id={`${categorySlug}-doubles-spots`}
                              type="text"
                              inputMode="numeric"
                              className="create-match__select"
                              placeholder="Example: 8"
                              value={capacityInputs[category]?.doublesPairs || ""}
                              required
                              onChange={(event) =>
                                handleCapacityChange(
                                  category,
                                  "doublesPairs",
                                  event.target.value,
                                )
                              }
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="create-match__section">
                <h3 className="create-match__section-title">
                  4. Date and Hour
                </h3>

                <label className="create-match__label" htmlFor="tournament-date">
                  Date:
                </label>

                <input
                  id="tournament-date"
                  type="date"
                  className="create-match__select create-match__date-input"
                  value={newDate}
                  required
                  onChange={(event) => setNewDate(event.target.value)}
                />

                <label className="create-match__label" htmlFor="tournament-hour">
                  Hour:
                </label>

                <select
                  id="tournament-hour"
                  className="create-match__select"
                  value={newHour}
                  required
                  onChange={(event) => setNewHour(event.target.value)}
                >
                  <option value="">Select hour</option>

                  {timeOptions.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </div>

              <div className="create-match__section">
                <h3 className="create-match__section-title">5. Courts</h3>

                {adminCourts.length === 0 ? (
                  <p className="create-match__error" role="alert">
                    You need to create a court first.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(170px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {adminCourts.map((court) => {
                      const courtName = court.name || "Unnamed court";
                      const isSelected = selectedCourts.includes(courtName);
                      const courtId = `court-${court.id}`;

                      return (
                        <label
                          key={court.id}
                          htmlFor={courtId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: isSelected
                              ? "#111111"
                              : "#25292d",
                            color: "white",
                            padding: "0.75rem",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: 700,
                            border: isSelected
                              ? "3px solid #bfe212"
                              : "3px solid transparent",
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
                )}
              </div>

              {(formError || pageError) && (
                <p className="create-match__error" role="alert">
                  {formError || pageError}
                </p>
              )}

              <button
                type="button"
                className="create-match__btn"
                aria-label="Create tournament"
                onClick={handleAdd}
                disabled={creating || adminCourts.length === 0}
              >
                {creating ? "Creating..." : "Create Tournament"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(tournamentToDelete)}
        title="Delete tournament?"
        message="Are you sure you want to delete this tournament? This action cannot be undone."
        confirmLabel="Delete Tournament"
        cancelLabel="Cancel"
        danger
        onCancel={handleCancelDeleteTournament}
        onConfirm={handleConfirmDeleteTournament}
      />
    </div>
  );
}

export default AdminTournamentsPage;