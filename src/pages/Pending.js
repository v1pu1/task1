import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Pending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [triggerReason, setTriggerReason] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [closeData, setCloseData] = useState({
    email: "",
    uar: "",
    reason: "",
    note: "",
    chargeClosureFee: false,
  });

  const openModal = () => {
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch("/data.json") // Accessing from the public folder
      .then((response) => response.json())
      .then((data) => {
        setData(data.pending);
        setFilterData(data.pending);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase().trim())
      )
    );
    setFilterData(filtered);
  }, [search, data]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.triggerReason.includes(triggerReason)
    );
    setFilterData(filtered);
  }, [triggerReason, data]);

  useEffect(() => {
    const filtered = data.filter((item) => item.riskLevel.includes(riskLevel));
    setFilterData(filtered);
  }, [riskLevel, data]);


  

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const sortedData = [...filterData].sort((a, b) => {
      const aValue = sortColumn ? a[sortColumn] : null;
      const bValue = sortColumn ? b[sortColumn] : null;

      if (aValue && bValue) {
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilterData(sortedData);
  }, [sortColumn, sortDirection]);

  const renderSortIndicator = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? " ▲" : " ▼";
    }
    return null;
  };

  const optionStyle = {
    fontWeight: "bold",
    color: "#4643ee",
    backgroundColor: "#ededfe", 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCloseData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    // Handle the submission logic, you can use closeData here
    console.log("Close Data:", closeData);

    // Reset form data if needed
    setCloseData({
      email: "",
      uar: "",
      reason: "",
      note: "",
      chargeClosureFee: false,
    });

    // Close the modal
    closeModal();
  };

  return (
    <div className="container mt-3">
      <h2>Monitoring</h2>
      <div className="top-buttons">
      <div className="top-left-buttons">
      <button
        className={location.pathname === "/monitoring/pending" ? "active" : ""}
        onClick={() => navigate("/monitoring/pending")}
      >
        Pending
      </button>
      <button
        className={location.pathname === "/monitoring/completed" ? "active" : ""}
        onClick={() => navigate("/monitoring/completed")}
      >
        Completed
      </button>
        </div>

        <div className="top-right-buttons">
          <button onClick={openModal}>
            Close account
          </button>
        </div>
      </div>
      <hr />

      <div className="search-container" style={{ marginTop: "35px" }}>
      <input
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select placeholder="Trigger Reason"  onChange={(e) => setTriggerReason(e.target.value)} className="form-select">
          <option value={""} style={{ fontWeight: "bold", color: "#555" }}>
            Trigger Reason
          </option>
          <option value={"Hard Flag"} style={optionStyle}>
            Hard Flag
          </option>
          <option value={"Temp Flag"} style={optionStyle}>
            Temp Flag
          </option>
          <option value={"Restricted Flag"} style={optionStyle}>
            Restricted Flag
          </option>
          <option value={"Un Flag"} style={optionStyle}>
            Un Flag
          </option>
          <option value={"Reviewed"} style={optionStyle}>
            Reviewed
          </option>
          <option value={""} style={optionStyle}>
            All
          </option>
        </select>

        <select placeholder="Risk Level" onChange={(e) => setRiskLevel(e.target.value)} className="form-select">
          <option value={""} style={{ fontWeight: "bold", color: "#555" }}>
            Risk Level
          </option>
          <option value={"Low"} style={optionStyle}>
            Low
          </option>
          <option value={"Medium"} style={optionStyle}>
            Medium
          </option>
          <option value={"High"} style={optionStyle}>
            High
          </option>
          <option value={""} style={optionStyle}>
            All
          </option>
        </select>


      </div>

      <div className="my-4 table-responsive">
        <table className="tabl">
          <thead className="thead">
            <tr>
            <th onClick={() => handleSort("user")}>
                User{renderSortIndicator("user")}
              </th>
              <th onClick={() => handleSort("riskLevel")}>
                Risk Level{renderSortIndicator("riskLevel")}
              </th>
              <th onClick={() => handleSort("triggerReason")}>
                Trigger Reason{renderSortIndicator("triggerReason")}
              </th>
              <th onClick={() => handleSort("inQueueFor")}>
                In queue for{renderSortIndicator("inQueueFor")}
              </th>
              <th onClick={() => handleSort("dateAddedOn")}>
                Date added on{renderSortIndicator("dateAddedOn")}
              </th>
              <th onClick={() => handleSort("previouslyReviewed")}>
                Previously reviewed{renderSortIndicator("previouslyReviewed")}
              </th>
            </tr>
          </thead>
          <tbody>
          {filterData?.map((ele, index) => (
              <tr key={index}>
                <td>
                  <strong>{ele.user}</strong> <br />{" "}
                  <strong className="email">{ele.userEmail}</strong>
                </td>
                <td>
                  <strong
                    className={
                      ele.riskLevel === "Low"
                        ? "risk-green"
                        : ele.riskLevel === "Medium"
                        ? "risk-orange"
                        : ele.riskLevel === "High"
                        ? "risk-red"
                        : ""
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-circle-fill mx-1"
                      viewBox="0 0 16 16"
                    >
                      <circle cx="6" cy="6" r="6" />
                    </svg>
                    {ele.riskLevel}
                  </strong>
                </td>
                <td>{ele.triggerReason}</td>
                <td>
                  <strong>{ele.inQueueFor}</strong>
                </td>
                <td>{ele.dateAddedOn}</td>
                <td>
                  <strong>{ele.previouslyReviewed}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-container" onClick={closeModal}>
          <div className="pop-up" onClick={(e) => e.stopPropagation()}>
          <div className="">
              <span className="close-btn" onClick={closeModal}>
                &times;
              </span>
              <h4>Close account</h4>
      <div className="my-4">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={closeData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="form-label">Want to file UAR</label>
        <input
          id="yes-uar"
          style={{ marginLeft: "25px" }}
          type="radio"
          name="uar"
          // checked={closeData.uar === "yes-uar"}
          value={closeData.uar}
          onChange={handleChange}
        />{" "}
        <label htmlFor="yes-uar">Yes</label>
        <input
          id="no-uar"
          style={{ marginLeft: "15px" }}
          type="radio"
          name="uar"
          // checked={closeData.uar === "no-uar"}
          value={closeData.uar}
          onChange={handleChange}
        />{" "}
        <label htmlFor="no-uar">No</label>
      </div>
      <div className="mb-4">
        <label className="form-label">Reason</label>
        <select
          className="form-select"
          name="reason"
          value={closeData.reason}
          onChange={handleChange}
        >
          <option value="">Reason</option>
          <option value="Reason 1">Reason 1</option>
          <option value="Reason 2">Reason 2</option>
          <option value="Reason 3">Reason 3</option>
          <option value="Reason 4">Reason 4</option>
          <option value="Reason 5">Reason 5</option> 
        </select>
      </div>
      <div className="mb-4">
        <label className="form-label">Note</label>
        <textarea
          className="form-control"
          name="note"
          value={closeData.note}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="pop-up-button">
        <div>
          <input
            id="fee"
            style={{ marginRight: "5px" }}
            type="checkbox"
            name="chargeClosureFee"
            checked={closeData.chargeClosureFee}
            onChange={handleChange}
          />
          <label htmlFor="fee">Charge closure fee</label>
        </div>
        <button onClick={handleSubmit} className="close-acc">
          Close account
        </button>
      </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pending;

