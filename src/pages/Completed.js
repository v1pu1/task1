import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Completed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [triggerReason, setTriggerReason] = useState("");
  const [riskLevel, setRiskLevel] = useState("");

  const [closeData, setCloseData] = useState({
    email: "",
    uar: "",
    reason: "",
    note: "",
    chargeClosureFee: false,
  });

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  };
  const closeModal = () => {
    document.body.style.overflow = "auto";
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch("/data.json") 
      .then((response) => response.json())
      .then((data) => {
        setData(data.completed);
        setFilterData(data.completed);
        // console.log(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.user.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.riskLevel.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.actionReason
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        item.timeToClose.includes(search.trim()) ||
        item.dateAddedOn.includes(search.trim()) ||
        item.actionTakenBy
          .toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        item.userEmail.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.actionTakenByEmail.toLowerCase().includes(search.toLowerCase().trim())
    );
    setFilterData(filtered);
  }, [search,data]);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.actionReason.includes(triggerReason)
    );
    setFilterData(filtered);
  }, [triggerReason, data]);

  useEffect(() => {
    const filtered = data.filter((item) => item.riskLevel.includes(riskLevel));
    setFilterData(filtered);
  }, [riskLevel,data]);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-circle mb-1 mx-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
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
        <select onChange={(e) => setTriggerReason(e.target.value)} className="form-select">
          <option value={""}>Trigger Reason</option>
          <option value={"Hard Flag"}>Hard Flag</option>
          <option value={"Temp Flag"}>Temp Flag</option>
          <option value={"Restricted Flag"}>Restricted Flag</option>
          <option value={"Un Flag"}>Un Flag</option>
          <option value={"Reviewed"}>Reviewed</option>
          <option value={""}>All</option>
        </select>
        <select onChange={(e) => setRiskLevel(e.target.value)} className="form-select">
          <option value={""}>Risk Level</option>
          <option value={"Low"}>Low</option>
          <option value={"Medium"}>Medium</option>
          <option value={"High"}>High</option>
          <option value={""}>All</option>
        </select>
      </div>

      <div className="my-4 table-responsive">
        <table className="tabl">
          <thead className="thead">
            <tr>
              <td>User</td>
              <td>Risk Level</td>
              <td>Action Reason</td>
              <td>Time to close</td>
              <td>Date added on</td>
              <td>Action taken by</td>
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
                <td>{ele.actionReason}</td>
                <td>
                  <strong>{ele.timeToClose}</strong>
                </td>
                <td>{ele.dateAddedOn}</td>
                <td>
                  <strong>{ele.actionTakenBy}</strong> <br />{" "}
                  <strong className="email">{ele.actionTakenByEmail}</strong>
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

export default Completed;
